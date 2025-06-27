import React, {createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {signInWithEmailAndPassword, User} from "firebase/auth";
import { auth } from  "../src/firebaseConfig"
import { signOut,getAuth, onAuthStateChanged } from "firebase/auth";
import {useHistory, useLocation} from "react-router";



export interface AuthContextValue {
    email: string;
    password: string;
    showError: string | null;
    loading: boolean;
    setEmail: Dispatch<SetStateAction<string>>;
    setPassword: Dispatch<SetStateAction<string>>;
    handleLogin: (e : React.FormEvent) => Promise<void>;
    handleLogOut: () => void;
    currentUser:User | null | undefined
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);


export const AuthProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState<string | null>(null);
    const [loading, setLoading]   = useState(false);
    const [currentUser,setCurrentUser]=useState<User | null | undefined>(undefined)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setShowError("Please enter both e-mail and password.");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email.trim(), password);

        } catch (err) {
            // typical Firebase error codes and messages
            let message = "Login failed. Please try again.";
            switch (err.code) {
                case "auth/user-not-found":
                    message = "No account exists with that e-mail.";
                    break;
                case "auth/wrong-password":
                    message = "Incorrect password.";
                    break;
                case "auth/invalid-email":
                    message = "E-mail address is not valid.";
                    break;
                default:
                    console.error(err);
            }
            setShowError(message);
        } finally {
            setLoading(false);

        }
    };

    const handleLogOut = () => {

        const auth = getAuth();
        signOut(auth).then(() => {
              setCurrentUser(null)
        }).catch((error) => {
            console.log(error)
        });
    }


    useEffect(()=>{


        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {

            if (user) {

                setCurrentUser(user)

            } else {
                setCurrentUser(null)
            }

        });
    },[])
    return (
        <AuthContext.Provider value={{
            handleLogin,handleLogOut,email,password,setPassword,setEmail,showError,loading,currentUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = ()=>{

    const  context = useContext(AuthContext)
    if (!context){
        throw  new  Error("useAuth must use Inside the AuthProvider")
    }


    return context
}