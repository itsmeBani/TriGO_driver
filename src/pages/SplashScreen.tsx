import { IonContent, IonPage, IonIcon, IonText } from "@ionic/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./SplashScreen.css";
import  Logo from "../../public/TriGo.png"
import Index from "./Index";
const SplashScreen: React.FC = () => {
  const history = useHistory();

  // useEffect(() => {
  //   setTimeout(() => {
  //    return <Index/>
  //   }, 2000);
  // }, []);

  return (
    <IonPage>
      <IonContent className="splash-screen" fullscreen>
        <div className="icon-container">
          <img src={Logo} alt="Tricycle" className="splash-icon" />
          <IonText className="splash-title">TriGo Driver App</IonText>
        </div>

      </IonContent>
    </IonPage>


  );
};

export default SplashScreen;
