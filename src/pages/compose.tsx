import { IonPage, IonBackButton, IonButtons, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonItem, IonTextarea, IonIcon, IonButton, IonLabel } from "@ionic/react";
import { useHistory } from "react-router";
import { sendSharp, documentAttachSharp, documentTextSharp } from 'ionicons/icons';
import "./compose.css";
import { useRootContext } from "../contexts/root";
import { useState } from "react";
import LoadingButton from "../components/loading-button";
import { sendMail } from "../utils/send-mail";
import { useHelperContext } from "../contexts/helper";
import InputTextWithFile from "../components/input-text-with-file";

const Compose: React.FC = () => {
    const history = useHistory()
    const { user } = useRootContext();
    const { showToast } = useHelperContext(); 

    const [loading, setLoading] = useState(false) 
    const [receiver, setReceiver] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);

    const [signatureKey, setSignatureKey] = useState('') 
    const [encryptionKey, setEncryptionKey] = useState('') 
    const [sign, setSign] = useState(true)
    const [encrypt, setEncrypt] = useState(true)

    const openFileDialog = () => {
        (document as any).getElementById("file-upload").click();
    };

    const addFile = (_event: any) => {
        let newFile = _event.target.files![0];
        setFiles([...files, newFile])
    }

    const send = async () => {
      setLoading(true)
      const res = await sendMail(user!, receiver, {
        files, 
        subject, 
        body: message,
        encryptionKey
      })
      setLoading(false)

      if (typeof res === 'string') {
        showToast(res)
        return
      }
      
      showToast('Success')
      history.replace('/')
    }

    const disableSend = !message || !receiver || !subject || (sign && !signatureKey) || (encrypt && !encryptionKey)

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
                    <LoadingButton onClick={send} loading={loading} disabled={disableSend} className="text-2xl align-middle disabled:text-gray-400">
                      <IonIcon icon={sendSharp}/>
                  </LoadingButton>
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

                <div className="flex flex-col mx-4 mt-6 gap-2">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <input checked={sign} onChange={(e) => {
                        setSign(e.target.checked)
                      }} type="checkbox" />
                      <label>Sign</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input checked={encrypt} onChange={(e) => {
                        setEncrypt(e.target.checked)
                      }} type="checkbox" />
                      <label>Encrypt</label>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    {
                      sign && <InputTextWithFile placeholder="Signature Key" value={signatureKey} setValue={setSignatureKey} />
                    }
                    {
                      encrypt && <InputTextWithFile placeholder="Encryption Key" value={encryptionKey} setValue={setEncryptionKey} />
                    }
                  </div>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Compose;