import React, { useState } from "react";
import { useHistory } from "react-router-dom";          // React-Router v5
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonContent,
  IonCardContent,
  IonCard,
  IonRouterLink,
  IonToast,
  IonLoading,
} from "@ionic/react";
import "./Login.css";
import {useAuth} from "../../Contexts/AuthContext";


const Login =( ) => {

const { handleLogin,email,password,setPassword,setEmail,showError,loading}=useAuth()
  return (
    <IonPage>
      <IonContent className="" fullscreen>
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardContent>
              <header className="font-bold text-[#007bff] text-center pb-2 text-2xl">Drivers' Login</header>

              <form onSubmit={handleLogin}>
                <IonItem>
                  <IonInput
                    placeholder="Enter your e-mail"
                    type="email"
                    inputmode="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value!)}
                  />
                </IonItem>

                <button  type="submit" className="rounded-none ion-button">
                  Login
                </button>
              </form>

              <p className="text-center">
                Don’t have an account?{" "}
                <IonRouterLink className="mt-10" routerLink="/register">Sign up!</IonRouterLink>
              </p>
            </IonCardContent>
          </IonCard>
        </div>

        {/* feedback helpers */}
        <IonLoading isOpen={loading} message="Checking credentials…" />
        <IonToast
          isOpen={!!showError}
          message={showError ?? ""}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
