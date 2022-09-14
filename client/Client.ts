import { io, Socket } from "socket.io-client";
import * as sdpTransform from "sdp-transform";

export class Client {
	public socket: Socket;

	public isDisconnected = false;
	public isConnected = false;

	private name: string;
	private peer: RTCPeerConnection;
	private dc: RTCDataChannel;

	private connState: HTMLElement;
	private iceState: HTMLElement;
	private cursorEl: HTMLDivElement;

	public constructor(public host: string, private playerToken: string) {
		console.log("Connecting", host, playerToken);

		this.name = `peer-${Math.floor(Math.random() * 100000)}`;

		this.socket = io(host);
		this.socket.on("connect", this._onConnect.bind(this));
		this.socket.on("disconnect", this._onDisconnect.bind(this));
		this.socket.on("new-ice-candidate", this._onNewIceCandidate.bind(this));
		this.socket.on("offer", this._onOffer.bind(this));

		this.socket.emit("init", playerToken, this._onInit.bind(this));
	}

	async _onInit() {
		console.log("Initiated");

		// Create peer
		this.peer = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
		});
		this.peer.addEventListener("icecandidateerror", (ev) => {
			console.log("ICE error", ev);
		});
		this.peer.addEventListener("iceconnectionstatechange", (ev) => {
			console.log("ICE connection state", this.peer.iceConnectionState);
			document.getElementById("ice-connection-state").innerText =
				this.peer.iceConnectionState;
		});
		this.peer.addEventListener("icegatheringstatechange", (ev) => {
			console.log("ICE gathering state", this.peer.iceGatheringState);
			document.getElementById("ice-gathering-state").innerText =
				this.peer.iceGatheringState;
		});

		this.peer.addEventListener("icecandidate", async (ev) => {
			if (ev.candidate) {
				console.log("New ICE candidate", ev.candidate);
				this.socket.emit("new-ice-candidate", ev.candidate);
			} else {
				console.log("No available ICE candidates");
			}
		});
		this.peer.addEventListener("connectionstatechange", (ev) => {
			console.log("WebRTC connection state", this.peer.connectionState);
			document.getElementById("peer-connection-state").innerText =
				this.peer.connectionState;
			if (this.peer.connectionState === "connected") {
				console.log("WebRTC connected");
			}
		});

		// Listen for data channel
		this.peer.addEventListener("datachannel", (ev) => {
			console.log("Received data channel");

			this.dc = ev.channel;
			document.getElementById("dc-ready-state").innerText =
				this.dc.readyState;
			this.dc.addEventListener("open", (ev) => {
				console.log("DataChannel open");
				document.getElementById("dc-ready-state").innerText =
					this.dc.readyState;
			});
			this.dc.addEventListener("close", (ev) => {
				console.log("DataChannel close");
				document.getElementById("dc-ready-state").innerText =
					this.dc.readyState;
			});
			this.dc.addEventListener("message", (ev) => {
				console.log("Message", ev.data);

				const { x, y } = JSON.parse(ev.data);
				this.cursorEl.style.left = `${x}px`;
				this.cursorEl.style.top = `${y}px`;
			});
		});

		// Listen for mouse move events
		this.cursorEl = document.getElementById("cursor") as HTMLDivElement;
		document
			.getElementById("canvas")
			.addEventListener("mousemove", (ev) => {
				if (this.dc) {
					this.dc.send(
						JSON.stringify({ x: ev.clientX, y: ev.clientY })
					);
				}
			});
	}

	private _onConnect() {
		this.isDisconnected = false;
		this.isConnected = true;

		console.log("WebSocket connected");
		document.getElementById("ws-connected").innerText =
			this.socket.connected.toString();
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
		const offerSdp = sdpTransform.parse(offer.sdp);
		console.log("Received offer", offerSdp);
		document.getElementById("offer-sdp").innerText =
			JSON.stringify(offerSdp);

		await this.peer.setRemoteDescription(new RTCSessionDescription(offer));

		const answer = await this.peer.createAnswer();
		const answerSdp = sdpTransform.parse(answer.sdp);
		console.log("Created answer", answerSdp);
		document.getElementById("answer-sdp").innerText =
			JSON.stringify(answerSdp);
		await this.peer.setLocalDescription(answer);
		this.socket.emit("answer", answer);
	}
}
