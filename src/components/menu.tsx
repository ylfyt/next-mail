import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonMenuButton, IonIcon, IonSegmentButton, IonLabel, IonSegment, IonList, IonItem, IonMenuToggle } from "@ionic/react";
import { mail, sendSharp } from "ionicons/icons";


const Spinner: React.FC = () => {
	return (
		<>
            <IonMenu contentId="home">
				<IonHeader>
					<IonToolbar color="tertiary">
						<IonTitle>Menu Content</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className="ion-padding">
                    <IonList lines="none">
                        <br/>
                        <IonItem button href="/">
                            <IonIcon icon={mail} slot="start"/>
                            <IonLabel slot="start">Inbox</IonLabel>
                        </IonItem>
                        <br/>
                        <IonItem button href="/">
                            <IonIcon icon={sendSharp} slot="start"/>
                            <IonLabel slot="start">Sent</IonLabel>
                        </IonItem>
                    </IonList>
                </IonContent>
			</IonMenu>
        </>
	);
};

export default Spinner;
