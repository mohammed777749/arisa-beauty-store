#!/bin/bash
# Detached dev server launcher (double-fork daemon pattern)
cd /home/z/my-project
export PATH="/home/z/my-project/node_modules/.bin:$PATH"

# Double-fork to fully detach from the controlling terminal/process group
(
  (
    exec next dev -p 3000 > dev.log 2>&1
  ) &
) &

disown -a 2>/dev/null
exit 0
