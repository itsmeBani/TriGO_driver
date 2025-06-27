import { IonContent, IonPage, IonButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Index.css';

const Index: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <section className="flex-col bg-[#007bff] h-full flex place-items-center justify-center " >
          {/* App Title */}
          <IonText className="title">TriGo Driver App</IonText>
          <div className="button-container w-full">
            <IonButton expand="full" className="get-started-btn" onClick={() => history.push('/login')}>
              Get Started
            </IonButton>
          </div>
      </section>
    </IonPage>
  );
};

export default Index;
