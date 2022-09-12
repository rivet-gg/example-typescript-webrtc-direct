import { io, Socket } from "socket.io-client";
import { Client } from "./Client";
import { GameState } from "../shared/Game";

export class Connection {
	public socket: Socket;

	public isDisconnected = false;
	public isConnected = false;

	private name: string;
	private peer: RTCPeerConnection;
	private dc: DataChannel;

	public constructor(private _client: Client, public host: string) {
		this.name = `peer-${Math.floor(Math.random() * 100000)}`;

		this.socket = io(host);
		this.socket.on("connect", this._onConnect.bind(this));
		this.socket.on("disconnect", this._onDisconnect.bind(this));
		this.socket.on("candidate", this._onCandidate.bind(this));
		this.socket.on("offer", this._onOffer.bind(this));

		// Create peer
		this.peer = new RTCPeerConnection();
		this.peer.addEventListener('icecandidate', async ev => {
			console.log('icecandidate: ', ev.candidate);
			this.socket.send('candidate', ev.candidate);
		});
	}

	private _onConnect() {
		this.isDisconnected = false;

		console.log("Initiating...");
		this.socket.emit("init", this._onInit.bind(this));
	}

	private _onInit() {
		console.log("Initiated.");
		this.isConnected = true;
	}

	private _onDisconnect() {
		this.isDisconnected = true;
		this.isConnected = false;
	}

	private _onCandidate(candidate: any) {
		console.log("Received candidate", candidate);
		this.peer.addIceCandidate(candidate);
	}

	private async _onOffer(offer: any) {
		console.log("Received offer", offer);

		this.peer.setRemoteDescription(offer);

		let answer = await this.peer.createAnswer();
		this.socket.send('answer', answer.sdp);
		await this.peer.setLocalDescription(answer);
	}
}

