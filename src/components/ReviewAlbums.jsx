import React from "react";
import { collection, query } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import styled from "@emotion/styled";
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

const ReviewAlbums = () => {
  const queryRef = query(collection(db, "albums"));
  const Navigate = useNavigate();

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  return (
    <Container>
      {data &&
        data.map((album) => {
          return (
            <Album
              onClick={() => Navigate(`${album.albumId}`)}
              key={album.albumId}
            >
              {album.album}
            </Album>
          );
        })}
    </Container>
  );
};

export default ReviewAlbums;
