import { Client } from "./Client";
import * as mm from "@rivet-gg/matchmaker";

window.addEventListener("load", async () => {
	const mmApi = new mm.MatchmakerService({
		endpoint: process.env.RIVET_MATCHMAKER_API_URL,
		token:
			typeof process !== "undefined"
				? process.env.RIVET_CLIENT_TOKEN
				: null,
	});

	const res = await mmApi.findLobby({
		gameModes: ["default"],
	});
	const signalingPort = res.lobby.ports["signaling"];

	new Client(signalingPort.host, res.lobby.player.token);
});
