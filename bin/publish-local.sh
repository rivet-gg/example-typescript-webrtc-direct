#!/bin/sh
set -euf

export RIVET_CLOUD_API_URL=https://cloud.api.rivet-gg.test/v1

docker build -t example-webrtc .
../cli/target/debug/rivet build push --tag example-webrtc --name "$(date +%s)"

npm run build:client
../cli/target/debug/rivet site push --path dist/ --name "$(date +%s)"

