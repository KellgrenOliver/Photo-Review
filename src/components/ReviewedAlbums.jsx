import React from "react";
import styled from "@emotion/styled";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Container = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
});
const Album = styled.div({
  width: "250px",
  height: "150px",
  background: "linear-gradient(to right, #76b582, #368a46)",
  color: "white",
  margin: "0 2rem 2rem 2rem",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  padding: "20px",
  textAlign: "center",
});

const ReviewedAlbums = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    where("review", "==", true)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  return (
    <Container>
      {data &&
        data.map((album) => (
          <Album key={album.albumId} onClick={() => navigate(album.album)}>
            {album.album.toUpperCase()}
          </Album>
        ))}
    </Container>
  );
};

export default ReviewedAlbums;
