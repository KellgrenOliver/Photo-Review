import React, { useState } from "react";
import styled from "@emotion/styled";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import ProgressBar from "react-bootstrap/ProgressBar";
import { v4 as uuidv4 } from "uuid";
import { collection, query, where, doc, updateDoc } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

const Container = styled.div({
  width: "85vw",
  "@media screen and (min-width: 600px)": {
    width: "40vw",
  },
  "@media screen and (min-width: 1024px)": {
    width: "25vw",
  },
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

const UpdateAlbum = () => {
  const params = useParams();
  const [images, setImages] = useState([""]);
  const [message, setMessage] = useState();
  const [uploadProgress, setUploadProgress] = useState(null);
  const { currentUser } = useAuthContext();

  // Gets the files that are selected
  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const queryRef = query(
    collection(db, "albums"),
    where("review", "==", false),
    where("owner", "==", currentUser.uid),
    where("albumId", "==", params.id)
  );
  const { data } = useFirestoreQueryData(["albums"], queryRef);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUploadProgress(null);

    // If there isnt any images its gonna end here
    if (!images) {
      return;
    }

    // Creates array of the files that are gonna be uploaded
    const uploadImages = [];

    // Looping through the images
    for (let i = 0; i < images.length; i++) {
      let image = images[i];
      // Creats a unique id
      const uuid = uuidv4();
      // File extension
      const ext = image.name.substring(image.name.lastIndexOf(".") + 1 + 1);
      // Creates a reference to upload the file to storage
      const fileRef = ref(storage, `albums/${params.id}/${uuid}.${ext}`);
      //Uploading the image to reference
      const uploadTask = uploadBytesResumable(fileRef, image);

      // Observer
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
          setMessage({
            type: "warning",
            msg: `Image failed to upload due to the following error: ${e.message}`,
          });
        },
        async () => {
          // Gets the download url to the uploaded file
          const url = await getDownloadURL(fileRef);
          uploadImages.push({
            name: image.name,
            path: fileRef.fullPath,
            size: image.size,
            type: image.type,
            ext,
            url,
            uuid,
          });

          const collectionRef = doc(db, "albums", data && data[0].album);
          // Sets the new data
          const docData = {
            images: uploadImages.concat(data && data[0].images),
          };
          // Updating document
          await updateDoc(collectionRef, docData);

          setMessage({
            type: "success",
            msg: "Images was successfully uploaded.",
          });
        }
      );
    }
  };
  // Removes the selceted files
  const handleReset = () => {
    setImages(null);
    setMessage(null);
    setUploadProgress(null);
  };

  return (
    <Container>
      {message && <Alert variant={message.type}>{message.msg}</Alert>}
      <Form onSubmit={handleSubmit} onReset={handleReset}>
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

export default UpdateAlbum;
