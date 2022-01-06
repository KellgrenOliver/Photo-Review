import React, { useState } from "react";
import styled from "@emotion/styled";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";

const Container = styled.div({
  width: "85vw",
  "@media screen and (min-width: 600px)": {
    width: "40vw",
  },
  "@media screen and (min-width: 1024px)": {
    width: "25vw",
  },
});
const InputWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});
const ButtonWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  margin: "auto",
});
const UploadButton = styled.button({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #76b582, #368a46)",
  color: "white",
  borderRadius: "5px",
  border: "none",
  width: "100%",
  height: "50px",
  marginRight: "0.5rem",
});
const ResetButton = styled(UploadButton)({
  background: "linear-gradient(to right, #ababab, #6e6e6e)",
  marginLeft: "0.5rem",
  marginRight: 0,
});

const Input = styled.input({
  backgroundColor: "#dedede",
  width: "85vw",
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
  "@media screen and (min-width: 600px)": {
    width: "40vw",
  },
  "@media screen and (min-width: 1024px)": {
    width: "25vw",
  },
});

const UploadAlbum = () => {
  const [images, setImages] = useState([""]);
  const [message, setMessage] = useState();
  const [albumName, setAlbumName] = useState();
  const [uploadProgress, setUploadProgress] = useState(null);
  const { currentUser } = useAuthContext();

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const queryRef = query(
    collection(db, "photos"),
    where("owner", "==", currentUser.uid)
  );
  const { data } = useFirestoreQueryData(["photos"], queryRef);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploadProgress(null);

    if (!images) {
      return;
    }

    const albums = data && data.map((item) => item.album);

    if (albums.includes(albumName)) {
      setMessage({
        type: "warning",
        msg: "Album already exists!",
      });
      return;
    }

    images.forEach((image) => {
      // generate a uuid for the file
      const uuid = uuidv4();

      // find file extension
      const ext = image.name.substring(image.name.lastIndexOf(".") + 1 + 1);
      // create a reference to upload the file to
      const fileRef = ref(storage, `photos/${uuid}.${ext}`);

      // upload image to fileRef
      const uploadTask = uploadBytesResumable(fileRef, image);

      // attach upload observer
      uploadTask.on(
        "state_changed",
        (uploadTaskSnapshot) => {
          setUploadProgress(
            Math.round(
              (uploadTaskSnapshot.bytesTransferred /
                uploadTaskSnapshot.totalBytes) *
                100
            )
          );
        },
        (e) => {
          console.log("NOT so great success, fail!", e);

          setMessage({
            type: "warning",
            msg: `Image failed to upload due to the following error: ${e.message}`,
          });
        },
        async () => {
          // get download url to uploaded file
          const url = await getDownloadURL(fileRef);

          // get reference to collection 'image'
          const collectionRef = collection(db, `photos`);

          // create document in db for the uploaded file
          await addDoc(collectionRef, {
            owner: currentUser.uid,
            album: albumName,
            name: image.name,
            path: fileRef.fullPath,
            size: image.size,
            type: image.type,
            ext,
            url,
            uuid,
          });

          setMessage({
            type: "success",
            msg: "Your photos was successfully uploaded.",
          });
        }
      );
    });
  };

  const handleReset = () => {
    setImages(null);
    setMessage(null);
    setUploadProgress(null);
  };

  return (
    <Container>
      {message && <Alert variant={message.type}>{message.msg}</Alert>}
      <Form onSubmit={handleSubmit} onReset={handleReset}>
        <InputWrapper>
          <label>NAME OF ALBUM</label>
          <Input
            language="en-GB"
            required={true}
            type="text"
            onChange={(e) => setAlbumName(e.target.value)}
          />
        </InputWrapper>
        <Form.Group controlId="formImage" className="mb-3">
          <Form.Control type="file" multiple onChange={handleFileChange} />
        </Form.Group>
        <ButtonWrapper>
          <UploadButton type="submit" variant="primary">
            UPLOAD
          </UploadButton>
          <ResetButton type="reset" variant="danger">
            RESET
          </ResetButton>
        </ButtonWrapper>
      </Form>
      {uploadProgress && (
        <ProgressBar
          now={uploadProgress}
          label={`${uploadProgress}%`}
          className="my-3"
          animated
          striped
          variant="success"
        />
      )}
    </Container>
  );
};

export default UploadAlbum;
