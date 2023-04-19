import { IonPage, IonBackButton, IonButtons, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonItem, IonTextarea, IonIcon, IonLabel } from "@ionic/react";
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
    const [sign, setSign] = useState(false)
    const [encrypt, setEncrypt] = useState(false)

    const openFileDialog = () => {
        (document as any).getElementById("file-upload").click();
    };

    const addFile = (_event: any) => {
        const FILE_SIZE_LIMIT = 5.2 // MB
        let file:File = _event.target.files![0];
        _event.target.value = ''
        if (file.size > FILE_SIZE_LIMIT * 1024 * 1024) {
          showToast(`File size should be less than ${FILE_SIZE_LIMIT}MB`)
          return
        }

        if (files.find(f => f.name === file.name)) {
          showToast('File already added')
          return
        }

        setFiles([...files, file])
    }

    const send = async () => {
      setLoading(true)
      const res = await sendMail(user!, receiver, {
        files, 
        subject, 
        body: message,
        encryptionKey:!encrypt ? "" : encryptionKey,
        signatureKey:!sign ? "" : signatureKey
      })
      setLoading(false)

      if (typeof res === 'string') {
        showToast(res)
        return
      }
      
      showToast('Success')
      history.goBack()
    }

    const disableSend = !message || !receiver || !subject || (sign && !signatureKey) || (encrypt && encryptionKey.length !== 16)

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Compose</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="md:w-1/2 md:mx-auto pt-4">
                <IonItem>
                    <IonInput aria-label="from"  label="From" value={user?.email} labelPlacement="fixed" readonly={true}></IonInput>
                    <LoadingButton onClick={send} loading={loading} disabled={disableSend} className="text-2xl align-middle disabled:text-gray-400">
                      <IonIcon icon={sendSharp}/>
                  </LoadingButton>
                </IonItem>
                <IonItem>
                    <IonInput aria-label="to" type="email" label="To" labelPlacement="fixed" placeholder="Receiver" onInput={(e: any) => { setReceiver(e.target.value) }}></IonInput>
                </IonItem>
                <IonItem>
                    <IonInput aria-label="subject" placeholder="Subject" onInput={(e: any) => { setSubject(e.target.value) }}></IonInput>
                    <div className="">
                        <input type="file" id="file-upload" style={{ display: "none" }} onChange={addFile} />
                        <button title="Attachment" className="text-2xl" onClick={openFileDialog}>
                            <IonIcon className="text-gray-600" icon={documentAttachSharp} />
                        </button>
                    </div>
                </IonItem>
                <IonItem>
                    <IonTextarea aria-label="body" placeholder="Compose email" autoGrow={true} onInput={(e: any) => { setMessage(e.target.value) }}></IonTextarea>
                </IonItem>
                {files.map((file, idx) => {
                    return (
                        <IonItem key={idx} lines="full">
                            <IonIcon icon={documentTextSharp} slot="start"></IonIcon>
                            <IonLabel>{file.name}</IonLabel>
                            <button onClick={() => {
                              setFiles(files.filter((_, i) => idx !== i))
                            }}>&#10005;</button>
                        </IonItem>
                    )
                })}

                <IonItem>
                  <div className="flex flex-col w-full mt-6 gap-2 mb-2">
                    <div className="flex">
                      <div className="flex items-center mr-6">
                        <input className="mr-1" checked={sign} onChange={(e) => {
                          setSign(e.target.checked)
                        }} type="checkbox" />
                        <label>Sign</label>
                      </div>
                      <div className="flex items-center">
                        <input className="mr-1" checked={encrypt} onChange={(e) => {
                          setEncrypt(e.target.checked)
                        }} type="checkbox" />
                        <label>Encrypt</label>
                      </div>
                    </div>
                    <div className="mt-2 flex px-1 flex-col gap-2">
                      {
                        sign && <InputTextWithFile placeholder="Signature Key" className="w-full md:w-3/4 mb-1" value={signatureKey} setValue={setSignatureKey} />
                      }
                      {
                        encrypt && <InputTextWithFile placeholder="16 Digit Encryption Key" className="w-full md:w-3/4" value={encryptionKey} setValue={setEncryptionKey} />
                      }
                    </div>
                  </div>
                </IonItem>
              </div>
            </IonContent>
        </IonPage>
    );
}

export default Compose;