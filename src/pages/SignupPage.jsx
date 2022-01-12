import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";

const Container = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
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
const LogInLink = styled(Link)({
  cursor: "pointer",
  textDecoration: "none",
  color: "black",
  fontSize: "0.8rem",
  "@media screen and (min-width: 1024px)": {
    fontSize: "0.9rem",
  },
});

const SignupPage = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState(null);
  const { signup } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If password and confirm password not matches
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("The passwords does not match");
    }
    setError(null);

    try {
      // Gives signup function email and password
      await signup(emailRef.current.value, passwordRef.current.value);
      // Navigates to homepage
      navigate("/");
      // Catches error and sets message to error message
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container>
      <Header title={"SIGN UP"} />
      {error && <h2>{error}</h2>}
      <form onSubmit={handleSubmit}>
        <div>
          <label type="email">Email</label>
        </div>
        <div>
          <Input type="email" ref={emailRef} required={true} />
        </div>
        <div>
          <label>Password</label>
        </div>
        <div>
          <Input type="password" ref={passwordRef} required={true} />
        </div>
        <div>
          <label>Confirm password</label>
        </div>
        <div>
          <Input type="password" ref={passwordConfirmRef} required={true} />
        </div>
        <div>
          <Button type="submit">CREATE</Button>
        </div>
      </form>
      <LogInLink to="/login">Already have an account? Log in here</LogInLink>
    </Container>
  );
};

export default SignupPage;
