import { Client } from "./Client";
import * as mm from "@rivet-gg/matchmaker";

window.addEventListener("load", async () => {
	let mmApi = new mm.MatchmakerService({
		endpoint: process.env.RIVET_MATCHMAKER_API_URL,
		token:
			typeof process !== "undefined"
				? process.env.RIVET_CLIENT_TOKEN
				: null,
	});

	let res = await mmApi.findLobby({
		gameModes: ["default"],
	});
	let signalingPort = res.lobby.ports["signaling"];

	new Client(signalingPort.host, res.lobby.player.token);
});
