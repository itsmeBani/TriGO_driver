import {Redirect, Route} from 'react-router-dom';
import {
    IonApp, IonHeader,
    IonIcon,
    IonLabel, IonPage,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs, IonTitle, IonToolbar,
    setupIonicReact
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {useEffect, useState} from 'react';
import {useHistory} from 'react-router';

import Home from './pages/Home';
import SplashScreen from "./pages/SplashScreen";
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Tabs from './pages/Tabs';
import Profiles from './pages/Profiles';
import History from './pages/History';
import {LogOut} from "lucide-react"
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import '../src/pages/Index.css'
import {home, logOutOutline, personCircle, time,logOut} from "ionicons/icons";
import RenderMap from './components/Map';
import {useAuth} from "../Contexts/AuthContext";

setupIonicReact();

const App= () => {
    const {handleLogOut, currentUser} = useAuth()
 if (currentUser===undefined){
     return  <SplashScreen/>
 }
   return (
        <IonApp>
            {currentUser ?
            <IonReactRouter>
                <IonTabs>

                    <IonRouterOutlet>




                                <Route exact path="/" component={RenderMap}/>
                                <Route exact path="/profile" component={Profiles}/>
                                <Route exact path="/history" component={History}/>



 <Redirect to={"/"}/>

                    </IonRouterOutlet>


                  {currentUser &&
                      <IonTabBar slot="bottom">
                        <IonTabButton tab="home" href="/">
                          <IonIcon icon={home}/>
                          <IonLabel>Home</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="profile" href="/profile">
                          <IonIcon icon={personCircle}/>
                          <IonLabel>Profile</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="history" href="/history">
                          <IonIcon icon={time}/>
                          <IonLabel>History</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab="Logout " onClick={handleLogOut} href={"/login"}>
                          <IonIcon icon={logOut}/>
                          <IonLabel>Logout</IonLabel>
                        </IonTabButton>
                      </IonTabBar>
                  }

                </IonTabs>
            </IonReactRouter> :
           <IonReactRouter>

               <IonRouterOutlet>
                                <Route exact path="/" component={Index}/>
                                 <Route exact path="/login" render={() => <Login/>}/>
                              <Route exact path="/register" render={() => <Register/>}/>
                   <Redirect to={"/"}/>
               </IonRouterOutlet>
           </IonReactRouter> }
        </IonApp>
    );
};

export default App;
