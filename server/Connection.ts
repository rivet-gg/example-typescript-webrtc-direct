import { Server } from "./Server";
import { Socket } from "socket.io";
import { PeerConnection, DataChannel, initLogger } from 'node-datachannel';

initLogger("Debug");

// TODO: Restrict available ports

export class Connection {
	private name: string;
	private peer: PeerConnection;
	private dc: DataChannel;

	public constructor(private _server: Server, private _socket: Socket) {
		this.name = `peer-${Math.floor(Math.random() * 100000)}`;

		// Create peer
		this.peer = new PeerConnection(this.name, {
			iceServers: ["stun:stun.l.google.com:19302"],
		});
		this.peer.onLocalDescription((sdp, type) => {
			console.log("Sending onLocalDescription", sdp, type);
			this._socket.send("onLocalDescription", sdp, type);
		});
		this.peer.onLocalCandidate((candidate, mid) => {
			console.log("Sending onLocalCandidate", candidate, mid);
			this._socket.send("onLocalCandidate", candidate, mid);
		});

		// Create data channel
		this.dc = this.peer.createDataChannel("test");
		this.dc.onOpen(() => {
			this.dc.sendMessage("Hello from server");
		});
		this.dc.onMessage((msg) => {
			console.log('Received message:', msg);
		});
	}

	private async _onInit(cb: () => void) {
		console.log("Player connecting");

		this._socket.on("disconnect", this._onDisconnect.bind(this));
		this._socket.on("onLocalDescription", this._onLocalDescription.bind(this));
		this._socket.on("onLocalCandidate", this._onLocalCandidate.bind(this));

		cb();
	}

	private _onDisconnect() {
		console.log("disconnected");
	}

	private _onLocalDescription(sdp: any, type: any) {
		console.log("Received onLocalDescription", sdp, type);
		this.peer.setRemoteDescription(sdp, type);
	}

	private _onLocalCandidate(candidate: any, mid: any) {
		console.log("Received onLocalCandidate", candidate, mid);
		this.peer.addRemoteCandidate(candidate, mid);
	}
}

