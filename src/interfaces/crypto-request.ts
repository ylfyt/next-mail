export interface ICryptoRequest {
	id: number;
	key: string;
	action: 'encrypt' | 'decrypt';
	data: string;
}
