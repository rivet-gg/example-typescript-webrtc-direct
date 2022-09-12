import { Server as SocketServer, Socket } from "socket.io";
import { Connection } from "./Connection";

export class Server {
	public static shared: Server;

	public constructor(public socketServer: SocketServer) {
		this.socketServer.on("connection", this._onConnection.bind(this));
	}

	private async _onConnection(socket: Socket) {
		new Connection(this, socket);
	}
}

