if (
	!process.env.PORT_signaling ||
	!process.env.PORT_RANGE_MIN_webrtc ||
	!process.env.PORT_RANGE_MAX_webrtc
)
	throw "Missing env var: PORT_signaling, PORT_RANGE_MIN_webrtc, PORT_RANGE_MAX_webrtc";

export const PORT_SIGNALING = parseInt(process.env.PORT_signaling);
export const PORT_WEBRTC_MIN = parseInt(process.env.PORT_RANGE_MIN_webrtc);
export const PORT_WEBRTC_MAX = parseInt(process.env.PORT_RANGE_MAX_webrtc);
console.table({ PORT_SIGNALING, PORT_WEBRTC_MIN, PORT_WEBRTC_MAX });
