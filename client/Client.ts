import { io, Socket } from "socket.io-client";

export class Client {
	public socket: Socket;

	public isDisconnected = false;
	public isConnected = false;

	private name: string;
	private peer: RTCPeerConnection;
	private dc: RTCDataChannel;

	public constructor(public host: string) {
		this.name = `peer-${Math.floor(Math.random() * 100000)}`;

		this.socket = io(host);
		this.socket.on("connect", this._onConnect.bind(this));
		this.socket.on("disconnect", this._onDisconnect.bind(this));
		this.socket.on("new-ice-candidate", this._onNewIceCandidate.bind(this));
		this.socket.on("offer", this._onOffer.bind(this));

		// Create peer
		this.peer = new RTCPeerConnection({
			'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]
		});
		this.peer.addEventListener('icecandidate', async ev => {
			if (ev.candidate) {
				console.log('New ICE candidate', ev.candidate);
				this.socket.emit('new-ice-candidate', ev.candidate);
			}
		});
		this.peer.addEventListener('connectionstatechange', ev => {
			console.log('New connection state', this.peer.connectionState);
			if (this.peer.connectionState === 'connected') {
				console.log("WebRTC connected");
			}
		});

		// Listen for data channel
		this.peer.addEventListener('datachannel', ev => {
			console.log('Received data channel');

			this.dc = ev.channel;
		});
	}

	private _onConnect() {
		this.isDisconnected = false;
		this.isConnected = true;

		console.log("WebSocket connected");
	}

	private _onDisconnect() {
		this.isDisconnected = true;
		this.isConnected = false;

		console.log("WebSocket disconnected");
	}

	private _onNewIceCandidate(candidate: any) {
		console.log("Received candidate", candidate);
		this.peer.addIceCandidate(candidate);
	}

	private async _onOffer(offer: any) {
		console.log("Received offer", offer);

		this.peer.setRemoteDescription(new RTCSessionDescription(offer));

		let answer = await this.peer.createAnswer();
		console.log("Created answer", answer);
		this.socket.emit('answer', answer);
		await this.peer.setLocalDescription(answer);
	}
}

