export function strToBytes(str: string) {
	const bytes: number[] = [];
	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i); // x00-xFFFF
		bytes.push(code & 255); // low, high
	}
	return bytes;
}
