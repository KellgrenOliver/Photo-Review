import React, { useState } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { collection, query, where, doc } from "firebase/firestore";
import {
  useFirestoreQueryData,
  useFirestoreDocumentMutation,
} from "@react-query-firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import { useAuthContext } from "../contexts/AuthContext";

const Container = styled.div({
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

const AlbumPage = () => {
  const params = useParams();
  const { currentUser } = useAuthContext();
  const [newAlbumName, setNewAlbumName] = useState("");

  const queryRef = query(
    collection(db, "photos"),
    where("album", "==", params.id),
    where("owner", "==", currentUser.uid)
  );

  const { data } = useFirestoreQueryData(["photos"], queryRef);

  const mutation = useFirestoreDocumentMutation(queryRef);

  const submitAlbumName = () => {
    mutation.mutate({
      album: newAlbumName,
    });
  };

  return (
    <>
      <Header title={params.id.toUpperCase()} />
      <label>EDIT ALBUM NAME</label>
      <form onSubmit={() => submitAlbumName}>
        <input
          type="text"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <button type="submit">SAVE</button>
      </form>
      <Container>
        {data &&
          data.map((photo) => {
            return (
              <>
                <Img key={photo.uuid} src={photo.url} alt={photo.name} />
              </>
            );
          })}
      </Container>
    </>
  );
};

export default AlbumPage;
