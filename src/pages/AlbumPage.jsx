import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import { useAuthContext } from "../contexts/AuthContext";
import UpdateAlbum from "../components/UpdateAlbum";

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
const InputWrapper = styled.div({
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  marginBottom: "3rem",
  width: "85vw",
  "@media screen and (min-width: 600px)": {
    width: "40vw",
  },
  "@media screen and (min-width: 1024px)": {
    width: "25vw",
  },
});
const Input = styled.input({
  backgroundColor: "#dedede",
  width: "100%",
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
});
const Button = styled.button({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #76b582, #368a46)",
  color: "white",
  borderRadius: "5px",
  border: "none",
  width: "100%",
  height: "50px",
});
const HighlightImageWrapper = styled.div(({ highlightImage }) => {
  return {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundImage: `url(${highlightImage})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
});
const ImageWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});
const Checkbox = styled.input({
  margin: "0 1rem 1rem 1rem",
  width: "25px",
  height: "25px",
});
const UpdateAlbumWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "5rem",
});
const NewAlbumForm = styled.form({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const AlbumPage = () => {
  const params = useParams();
  const { currentUser } = useAuthContext();
  const [updateAlbumName, setUpdateAlbumName] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [highlightImage, setHighlightImage] = useState("");
  const [newAlbum, setNewAlbum] = useState([]);

  console.log(newAlbum);

  const queryRef = query(
    collection(db, "albums"),
    where("album", "==", params.id),
    where("owner", "==", currentUser.uid)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  const submitAlbumName = async (e) => {
    e.preventDefault();
    const collectionRef = doc(db, "albums", updateAlbumName);

    const docData = {
      owner: currentUser.uid,
      album: updateAlbumName,
      albumId: data[0].albumId,
      images: data[0].images,
    };

    await setDoc(collectionRef, docData);
    await deleteDoc(doc(db, "albums", params.id));
  };

  const handleNewAlbum = async (e) => {
    e.preventDefault();

    let albumId = Math.random().toString(36).slice(2);

    const hejRef = doc(db, "albums", newAlbumName);
    const hejData = {
      owner: currentUser.uid,
      albumId: albumId,
      album: newAlbumName,
      images: newAlbum,
    };

    await setDoc(hejRef, hejData);
  };

  return (
    <>
      <Header title={data && data[0].album.toUpperCase()} />
      <form onSubmit={submitAlbumName}>
        <InputWrapper>
          <label>EDIT ALBUM NAME</label>
          <Input
            type="text"
            value={updateAlbumName}
            onChange={(e) => setUpdateAlbumName(e.target.value)}
          />
          <Button type="submit">SAVE</Button>
        </InputWrapper>
      </form>
      <UpdateAlbumWrapper>
        <UpdateAlbum />
      </UpdateAlbumWrapper>
      <ImageContainer>
        {data[0].images &&
          data[0].images.map((photo) => {
            return (
              <ImageWrapper key={photo.uuid}>
                <Img
                  src={photo.url}
                  alt={photo.name}
                  onClick={() => setHighlightImage(photo.url)}
                />
                <Checkbox
                  type="checkbox"
                  onClick={() => {
                    newAlbum.push(photo);
                  }}
                />
              </ImageWrapper>
            );
          })}
      </ImageContainer>
      <NewAlbumForm onSubmit={handleNewAlbum}>
        <label>NAME OF THE NEW ALBUM</label>
        <input
          type="text"
          required={true}
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
        />
        <button type="submit">Create</button>
      </NewAlbumForm>
      {highlightImage.length > 0 && (
        <HighlightImageWrapper highlightImage={highlightImage}>
          <button
            style={{
              position: "absolute",
              top: 73,
              right: 12,
              borderRadius: "50%",
            }}
            onClick={() => setHighlightImage("")}
          >
            X
          </button>
        </HighlightImageWrapper>
      )}
    </>
  );
};

export default AlbumPage;
