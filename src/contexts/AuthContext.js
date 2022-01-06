import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/index";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { RotateLoader } from "react-spinners";
import styled from "@emotion/styled";

const LoadingWrapper = styled.div({
  width: "100vw",
  marginTop: "5rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const AuthContext = createContext();

const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProverder = (props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signout = () => {
    return signOut(auth);
  };

  const setEmail = (newEmail) => {
    return updateEmail(currentUser, newEmail);
  };

  const setPassword = (newPassword) => {
    return updatePassword(currentUser, newPassword);
  };

  const setDisplayName = (name) => {
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

  const values = {
    currentUser,
    signup,
    login,
    signout,
    setEmail,
    setPassword,
    setDisplayName,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading && (
        <LoadingWrapper>
          <RotateLoader color={"#888"} size={50} />
        </LoadingWrapper>
      )}
      {!loading && props.children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProverder as default };
