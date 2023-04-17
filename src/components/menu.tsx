import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonMenuButton, IonIcon, IonSegmentButton, IonLabel, IonSegment, IonList, IonItem, IonMenuToggle } from "@ionic/react";
import { mail, sendSharp } from "ionicons/icons";
import "./menu.css";
import { Link } from "react-router-dom";

const Menu: React.FC = () => {
	return (
		<>
            <IonMenu contentId="menu">
				<IonHeader>
					<IonToolbar color="tertiary">
						<IonTitle>Next Email</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className="ion-padding">
                    <IonList lines="none">
                        <br/>
                        <Link to="/">
                            <IonItem button>
                                <IonIcon icon={mail} slot="start"/>
                                <IonLabel slot="start">Inbox</IonLabel>
                            </IonItem>
                        </Link>
                        <br/>
                        <Link to="/sent">
                            <IonItem button>
                                <IonIcon icon={sendSharp} slot="start"/>
                                <IonLabel slot="start">Sent</IonLabel>
                            </IonItem>
                        </Link>
                    </IonList>
                </IonContent>
			</IonMenu>
        </>
	);
};

export default Menu;
