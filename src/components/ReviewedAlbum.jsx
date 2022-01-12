import React, { useState } from "react";
import styled from "@emotion/styled";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

const ImageContainer = styled.div({
  width: "90vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  margin: "auto",
});
const Img = styled.img({
  margin: "0 0.5rem 1rem 0.5rem",
  height: "100px",
  width: "150px",
  borderRadius: "5px",
  cursor: "pointer",
  "@media screen and (min-width: 600px)": {
    margin: "0 1rem 2rem 1rem",
    height: "200px",
    width: "300px",
  },
  "@media screen and (min-width: 1024px)": {
    height: "250px",
    width: "400px",
  },
});
const HighlightImageWrapper = styled.div(({ highlightImage }) => {
  return {
    padding: "5rem",
    position: "fixed",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    top: 0,
    left: 0,
    right: 0,
    backgroundImage: `url(${highlightImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
});
const CloseX = styled.div({
  position: "absolute",
  top: 70,
  right: 20,
  borderRadius: "50%",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
  fontSize: "2rem",
});

const ReviewedAlbum = () => {
  // Gets the loged in user
  const { currentUser } = useAuthContext();
  const [highlightImage, setHighlightImage] = useState("");
  const params = useParams();

  // Reference to db
  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    where("review", "==", true),
    where("album", "==", params.id)
  );

  // Gets data from the referance
  const { data } = useFirestoreQueryData(["albums"], queryRef);

  return (
    <>
      <ImageContainer>
        {/* Maping out iamges */}
        {data &&
          data[0].images.map((photo) => (
            <Img
              key={photo.uuid}
              src={photo.url}
              alt={photo.name}
              onClick={() => setHighlightImage(photo.url)}
            />
          ))}
      </ImageContainer>
      {/* Show big image */}
      {highlightImage.length > 0 && (
        <HighlightImageWrapper highlightImage={highlightImage}>
          <CloseX onClick={() => setHighlightImage("")}>X</CloseX>
        </HighlightImageWrapper>
      )}
    </>
  );
};

export default ReviewedAlbum;
