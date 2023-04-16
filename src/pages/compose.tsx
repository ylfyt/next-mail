import { IonPage, IonBackButton, IonButtons, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonItem, IonTextarea, IonIcon, IonButton } from "@ionic/react";
import { useLocation } from "react-router";
import { sendSharp, linkSharp } from 'ionicons/icons';

const Compose: React.FC = () => {
    const { state } = useLocation();

    return ( 
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"></IonBackButton>
                    </IonButtons>
                    <IonButtons slot="primary">
                        <IonButton>
                            <IonIcon icon={linkSharp}/>
                        </IonButton>
                        <IonButton>
                            <IonIcon icon={sendSharp}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Compose</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput label="From" value="" labelPlacement="fixed" placeholder="Enter your email" readonly={true}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput label="To" labelPlacement="fixed"></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput placeholder="Subject"></IonInput>
                </IonItem>
                <IonItem>
                    <IonTextarea placeholder="Compose email" autoGrow={true}></IonTextarea>
                </IonItem>
            </IonContent>
        </IonPage>
     );
}
 
export default Compose;