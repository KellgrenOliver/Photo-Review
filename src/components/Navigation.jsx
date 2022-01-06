import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";
import { useAuthContext } from "../contexts/AuthContext";

const Icon = styled(FontAwesomeIcon)({
  backgroundImage: "linear-gradient(to right, #76b582, #368a46)",
  padding: "5px",
  fontSize: "40px",
});
const LogoWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});
const BrandName = styled.span({
  marginLeft: "0.5rem",
  fontSize: "1.5rem",
  fontWeight: 200,
});
const StyledLink = styled(Link)({
  fontSize: "1.2rem",
  fontWeight: 200,
  borderBottom: "3px solid transparent",
  textDecoration: "none",
  color: "white",
  margin: "0 1rem 0 1rem",
  "&:hover": {
    color: "white",
    borderBottom: "3px solid gray",
  },
  "&.Active": {
    borderBottom: "3px solid white",
  },
});

const Navigation = () => {
  const { currentUser } = useAuthContext();
  const [activeLink, setActiveLink] = useState();

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="fixed-top">
      <Container>
        <Link to="/" className="navbar-brand">
          <LogoWrapper>
            <Icon icon={faLeaf} />
            <BrandName onClick={() => setActiveLink("")}>
              NATURE PHOTOS
            </BrandName>
          </LogoWrapper>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                <StyledLink
                  to="/myprofile"
                  onClick={() => setActiveLink("myprofile")}
                  className={activeLink === "myprofile" && "Active"}
                >
                  {currentUser.displayName
                    ? currentUser.displayName.toUpperCase()
                    : currentUser.email.toUpperCase()}
                </StyledLink>
                <StyledLink
                  onClick={() => setActiveLink("uploadalbum")}
                  className={activeLink === "uploadalbum" && "Active"}
                  id="uploadalbum"
                  to="/uploadalbum"
                >
                  UPLOAD ALBUM
                </StyledLink>
                <StyledLink
                  to="/albums"
                  onClick={() => setActiveLink("albums")}
                  className={activeLink === "albums" && "Active"}
                >
                  ALBUMS
                </StyledLink>
                <StyledLink
                  to="/logout"
                  onClick={() => setActiveLink("logout")}
                  className={activeLink === "logout" && "Active"}
                >
                  LOG OUT
                </StyledLink>
              </>
            ) : (
              <>
                <StyledLink
                  to="/reviewalbum"
                  onClick={() => setActiveLink("reviewalbum")}
                  className={activeLink === "reviewalbum" && "Active"}
                >
                  REVIEW ALBUM
                </StyledLink>
                <StyledLink
                  to="/photographs"
                  onClick={() => setActiveLink("photographs")}
                  className={activeLink === "photographs" && "Active"}
                >
                  PHOTOGRAPHS
                </StyledLink>
                <StyledLink
                  to="/login"
                  onClick={() => setActiveLink("login")}
                  className={activeLink === "login" && "Active"}
                >
                  LOG IN
                </StyledLink>
                <StyledLink
                  to="/signup"
                  onClick={() => setActiveLink("signup")}
                  className={activeLink === "signup" && "Active"}
                >
                  SIGN UP
                </StyledLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
