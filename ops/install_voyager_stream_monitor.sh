#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this installer as root." >&2
  exit 1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
systemd_dir="${repo_root}/ops/systemd"
backup_dir="/var/backups/fuzzballs-legacy-recovery-$(date +%Y%m%d%H%M%S)"
legacy_dir="/home/deploy/Projects/scheduled_jobs"
legacy_detector="${legacy_dir}/fuzzballs_down_detector.py"
legacy_restart="${legacy_dir}/service_restart.sh"

install -D -m 0755 \
  "${repo_root}/ops/fuzzballs_stream_monitor.py" \
  /usr/local/libexec/fuzzballs-stream-monitor

for service in ffmpeg-run ffmpeg-roost; do
  install -D -m 0644 \
    "${systemd_dir}/ffmpeg-retry.conf" \
    "/etc/systemd/system/${service}.service.d/retry.conf"
done

install -m 0644 \
  "${systemd_dir}/fuzzballs-stream-monitor.service" \
  /etc/systemd/system/fuzzballs-stream-monitor.service
install -m 0644 \
  "${systemd_dir}/fuzzballs-stream-monitor.timer" \
  /etc/systemd/system/fuzzballs-stream-monitor.timer

cron_tmp="$(mktemp)"
trap 'rm -f "${cron_tmp}"' EXIT
if crontab -l >"${cron_tmp}" 2>/dev/null; then
  sed -i '\|/home/deploy/Projects/scheduled_jobs/fuzzballs_down_detector.py|d' "${cron_tmp}"
  crontab "${cron_tmp}"
fi

if [[ -e "${legacy_detector}" || -e "${legacy_restart}" ]]; then
  install -d -m 0700 "${backup_dir}"
  for legacy_file in "${legacy_detector}" "${legacy_restart}"; do
    if [[ -e "${legacy_file}" ]]; then
      mv "${legacy_file}" "${backup_dir}/"
    fi
  done
  echo "Legacy recovery files moved to ${backup_dir}"
fi

systemctl daemon-reload
systemctl enable --now fuzzballs-stream-monitor.timer
systemctl start fuzzballs-stream-monitor.service

echo "Installed transition-only stream monitoring and FFmpeg restart backoff."
