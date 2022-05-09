import React, {
  VFC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Spinner } from "react-bootstrap";

import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/index";

interface AuthContextProps {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  loading: boolean;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  // resetPassword,
  setDisplayName: (name: string) => Promise<void> | undefined;
  setEmail: (newEmail: string) => Promise<void> | undefined;
  setPassword: (newPassword: string) => Promise<void> | undefined;
}

interface Props {
  children: ReactNode;
}
const AuthContext = createContext({} as AuthContextProps);

const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProvider: VFC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const setEmail = (newEmail: string) => {
    if (currentUser) return updateEmail(currentUser, newEmail);
  };

  const setPassword = (newPassword: string) => {
    if (currentUser) return updatePassword(currentUser, newPassword);
  };

  const setDisplayName = (name: string) => {
    if (currentUser)
      return updateProfile(currentUser, {
        displayName: name,
      });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
  }, []);

  const contextValues: AuthContextProps = {
    currentUser,
    loading,
    login,
    logout,
    signup,
    setDisplayName,
    setEmail,
    setPassword,
  };
  return (
    <AuthContext.Provider value={contextValues}>
      {loading && (
        <div className="spinner-wrapper">
          <Spinner animation="grow" variant="secondary" />
        </div>
      )}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProvider as default };
