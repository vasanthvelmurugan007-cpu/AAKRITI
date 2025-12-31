#!/usr/bin/env bash
set -euo pipefail
PY_VER=$(python -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")')
if [ "$PY_VER" != "3.11" ]; then
  echo "Error: Python 3.11 is required. Found $PY_VER"
  exit 1
fi
pip install -r requirements.txt
