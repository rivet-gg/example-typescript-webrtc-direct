import { Client } from "./Client";
import { RivetClient } from "@rivet-gg/api";

window.addEventListener("load", async () => {
  const RIVET = new RivetClient({
		token:
			typeof process !== "undefined"
				? process.env.RIVET_CLIENT_TOKEN
				: null,
  });

	const res = await RIVET.matchmaker.lobbies.find({
		gameModes: ["default"],
	});
	const signalingPort = res.lobby.ports["signaling"];

	new Client(signalingPort.host, res.lobby.player.token);
});
