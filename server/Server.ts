import { Server as SocketServer, Socket } from "socket.io";
import { Connection } from "./Connection";
import * as mm from "@rivet-gg/matchmaker";

export class Server {
	public static shared: Server;

	public mmApi: mm.MatchmakerService;

	public constructor(public socketServer: SocketServer) {
		this.socketServer.on("connection", this._onConnection.bind(this));

		this.mmApi = new mm.MatchmakerService({
			endpoint: process.env.RIVET_MATCHMAKER_API_URL,
		});
		this.mmApi.lobbyReady({});
	}

	private async _onConnection(socket: Socket) {
		new Connection(this, socket);
	}
}

