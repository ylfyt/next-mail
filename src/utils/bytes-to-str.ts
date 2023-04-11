export const bytesToStr = (bytes: Uint8Array): string => {
	let str = '';
	for (let i = 0; i < bytes.length; i++) {
		str += String.fromCharCode(bytes[i]);
	}

	return str;
};
