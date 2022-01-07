import React from "react";
import styled from "@emotion/styled";
import { useAuthContext } from "../contexts/AuthContext";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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

const MyAlbumsPage = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  const albumArr =
    data &&
    data.map((album) => {
      return album.album;
    });

  let Arr =
    albumArr &&
    albumArr.filter((value, index, array) => array.indexOf(value) === index);

  return (
    <>
      <Header title={"ALBUMS"} />
      <Container>
        {Arr &&
          Arr.map((album, i) => {
            return (
              <Album onClick={() => navigate(album)} key={i}>
                <h5>{album.toUpperCase()}</h5>
              </Album>
            );
          })}
      </Container>
    </>
  );
};

export default MyAlbumsPage;
