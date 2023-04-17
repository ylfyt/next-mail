export const base64ToBuff = (base64: string): Uint8Array => {
	try {
		var binary_string = atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes;
	} catch (error) {
		console.log(error);
		return new Uint8Array();
	}
};
