import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonToast, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import Register from './pages/register';
import Login from './pages/login';
import Compose from './pages/compose';
import { useHelperContext } from './contexts/helper';
import Sent from './pages/sent';
import MailDetail from './pages/mail-detail';

setupIonicReact();

const App: React.FC = () => {
	const { isToastOpen, toastDuration, toastMessage, setIsToastOpen } = useHelperContext();

	return (
		<IonApp>
			<IonReactRouter basename={import.meta.env.BASE_URL}>
				<IonRouterOutlet>
					<Route exact path="/register" component={Register} />
					<Route exact path="/login" component={Login} />
					<Route exact path="/inbox" component={Home} />
					<Route exact path="/inbox/:id" component={MailDetail} />
					<Route exact path="/sent" component={Sent} />
					<Route exact path="/compose" component={Compose} />
					<Redirect exact from="/" to="/inbox" />
				</IonRouterOutlet>
			</IonReactRouter>
			<IonToast
				message={toastMessage}
				isOpen={isToastOpen}
				duration={toastDuration}
				onDidDismiss={() => {
					setIsToastOpen(false);
				}}
			/>
		</IonApp>
	);
};

export default App;
