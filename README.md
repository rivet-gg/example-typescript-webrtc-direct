# TypeScript WebRTC Direct Example

Demonstrates low latency UDP workload using a direct `RTCDataChannel` between the client and the server.

Leverages the [`wrtc`](https://www.npmjs.com/package/wrtc) NodeJS library to run WebRTC on the server.

## Running

```
$ docker run  -it -p 3478:3478 -p 3478:3478/udp -p 5349:5349 -p 5349:5349/udp -p 49152:49152/udp coturn/coturn --min-port 49152 --max-port 49152 --user=user:pass
$ npm install -g node-pre-gyp
$ npm install
$ npm start
```

