import { decrypt, encrypt } from '../algorithms/shuffle-aes';
import { ICryptoRequest } from '../interfaces/crypto-request';
import { ICryptoResponse } from '../interfaces/crypto-response';
import { base64ToBuff } from '../utils/base64-to-buff';
import { buffToBase64 } from '../utils/buff-to-base64';
import { bytesToStr } from '../utils/bytes-to-str';
import { strToBytes } from '../utils/str-to-bytes';

console.log('Crypto handler has started');

self.onmessage = async (e: MessageEvent<ICryptoRequest>) => {
	const req = e.data;
	console.log(`Get new Request ${req.id}:`, req);

	const result = await handler(req);

	self.postMessage(result);
};

const handler = async (req: ICryptoRequest): Promise<ICryptoResponse> => {
	const action = req.action;
	if (action !== 'encrypt' && action !== 'decrypt')
		return {
			id: req.id,
			success: false,
			message: 'Action should be encrypt or decrypt',
			data: '',
		};

	const key = req.key;
	if (!key || key.length !== 16)
		return {
			id: req.id,
			success: false,
			message: 'Key length should be 16 chars',
			data: '',
		};

	if (!req.data)
		return {
			id: req.id,
			success: false,
			message: 'Data is required',
			data: '',
		};

	try {
		const data = action === 'encrypt' ? new Uint8Array(strToBytes(req.data)) : base64ToBuff(req.data);

		const resolver = action === 'encrypt' ? encrypt : decrypt;
		const result = resolver(data, key);

		return {
			id: req.id,
			success: true,
			data: action === 'encrypt' ? await buffToBase64(result) : bytesToStr(result),
			message: '',
		};
	} catch (error) {
		const err = error as Error;
		return {
			id: req.id,
			success: false,
			message: err.message,
			data: '',
		};
	}
};

export {};
