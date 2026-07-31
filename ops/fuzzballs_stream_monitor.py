#!/usr/bin/env python3
"""Observe Voyager's Protect-to-HLS bridge without restarting services."""

from __future__ import annotations

import argparse
import json
import socket
import subprocess
import time
from dataclasses import asdict, dataclass
from pathlib import Path


DEFAULT_STREAMS = {
    "ffmpeg-run": Path("/home/deploy/Projects/fuzzballs/stream/run/index.m3u8"),
    "ffmpeg-roost": Path("/home/deploy/Projects/fuzzballs/stream/roost/index.m3u8"),
}


@dataclass(frozen=True)
class StreamStatus:
    service: str
    service_active: bool
    playlist_age_seconds: int | None
    playlist_fresh: bool


@dataclass(frozen=True)
class MonitorStatus:
    state: str
    protect_available: bool
    streams: tuple[StreamStatus, ...]


def protect_available(host: str, port: int, timeout: float = 3.0) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False


def service_active(service: str) -> bool:
    result = subprocess.run(
        ["systemctl", "is-active", "--quiet", service],
        check=False,
        timeout=5,
    )
    return result.returncode == 0


def playlist_age_seconds(path: Path, now: float | None = None) -> int | None:
    try:
        modified_at = path.stat().st_mtime
    except FileNotFoundError:
        return None
    return max(0, int((time.time() if now is None else now) - modified_at))


def collect_status(
    *,
    host: str,
    port: int,
    freshness_seconds: int,
    streams: dict[str, Path] | None = None,
    now: float | None = None,
) -> MonitorStatus:
    observed_streams = []
    for service, playlist in (streams or DEFAULT_STREAMS).items():
        age = playlist_age_seconds(playlist, now=now)
        observed_streams.append(
            StreamStatus(
                service=service,
                service_active=service_active(service),
                playlist_age_seconds=age,
                playlist_fresh=age is not None and age <= freshness_seconds,
            )
        )

    upstream_available = protect_available(host, port)
    if all(stream.service_active and stream.playlist_fresh for stream in observed_streams):
        state = "healthy"
    elif not upstream_available:
        state = "upstream_unavailable"
    elif any(not stream.service_active for stream in observed_streams):
        state = "local_service_unavailable"
    else:
        state = "recovering"

    return MonitorStatus(
        state=state,
        protect_available=upstream_available,
        streams=tuple(observed_streams),
    )


def emit_transition(status: MonitorStatus, state_file: Path) -> bool:
    previous_state = ""
    try:
        previous_state = state_file.read_text(encoding="utf-8").strip()
    except FileNotFoundError:
        pass

    if previous_state == status.state:
        return False

    state_file.parent.mkdir(parents=True, exist_ok=True)
    state_file.write_text(f"{status.state}\n", encoding="utf-8")
    print(json.dumps(asdict(status), separators=(",", ":"), sort_keys=True))
    return True


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Report Protect/HLS health transitions without restarting services.",
    )
    parser.add_argument("--protect-host", default="192.168.1.1")
    parser.add_argument("--protect-port", type=int, default=7441)
    parser.add_argument("--freshness-seconds", type=int, default=30)
    parser.add_argument(
        "--state-file",
        type=Path,
        default=Path("/var/lib/fuzzballs-stream-monitor/state"),
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    status = collect_status(
        host=args.protect_host,
        port=args.protect_port,
        freshness_seconds=args.freshness_seconds,
    )
    emit_transition(status, args.state_file)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
