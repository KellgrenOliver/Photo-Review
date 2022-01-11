import React, { useState } from "react";
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
import Alert from "react-bootstrap/Alert";

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
const LinkWrapper = styled(InputWrapper)({
  flexDirection: "row",
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
  cursor: "pointer",
});
const UpdateAlbumWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  marginBottom: "3rem",
});
const NewAlbumForm = styled.form({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
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
const LinkToReviewBox = styled.div({
  height: "50px",
  backgroundColor: "#dedede",
  borderRadius: "0 5px 5px 0",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "0.7rem",
  fontSize: "0.7rem",
});
const Label = styled.label({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "auto",
});
const CopyButton = styled(Button)({
  borderRadius: "5px 0 0 5px",
});

const AlbumPage = () => {
  const params = useParams();
  const { currentUser } = useAuthContext();
  const [updateAlbumName, setUpdateAlbumName] = useState("");
  const [newAlbumName, setNewAlbumName] = useState("");
  const [highlightImage, setHighlightImage] = useState("");
  const [newAlbum, setNewAlbum] = useState([]);
  const [message, setMessage] = useState();

  const queryRef = query(
    collection(db, "albums"),
    where("album", "==", params.id),
    where("owner", "==", currentUser.uid),
    where("review", "==", false)
  );
  const albumRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    where("review", "==", false)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);
  const { data: albumData } = useFirestoreQueryData(["albums"], albumRef);

  console.log(data);

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

    if (newAlbum.length === 0) {
      setMessage({
        type: "warning",
        msg: "Please add at least one photo to your album.",
      });
      return;
    }

    const albums = albumData && albumData[0].images.map((item) => item.album);

    if (albums.includes(newAlbumName)) {
      setMessage({
        type: "warning",
        msg: "Album already exists.",
      });
      return;
    }

    let albumId = Math.random().toString(36).slice(2);

    const collectionRef = doc(db, "albums", newAlbumName);
    const docData = {
      owner: currentUser.uid,
      albumId: albumId,
      album: newAlbumName,
      images: newAlbum,
      review: false,
    };

    await setDoc(collectionRef, docData);

    setMessage({
      type: "success",
      msg: "Album was successfully created.",
    });
  };

  const changeCheckbox = (checked, photo) => {
    if (checked) {
      setNewAlbum([...newAlbum, photo]);
    } else {
      const album = newAlbum.filter(function (obj) {
        return obj.uuid !== photo.uuid;
      });
      setNewAlbum(album);
    }
  };

  const link = `www.localhost:3000/reviewalbum/${data && data[0].albumId}`;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
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
        <label>ADD PHOTOS</label>
        <UpdateAlbum />
      </UpdateAlbumWrapper>
      <Label>LINK TO CUSTOMER</Label>
      <LinkWrapper>
        <CopyButton onClick={copy}>COPY</CopyButton>
        <LinkToReviewBox>
          <span>{link}</span>
        </LinkToReviewBox>
      </LinkWrapper>
      <ImageContainer>
        {data &&
          data[0].images &&
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
                  defaultValue={false}
                  onChange={(e) => changeCheckbox(e.target.checked, photo)}
                />
              </ImageWrapper>
            );
          })}
      </ImageContainer>
      {message && <Alert variant={message.type}>{message.msg}</Alert>}
      <NewAlbumForm onSubmit={handleNewAlbum}>
        <InputWrapper>
          <label>NAME OF THE NEW ALBUM</label>
          <Input
            type="text"
            required={true}
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
          />
          <Button type="submit">CREATE</Button>
        </InputWrapper>
      </NewAlbumForm>
      {highlightImage.length > 0 && (
        <HighlightImageWrapper highlightImage={highlightImage}>
          <CloseX onClick={() => setHighlightImage("")}>X</CloseX>
        </HighlightImageWrapper>
      )}
    </>
  );
};

export default AlbumPage;
