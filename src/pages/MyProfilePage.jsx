import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { useAuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";

const Container = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
});
const InputWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});
const Input = styled.input({
  backgroundColor: "#dedede",
  width: "85vw",
  height: "35px",
  marginTop: "0.2rem",
  marginBottom: "1rem",
  borderRadius: "5px",
  paddingLeft: "5px",
  border: "none",
  textAlign: "center",
  "&:focus": {
    outline: "none",
  },
  "@media screen and (min-width: 600px)": {
    width: "40vw",
  },
  "@media screen and (min-width: 1024px)": {
    width: "25vw",
  },
});
const Button = styled.button({
  background: "linear-gradient(to right, #76b582, #368a46)",
  width: "100px",
  height: "35px",
  borderRadius: "5px",
  color: "white",
  textAlign: "center",
  border: "none",
  marginBottom: "1rem",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#187580",
  },
});
const MyProfilePage = () => {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { currentUser, setDisplayName, setEmail, setPassword } =
    useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("The passwords does not match");
    }

    try {
      setLoading(true);

      if (displayNameRef.current.value !== currentUser.displayName) {
        await setDisplayName(displayNameRef.current.value);
      }

      if (emailRef.current.value !== currentUser.email) {
        await setEmail(emailRef.current.value);
      }

      if (passwordRef.current.value) {
        await setPassword(passwordRef.current.value);
      }
      setMessage("Profile successfully updated");
      setLoading(false);
    } catch (e) {
      setError("Error updating profile. Please try logging out and in again.");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header title={"MY PROFILE"} />
      <form onSubmit={handleSubmit}>
        {error && <h1>{error}</h1>}
        {message && <h1 variant="success">{message}</h1>}
        <InputWrapper>
          <label>DISPLAYNAME</label>
          <Input
            type="text"
            ref={displayNameRef}
            defaultValue={currentUser && currentUser.displayName}
          />
          <label>EMAIL</label>
          <Input
            type="email"
            ref={emailRef}
            defaultValue={currentUser && currentUser.email}
            required={true}
          />
          <label>NEW PASSWORD</label>
          <Input
            type="password"
            ref={passwordRef}
            autoComplete="new-password"
          />
          <label>CONFIRM NEW PASSWORD</label>
          <Input
            type="password"
            ref={passwordConfirmRef}
            autoComplete="new-password"
          />
        </InputWrapper>
        <Button disabled={loading} type="submit">
          CONFIRM
        </Button>
      </form>
    </Container>
  );
};

export default MyProfilePage;
