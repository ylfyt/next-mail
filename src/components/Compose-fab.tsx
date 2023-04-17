import { IonIcon, IonFab, IonFabButton } from "@ionic/react";
import { pencilSharp } from "ionicons/icons";
import "./Compose-fab.css";
import { useHistory } from "react-router";

const ComposeFab: React.FC = () => {
    const history = useHistory();
    const compose = () => {
		history.push("/compose");
	};

	return (
		<>
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton onClick={compose}>
                    <IonIcon icon={pencilSharp}/>
                </IonFabButton>
			</IonFab>
        </>
	);
};

export default ComposeFab;