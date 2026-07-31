import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from ops.fuzzballs_stream_monitor import collect_status, emit_transition


class StreamMonitorTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        root = Path(self.temp_dir.name)
        self.streams = {
            "ffmpeg-run": root / "run.m3u8",
            "ffmpeg-roost": root / "roost.m3u8",
        }
        for path in self.streams.values():
            path.write_text("#EXTM3U\n", encoding="utf-8")

    def tearDown(self):
        self.temp_dir.cleanup()

    @patch("ops.fuzzballs_stream_monitor.protect_available", return_value=True)
    @patch("ops.fuzzballs_stream_monitor.service_active", return_value=True)
    def test_healthy_when_services_and_playlists_are_current(self, _active, _protect):
        status = collect_status(
            host="protect",
            port=7441,
            freshness_seconds=30,
            streams=self.streams,
            now=max(path.stat().st_mtime for path in self.streams.values()) + 5,
        )
        self.assertEqual(status.state, "healthy")

    @patch("ops.fuzzballs_stream_monitor.protect_available", return_value=False)
    @patch("ops.fuzzballs_stream_monitor.service_active", return_value=True)
    def test_stale_playlists_report_upstream_outage_without_restart(
        self,
        _active,
        _protect,
    ):
        status = collect_status(
            host="protect",
            port=7441,
            freshness_seconds=30,
            streams=self.streams,
            now=max(path.stat().st_mtime for path in self.streams.values()) + 120,
        )
        self.assertEqual(status.state, "upstream_unavailable")

    @patch("ops.fuzzballs_stream_monitor.protect_available", return_value=True)
    @patch("ops.fuzzballs_stream_monitor.service_active", return_value=True)
    def test_stale_playlists_with_protect_available_report_recovering(
        self,
        _active,
        _protect,
    ):
        status = collect_status(
            host="protect",
            port=7441,
            freshness_seconds=30,
            streams=self.streams,
            now=max(path.stat().st_mtime for path in self.streams.values()) + 120,
        )
        self.assertEqual(status.state, "recovering")

    @patch("ops.fuzzballs_stream_monitor.protect_available", return_value=True)
    @patch("ops.fuzzballs_stream_monitor.service_active", return_value=False)
    def test_inactive_service_reports_local_failure(self, _active, _protect):
        status = collect_status(
            host="protect",
            port=7441,
            freshness_seconds=30,
            streams=self.streams,
        )
        self.assertEqual(status.state, "local_service_unavailable")

    @patch("ops.fuzzballs_stream_monitor.protect_available", return_value=True)
    @patch("ops.fuzzballs_stream_monitor.service_active", return_value=True)
    def test_state_is_emitted_only_on_transition(self, _active, _protect):
        status = collect_status(
            host="protect",
            port=7441,
            freshness_seconds=30,
            streams=self.streams,
        )
        state_file = Path(self.temp_dir.name) / "state"
        self.assertTrue(emit_transition(status, state_file))
        self.assertFalse(emit_transition(status, state_file))


if __name__ == "__main__":
    unittest.main()
