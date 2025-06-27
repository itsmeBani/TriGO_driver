import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { personCircle, time, home } from 'ionicons/icons';
import Home from './Home';
import Profiles from './Profiles';
import History from './History';

const Tabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/home" component={Home} exact />
      <Route path="/profile" component={Profiles} exact />
      <Route path="/history" component={History} exact />
      <Redirect exact from="/" to="/home" />
    </IonRouterOutlet>
    <IonTabBar slot="bottom">
      <IonTabButton tab="home" href="/home">
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      <IonTabButton tab="profile" href="/profile">
        <IonIcon icon={personCircle} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
      <IonTabButton tab="history" href="/history">
        <IonIcon icon={time} />
        <IonLabel>History</IonLabel>
      </IonTabButton>
      <IonTabButton tab="logout" href="/logout">
        <IonLabel>Logout</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tabs;
