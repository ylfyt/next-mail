import { IonPage, IonBackButton, IonButtons, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonItem, IonTextarea, IonIcon, IonButton, IonLabel } from "@ionic/react";
import { useHistory } from "react-router";
import { sendSharp, documentAttachSharp, documentTextSharp } from 'ionicons/icons';
import "./compose.css";
import { useRootContext } from "../contexts/root";
import { useEffect, useState } from "react";

const Compose: React.FC = () => {
    const history = useHistory();
    const { user, loadingUser } = useRootContext();
    
    const [sender, setSender] = useState<String>();
    const [receiver, setReceiver] = useState();
    const [subject, setSubject] = useState();
    const [message, setMessage] = useState<String>();
    const [files, setFiles] = useState<File[]>([]);


    useEffect(() => {
		if (loadingUser || user) {
            if (user?.email) {
                setSender(user?.email);
            }
            return;
        }

		history.replace('login');
	}, [user, loadingUser])
    
    const openFileDialog = () => {
        (document as any).getElementById("file-upload").click();
    };
        
    const addFile = (_event: any) => {
        let newFile = _event.target.files![0];
        setFiles([...files,newFile])
    }

    return ( 
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"></IonBackButton>
                    </IonButtons>
                    <IonButtons slot="primary">
                        <input type="file" id="file-upload" style={{ display: "none" }} onChange={addFile}/>
                        <IonButton onClick={openFileDialog}>
                            <IonIcon icon={documentAttachSharp}/>
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
                    <IonInput label="From" value={user?.email} labelPlacement="fixed" readonly={true}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput label="To" labelPlacement="fixed" onIonChange={(e: any) => {setReceiver(e.target.value)}}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput placeholder="Subject" onIonChange={(e: any) => {setSubject(e.target.value)}}></IonInput>
                </IonItem>
                <IonItem>
                    <IonTextarea placeholder="Compose email" autoGrow={true} onIonChange={(e: any) => {setMessage(e.target.value)}}></IonTextarea>
                </IonItem>
                {files.map( file => {
                    return (
                        <IonItem key={file.name} lines="full">
                            <IonIcon icon={documentTextSharp} slot="start"></IonIcon>
                            <IonLabel>{file.name}</IonLabel>
                        </IonItem>
                    )
                })}
            </IonContent>
        </IonPage>
     );
}
 
export default Compose;