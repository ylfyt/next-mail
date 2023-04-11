export const buffToBase64 = async (data: Uint8Array) => {
	// Use a FileReader to generate a base64 data URI
	const base64url = await new Promise<string>((r) => {
		const reader = new FileReader();
		reader.onload = () => r(reader.result as string);
		reader.readAsDataURL(new Blob([data]));
	});

	/*
  The result looks like 
  "data:application/octet-stream;base64,<your base64 data>", 
  so we split off the beginning:
  */
	return base64url.split(',', 2)[1];
};
