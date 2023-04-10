import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import RootProvider from './contexts/root';
import './main.css'

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
	<React.StrictMode>
		<RootProvider>
			<App />
		</RootProvider>
	</React.StrictMode>
);
