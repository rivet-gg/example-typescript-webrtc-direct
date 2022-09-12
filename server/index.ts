import { Server } from "./Server";
import { Server as SocketServer } from "socket.io";

// TODO: Read port min & max
// TODO: Use wrtc to get server signaling information

const WEBRTC_PORT_MIN = parseInt(process.env.PORT_RANGE_MIN_webrtc) || 26000;
const WEBRTC_PORT_MAX = parseInt(process.env.PORT_RANGE_MAX_webrtc) || 27000;

const port = parseInt(process.env.PORT) || 5000;
const socketServer = new SocketServer(port, {
	cors: {
		origin: "*",
	},
});
Server.shared = new Server(socketServer);
console.log(`Listening on port ${port}`);



