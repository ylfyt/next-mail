import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import RootProvider from './contexts/root';
import './main.css';
import CryptoWorkerProvider from './contexts/crypto-worker';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
	<React.StrictMode>
		<RootProvider>
			<CryptoWorkerProvider>
				<App />
			</CryptoWorkerProvider>
		</RootProvider>
	</React.StrictMode>
);
