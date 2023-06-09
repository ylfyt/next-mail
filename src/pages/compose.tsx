import { IonPage, IonBackButton, IonButtons, IonButton, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonItem, IonTextarea, IonIcon, IonLabel, isPlatform } from "@ionic/react";
import { useHistory } from "react-router";
import { sendSharp, documentAttachSharp, documentTextSharp } from 'ionicons/icons';
import "./compose.css";
import { useRootContext } from "../contexts/root";
import { useState } from "react";
import LoadingButton from "../components/loading-button";
import { sendMail } from "../utils/send-mail";
import { useHelperContext } from "../contexts/helper";
import InputTextWithFile from "../components/input-text-with-file";
import { generatePrivateKey } from "../algorithms/privateKeyGenerator"
import { generatePublicKey } from "../algorithms/ecdsa";
import { encodePrivateKey, encodePublicKey } from "../algorithms/encoderDecoder";
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'

const Compose: React.FC = () => {
    const history = useHistory()
    const { user } = useRootContext();
    const { showToast } = useHelperContext(); 

    const [loading, setLoading] = useState(false) 
    const [receiver, setReceiver] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]);

    const [signatureKey, setSignatureKey] = useState('') // private key
    const [publicKey, setPublicKey] = useState('') // public key
    const [isGenerated, setIsGenerated] = useState(false)

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

    const handleGenerateKey = async () => {
      // generate keys
      const privateKeyBigInt : bigint = generatePrivateKey();
      const publicKeyBigInt : [bigint, bigint] = generatePublicKey(privateKeyBigInt);
      
      // encode keys
      const privateKeyEncoded : string = encodePrivateKey(privateKeyBigInt);
      const publicKeyEncoded : string = encodePublicKey(publicKeyBigInt);

      // set
      setSignatureKey(privateKeyEncoded);
      setPublicKey(publicKeyEncoded);
      setIsGenerated(true)
    }

    const handleDownloadKeyButtonClick = async () => {      
      const privateKey = signatureKey;
      // public key already define on useState
      
      if (isPlatform('android')) {
        Filesystem.writeFile({
          path: 'private-key.txt',
          data: privateKey,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        }).then(res => {
          showToast(`File downloaded to Documents/private-key.txt`)
        }).catch(err => {
          showToast(`Failed to save generated key: ${err.message}`)
        })

        Filesystem.writeFile({
          path: 'public-key.txt',
          data: publicKey,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        }).then(res => {
          showToast(`File saved to Documents/public-key.txt`)
        }).catch(err => {
          showToast(`Failed to save generated key: ${err.message}`)
        })
        return
      }
      
      // Download Private Key
      const privateKeyElement = document.createElement("a");
      const privateKeyFile = new Blob([privateKey], {type: 'text/plain'});
      privateKeyElement.href = URL.createObjectURL(privateKeyFile);
      
      privateKeyElement.download = "private-key.txt";
      document.body.appendChild(privateKeyElement);
      privateKeyElement.click();

      // Download Private Key
      const publicKeyElement = document.createElement("a");
      const publicKeyFile = new Blob([publicKey], {type: 'text/plain'});
      publicKeyElement.href = URL.createObjectURL(publicKeyFile);
      publicKeyElement.download = "public-key.txt";
      document.body.appendChild(publicKeyElement);
      publicKeyElement.click();
    }

    const disableSend = !message || !receiver || !subject || (sign && !signatureKey) || (encrypt && encryptionKey.length !== 16)

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/inbox"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Compose</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
              <div className="md:w-1/2 md:mx-auto pt-4 pb-10">
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
                        sign && (
                          <div className="mb-2">
                            <InputTextWithFile placeholder="Private Key" className="w-full md:w-3/4 mb-1" value={signatureKey} setValue={setSignatureKey} />
                            <div className="text-sm">
                              <button className="bg-blue-500 text-white px-2 py-1 rounded shadow-sm mr-4" onClick={ handleGenerateKey }>Generate Key</button>
                              { 
                              signatureKey && isGenerated && (
                              <button className="bg-green-500 text-white px-2 py-1 rounded shadow-sm" onClick={ handleDownloadKeyButtonClick }>Download Keys</button>
                              )}
                            </div>
                          </div>
                      )}
                      {
                        encrypt && <InputTextWithFile placeholder="16 Digit Encryption Key" className="w-full md:w-3/4" value={encryptionKey} charLimit={16} setValue={setEncryptionKey} />
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