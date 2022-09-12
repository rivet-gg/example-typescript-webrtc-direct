import { Server } from "./Server";
import { Socket } from "socket.io";
import { RTCPeerConnection, RTCDataChannel, RTCSessionDescription } from 'wrtc';
import * as sdpTransform from 'sdp-transform';

const WEBRTC_PORT_MIN = parseInt(process.env.PORT_RANGE_MIN_webrtc) || 26000;
const WEBRTC_PORT_MAX = parseInt(process.env.PORT_RANGE_MAX_webrtc) || 27000;

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
			  portRange: {
				  min: WEBRTC_PORT_MIN,
				  max: WEBRTC_PORT_MAX,
			  }
		 });
		this.peer.addEventListener('icecandidate', ev => {
			if (ev.candidate) {
				console.log('New ICE candidate', ev.candidate);
				this._socket.emit('new-ice-candidate', ev.candidate);
			} else {
				console.log("No available ICE candidates");
			}
		});
		this.peer.addEventListener('connectionstatechange', ev => {
			console.log('New connection state', this.peer.connectionState);
			if (this.peer.connectionState === 'connected') {
				console.log("WebRTC connected");
			}
		});

		// Create data channel
		this.dc = this.peer.createDataChannel('echo');
		this.dc.addEventListener('open', ev => {
			console.log('DataChannel open');
		});
		this.dc.addEventListener('close', ev => {
			console.log('DataChannel close');
		});
		this.dc.addEventListener('message', ev => {
			console.log('Message', ev.data);
		});

		// Send offer
		this.peer.createOffer()
			.then(async offer => {
				console.log("Created offer", sdpTransform.parse(offer.sdp));
				await this.peer.setLocalDescription(offer);
				this._socket.emit('offer', offer);
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
		console.log("Received answer", sdpTransform.parse(answer.sdp));

		await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
	}
}

