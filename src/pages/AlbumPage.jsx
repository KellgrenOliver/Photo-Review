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
  onSnapshot,
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
  fontSize: "0.5rem",
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
  const [album, setAlbum] = useState();

  // Gets reference to db to get specific album from user
  const queryRef = query(
    collection(db, "albums"),
    where("review", "==", false),
    where("albumId", "==", params.id),
    where("owner", "==", currentUser.uid)
  );
  // Gets reference to db to get all albums from user
  const albumRef = query(
    collection(db, "albums"),
    where("review", "==", false),
    where("owner", "==", currentUser.uid)
  );

  let { data } = useFirestoreQueryData(["albums"], queryRef);
  const { data: albumData } = useFirestoreQueryData(["albums"], albumRef);

  // Maps albums to a const
  const albums = albumData && albumData[0].images.map((item) => item.album);

  useEffect(() => {
    // Onsnapshot function to get live data
    onSnapshot(queryRef, (snapshot) => {
      data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setAlbum(data);
    });
  }, []);

  const submitAlbumName = async (e) => {
    e.preventDefault();
    setUpdateAlbumName(updateAlbumName);

    setUpdateAlbumName("");
    const collectionRef = doc(db, "albums", updateAlbumName);
    // Sets data to the new album
    const docData = {
      owner: currentUser.uid,
      album: updateAlbumName,
      albumId: album[0].albumId,
      images: album[0].images,
      review: false,
    };
    // Creats new album with new albumname
    await setDoc(collectionRef, docData);
    // Deletes album with the old albumname
    await deleteDoc(doc(db, "albums", album && album[0].album));
  };

  const handleNewAlbum = async (e) => {
    e.preventDefault();

    // If there isnt any images selected
    if (newAlbum.length === 0) {
      setMessage({
        type: "warning",
        msg: "Please add at least one photo to your album.",
      });
      return;
    }
    // If the new album name already exists
    if (albums.includes(newAlbumName)) {
      setMessage({
        type: "warning",
        msg: "Album already exists.",
      });
      return;
    }
    // Creats a random id
    let albumId = Math.random().toString(36).slice(2);

    const collectionRef = doc(db, "albums", newAlbumName);
    // Sets data to the new album
    const docData = {
      owner: currentUser.uid,
      albumId: albumId,
      album: newAlbumName,
      images: newAlbum,
      review: false,
    };
    // Creats new album
    await setDoc(collectionRef, docData);

    setMessage({
      type: "success",
      msg: "Album was successfully created.",
    });
  };
  // Checkbox takes checked and photo as props
  const changeCheckbox = (checked, photo) => {
    if (checked) {
      // Takes copy of array and adds photo
      setNewAlbum([...newAlbum, photo]);
    } else {
      // Filtering newAlbum
      const album = newAlbum.filter(function (obj) {
        return obj.uuid !== photo.uuid;
      });
      setNewAlbum(album);
    }
  };

  const link = `https://www.olivernaturephotos.netlify.app/reviewalbum//reviewalbum/${params.id}`;
  // Copy function
  const copy = async () => {
    await navigator.clipboard.writeText(link);
  };

  return (
    <>
      <Header title={album && album[0].album.toUpperCase()} />
      {/* Edit album name form */}
      <form onSubmit={submitAlbumName}>
        <InputWrapper>
          <label>EDIT ALBUM NAME</label>
          <Input
            type="text"
            value={updateAlbumName}
            required={true}
            onChange={(e) => setUpdateAlbumName(e.target.value)}
          />
          <Button type="submit">SAVE</Button>
        </InputWrapper>
      </form>
      {/* Add photos to album */}
      <UpdateAlbumWrapper>
        <label>ADD PHOTOS</label>
        <UpdateAlbum />
      </UpdateAlbumWrapper>
      <Label>LINK TO CUSTOMER</Label>
      {/* Copy link to customer */}
      <LinkWrapper>
        <CopyButton onClick={copy}>COPY</CopyButton>
        <LinkToReviewBox>
          <span>{link}</span>
        </LinkToReviewBox>
      </LinkWrapper>
      {/* Maps out images */}
      <ImageContainer>
        {album &&
          album[0].images &&
          album[0].images.map((photo) => {
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
      {/* Create a new album from the existing album */}
      <NewAlbumForm onSubmit={handleNewAlbum}>
        {message && <Alert variant={message.type}>{message.msg}</Alert>}
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
      {/* Big image */}
      {highlightImage.length > 0 && (
        <HighlightImageWrapper highlightImage={highlightImage}>
          <CloseX onClick={() => setHighlightImage("")}>X</CloseX>
        </HighlightImageWrapper>
      )}
    </>
  );
};

export default AlbumPage;
