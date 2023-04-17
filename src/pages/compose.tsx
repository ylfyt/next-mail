import { IonPage, IonBackButton, IonButtons, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonItem, IonTextarea, IonIcon, IonButton, IonLabel } from "@ionic/react";
import { useHistory } from "react-router";
import { sendSharp, documentAttachSharp, documentTextSharp } from 'ionicons/icons';
import "./compose.css";
import { useRootContext } from "../contexts/root";
import { useState } from "react";
import LoadingButton from "../components/loading-button";
import { sendMail } from "../utils/send-mail";
import { useHelperContext } from "../contexts/helper";

const Compose: React.FC = () => {
    const history = useHistory()
    const { user } = useRootContext();
    const { showToast } = useHelperContext(); 

    const [loading, setLoading] = useState(false) 
    const [receiver, setReceiver] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);

    const openFileDialog = () => {
        (document as any).getElementById("file-upload").click();
    };

    const addFile = (_event: any) => {
        let newFile = _event.target.files![0];
        setFiles([...files, newFile])
    }

    const send = async () => {
      setLoading(true)
      const res = await sendMail(user!, receiver, files, subject, message)
      setLoading(false)

      if (typeof res === 'string') {
        showToast(res)
        return
      }
      
      showToast('Success')
      history.replace('/')
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"></IonBackButton>
                    </IonButtons>
                    <IonButtons slot="primary">
                        <input type="file" id="file-upload" style={{ display: "none" }} onChange={addFile} />
                        <IonButton onClick={openFileDialog}>
                            <IonIcon icon={documentAttachSharp} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Compose</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput aria-label="from"  label="From" value={user?.email} labelPlacement="fixed" readonly={true}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput aria-label="to" type="email" label="To" labelPlacement="fixed" placeholder="Receiver" onIonChange={(e: any) => { setReceiver(e.target.value) }}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput aria-label="subject" placeholder="Subject" onIonChange={(e: any) => { setSubject(e.target.value) }}></IonInput>
                </IonItem>
                <IonItem>
                    <IonTextarea aria-label="body" placeholder="Compose email" autoGrow={true} onIonChange={(e: any) => { setMessage(e.target.value) }}></IonTextarea>
                </IonItem>
                {files.map(file => {
                    return (
                        <IonItem key={file.name} lines="full">
                            <IonIcon icon={documentTextSharp} slot="start"></IonIcon>
                            <IonLabel>{file.name}</IonLabel>
                        </IonItem>
                    )
                })}

                <div className="flex justify-end mt-10 mr-6">
                  <LoadingButton onClick={send} loading={loading} disabled={!message || !receiver || !subject} className="text-2xl align-middle">
                      <IonIcon className="" icon={sendSharp}/>
                  </LoadingButton>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Compose;