# TypeScript WebRTC Direct Example

Demonstrates low latency UDP workload using a direct `RTCDataChannel` between the client and the server.

Leverages the [`wrtc`](https://www.npmjs.com/package/wrtc) NodeJS library to run WebRTC on the server.

## Running

```
$ docker run -it -p 3478:3478 -p 3478:3478/udp -p 5349:5349 -p 5349:5349/udp -p 49152:49152/udp coturn/coturn --min-port 49152 --max-port 49152 --user=user:pass
$ npm install -g node-pre-gyp
$ npm install
$ npm start
```

## README: CURRENT STATUS OF THIS BRANCH

This runs locally with `coturn`, but does not work in production because of Game Guard.

## The issue with TURN behind Game Guard

Coturn does not know the host nor port that the client will connect with, so it can't be configured appropriately.

The `min-port` and` `max-port` will be different within the container than on Game Guard.

`listen-port` can be configured correctly.

Unsure if `relay-ip` needs to be configured to work behind Game Guard.

## Future options to investigate

- Figure out how to manually produce offers for WebRTC that run through Game Guard
- Look at alternative TURN servers
- Write our own TURN server that handles different public ports from the internal ports
- Find a way to manually generate ICE offers
- Run a Rivet-managed coturn server
    - This would need to limit the destination IP to Rivet containers

## Simliar material

- https://www.doxsey.net/blog/rtctunnel--building-a-webrtc-proxy-with-go/
- https://groups.google.com/g/discuss-webrtc/c/id1Ng-s1jZY

