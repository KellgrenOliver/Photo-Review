import React from "react";
import styled from "@emotion/styled";
import { useAuthContext } from "../contexts/AuthContext";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Link } from "react-router-dom";

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
const AlbumLink = styled(Link)({
  width: "250px",
  height: "50px",
  background: "linear-gradient(to right, #76b582, #368a46)",
  textDecoration: "none",
  color: "white",
  margin: "0 2rem 2rem 2rem",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  padding: "20px",
  textAlign: "center",
  "&:hover": {
    color: "white",
  },
});

const MyAlbumsPage = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    where("review", "==", false)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  return (
    <>
      <Header title={"ALBUMS"} />
      <Container>
        {data && data.length > 0 ? (
          data.map((album) => (
            <Album onClick={() => navigate(album.album)} key={album.albumId}>
              {album.album.toUpperCase()}
            </Album>
          ))
        ) : (
          <>
            <AlbumLink to="/uploadalbum">UPLOAD ALBUM</AlbumLink>
          </>
        )}
      </Container>
    </>
  );
};

export default MyAlbumsPage;
