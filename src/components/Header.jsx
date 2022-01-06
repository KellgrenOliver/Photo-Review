import React from "react";
import styled from "@emotion/styled";

const H1 = styled.h1({
  fontWeight: 200,
  fontSize: "3rem",
  marginTop: "15vh",
  marginBottom: "5vh",
  textAlign: "center",
  "@media screen and (min-width: 600px)": {
    fontSize: "4rem",
  },
  "@media screen and (min-width: 1024px)": {
    fontSize: "5rem",
  },
});
const Header = (props) => {
  return (
    <>
      <H1>{props.title}</H1>
    </>
  );
};

export default Header;
