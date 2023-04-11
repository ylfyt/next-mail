export interface ICryptoResponse {
	id: number;
	success: boolean;
	message: string;
	data?: Uint8Array;
}
