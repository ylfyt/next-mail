import { decrypt, encrypt } from '../algorithms/shuffle-aes';
import { ICryptoRequest } from '../interfaces/crypto-request';
import { ICryptoResponse } from '../interfaces/crypto-response';
import { strToBytes } from '../utils/str-to-bytes';

console.log('Crypto handler has started');

self.onmessage = async (e: MessageEvent<ICryptoRequest>) => {
	const req = e.data;
	console.log(`Get new Request ${req.id}:`, req);

	const result = await handler(req);

	if (!result.success) {
		self.postMessage(result);
		return;
	}

	const data = result.data;
	const response: ICryptoResponse = {
		id: result.id,
		message: result.message,
		success: result.success,
	};
	self.postMessage(response);
	self.postMessage(data, {
		transfer: [data!.buffer],
	});
};

const handler = async (req: ICryptoRequest): Promise<ICryptoResponse> => {
	const action = req.action;
	if (action !== 'encrypt' && action !== 'decrypt')
		return {
			id: req.id,
			success: false,
			message: 'Action should be encrypt or decrypt',
		};

	const key = req.key;
	if (!key || key.length === 0)
		return {
			id: req.id,
			success: false,
			message: 'Key is required',
		};

	if (!req.data)
		return {
			id: req.id,
			success: false,
			message: 'Data is required',
		};

	try {
		const data = new Uint8Array(strToBytes(req.data));

		const resolver = action === 'encrypt' ? encrypt : decrypt;
		const result = resolver(data, key);

		return {
			id: req.id,
			success: true,
			data: result,
			message: '',
		};
	} catch (error) {
		const err = error as Error;
		return {
			id: req.id,
			success: false,
			message: err.message,
		};
	}
};

export {};
