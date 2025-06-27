import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonRouterLink,
} from "@ionic/react";
import { setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebaseConfig";
import "./Register.css";
import supabase from "../../services/supabase";


const Register=() => {
  const history = useHistory();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [license, setLicense] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setAddress("");
    setLicense(null);
    setError("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload PNG, JPG, JPEG, or PDF.");
        setLicense(null);
        return;
      }
      setLicense(file);
      setError("");
    }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword || !address || !license) {
      setError("All fields including driver's license must be filled.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;


      const {data, error} = await supabase
          .storage
          .from('poducwest')
          .upload(license.name, license, {
            cacheControl: '3600',
            upsert: true
          })

      if (!data?.path){
        return setError("Something Went Wrong Try Again")
      }
      const {data: ImageUrl} = supabase
          .storage
          .from('poducwest')
          .getPublicUrl(data?.path)


      if (!ImageUrl?.publicUrl) {
        setError("Something Went Wrong Try Again")
        return
      }



      await setDoc(doc(db, "drivers", user.uid), {
        name: fullName,
        email: user.email,
        phone,
        password:password,
        address,
        license: ImageUrl?.publicUrl,
      });

      alert("Registration successful! Please log in.");

      resetForm();
      history.push("/");

    } catch (err: any) {
      setError("Registration error: " + err.message);
    }
  };

  return (
    <IonPage>
      <IonContent className="" fullscreen>
        <div className="register-container">
          <IonCard className="register-card">
            <IonCardContent>
              <header className="font-bold text-[#007bff] text-center pb-2 text-2xl">Drivers' Registration</header>

              <IonItem>
                <IonInput placeholder="Full Name" value={fullName} onIonChange={(e) => setFullName(e.detail.value!)} required />
              </IonItem>

              <IonItem>
                <IonInput placeholder="Email" type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} required />
              </IonItem>

              <IonItem>
                <IonInput placeholder="Phone Number" type="tel" value={phone} onIonChange={(e) => setPhone(e.detail.value!)} />
              </IonItem>

              <IonItem>
                <IonInput placeholder="Address" value={address} onIonChange={(e) => setAddress(e.detail.value!)} required />
              </IonItem>

              <IonItem>
                <IonInput placeholder="Password" type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} required />
              </IonItem>

              <IonItem>
                <IonInput placeholder="Confirm Password" type="password" value={confirmPassword} onIonChange={(e) => setConfirmPassword(e.detail.value!)} required />
              </IonItem>

              <div className={"flex bg-[#1e1e1e] w-full place-items-center justify-center"}>

                <div className="rounded-md  p-4 shadow-md w-36">
                  <label htmlFor="upload" className="flex flex-col items-center gap-2 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white stroke-[#056ab3]"
                         viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span className="text-gray-600 opacity-70 text-center text-white">Upload Driver’s License</span>
                  </label>
                  <input id={"upload"}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                  />
                </div>
              </div>

              {license && (
                  <IonText className={"mt-2"} color="success">
                    File uploaded: {license.name}
                  </IonText>
              )}

              {error && (
                  <IonText color="danger">
                    <p>{error}</p>
                  </IonText>
              )}

              <IonButton  expand="full" onClick={handleRegister}>
                Register
              </IonButton>

              <p className="signup-text">
                Already have an account?{" "}
                <IonRouterLink routerLink="/login">Sign in!</IonRouterLink>
              </p>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
