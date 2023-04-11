import { FC, ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ICryptoResponse } from '../interfaces/crypto-response';
import { ICryptoRequest } from '../interfaces/crypto-request';

interface IWebWorkerContext {
	runCrypto: (action: 'encrypt' | 'decrypt', data: string, key: string) => Promise<ICryptoResponse>;
}

const WebWorkerContext = createContext<IWebWorkerContext>({
	runCrypto: () => {
		throw new Error('Not implemented yet');
	},
});

export const useWebWorkerContext = () => {
	return useContext(WebWorkerContext);
};

interface CryptoWorkerProviderProps {
	children: ReactNode;
}

const CryptoWorkerProvider: FC<CryptoWorkerProviderProps> = ({ children }) => {
	const resolvers: Map<number, (res: ICryptoResponse) => void> = useMemo(() => new Map(), []);

	const worker: Worker = useMemo(() => new Worker(new URL('../workers/crypto.ts', import.meta.url), { type: 'module' }), []);

	useEffect(() => {
		worker.onmessage = (e: MessageEvent<ICryptoResponse>) => {
			const res = e.data;
			console.log(`Get response ${res.id}`);
			const resolve = resolvers.get(res.id)!;
			resolve(res);
			resolvers.delete(res.id);
		};
	}, []);

	const runCrypto = (action: 'encrypt' | 'decrypt', data: string, key: string): Promise<ICryptoResponse> => {
		return new Promise((resolve) => {
			const id = new Date().getTime();
			resolvers.set(id, resolve);

			// Send request information
			try {
				const req: ICryptoRequest = {
					action,
					key,
					id,
					data,
				};
				worker.postMessage(req);
			} catch (error) {
				const res: ICryptoResponse = {
					id,
					message: 'Failed to execute worker',
					success: false,
				};
				if (error instanceof Error) {
					res.message = error.message;
				}
				resolve(res);
				resolvers.delete(id);
			}
		});
	};

	return <WebWorkerContext.Provider value={{ runCrypto }}>{children}</WebWorkerContext.Provider>;
};

export default CryptoWorkerProvider;
