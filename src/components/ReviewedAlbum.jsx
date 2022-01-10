import React from "react";
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

const ReviewedAlbum = () => {
  const { currentUser } = useAuthContext();
  const params = useParams();

  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    where("review", "==", true),
    where("album", "==", params.id)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  return (
    <ImageContainer>
      {data &&
        data[0].images.map((photo) => (
          <Img key={photo.uuid} src={photo.url} alt={photo.name} />
        ))}
    </ImageContainer>
  );
};

export default ReviewedAlbum;
