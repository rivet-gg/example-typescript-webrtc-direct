import { Client } from "./Client";
import * as mm from "@rivet-gg/matchmaker";

window.addEventListener("load", async () => {
	let mmApi = new mm.MatchmakerService({
		endpoint: "https://matchmaker.api.rivet-gg.test/v1",
		token: process.env.RIVET_CLIENT_TOKEN,
	});

	let res = await mmApi.findLobby({
		gameModes: ["default"],
	});
	let signalingPort = res.lobby.ports["signaling"];

	new Client(signalingPort.host, res.lobby.player.token);
});

