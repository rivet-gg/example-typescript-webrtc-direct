import { Server } from "./Server";
import { Socket } from "socket.io";
import { RTCPeerConnection, RTCDataChannel, RTCSessionDescription } from 'wrtc';

// TODO: Restrict available ports

export class Connection {
	private name: string;
	private peer: RTCPeerConnection;
	private dc: RTCDataChannel;

	public constructor(private _server: Server, private _socket: Socket) {
		this.name = `peer-${Math.floor(Math.random() * 1000000)}`;
		console.log("Connection", this.name);

		this._socket.on("new-ice-candidate", this._onNewIceCandidate.bind(this));
		this._socket.on("answer", this._onAnswer.bind(this));

		// Create peer
		this.peer = new RTCPeerConnection({
			'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]
		}) as RTCPeerConnection;
		this.peer.addEventListener('icecandidate', async ev => {
			if (ev.candidate) {
				console.log('New ICE candidate', ev.candidate);
				this._socket.emit('new-ice-candidate', ev.candidate);
			}
		});
		this.peer.addEventListener('connectionstatechange', ev => {
			console.log('New connection state', this.peer.connectionState);
			if (this.peer.connectionState === 'connected') {
				console.log("WebRTC connected");
			}
		});

		// Send offer
		this.peer.createOffer()
			.then(offer => {
				console.log("Created offer", offer);
				this.peer.setLocalDescription(offer);
				this._socket.emit('offer', offer);
			});

		// Create data channel
		this.dc = this.peer.createDataChannel();
		this.dc.addEventListener('open', ev => {
			console.log('DataChannel open');
		});
		this.dc.addEventListener('close', ev => {
			console.log('DataChannel close');
		});
		this.dc.addEventListener('message', ev => {
			console.log('Message', ev.data);
		});
	}

	private _onDisconnect() {
		console.log("WebSocket disconnected");
	}

	private _onNewIceCandidate(candidate: any) {
		console.log("Received candidate", candidate);
		this.peer.addIceCandidate(candidate);
	}

	private async _onAnswer(answer: any) {
		console.log("Received answer", answer);

		this.peer.setRemoteDescription(new RTCSessionDescription(answer));
	}
}

