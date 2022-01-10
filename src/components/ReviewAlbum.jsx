import React, { useState } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { collection, query, where, doc, setDoc } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
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
const ImageWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});
const IconWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
});
const Icon = styled(FontAwesomeIcon)({
  fontSize: "3rem",
  margin: "0 1rem 1rem 1rem",
  cursor: "pointer",
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

const ReviewAlbum = () => {
  const [reviewedAlbum, setReviewedAlbum] = useState([]);
  const params = useParams();
  const [message, setMessage] = useState();

  const queryRef = query(
    collection(db, "albums"),
    where("albumId", "==", params.id)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  const handleReviewedAlbum = async (e) => {
    e.preventDefault();
    setReviewedAlbum(reviewedAlbum);

    let albumId = Math.random().toString(36).slice(2);

    const collectionRef = doc(db, "albums", `Reviewed album: ${data[0].album}`);
    const docData = {
      owner: data[0].owner,
      albumId: albumId,
      album: data[0].album,
      images: reviewedAlbum,
      review: true,
    };

    await setDoc(collectionRef, docData);

    setMessage({
      type: "success",
      msg: "Album was successfully created.",
    });
  };

  return (
    <>
      <ImageContainer>
        {data && (
          <>
            {data[0].images.map((photo) => {
              return (
                <ImageWrapper key={photo.uuid}>
                  <Img src={photo.url} alt={photo.name} />
                  <IconWrapper>
                    <Icon
                      icon={faThumbsUp}
                      onClick={() => {
                        reviewedAlbum.push(photo);
                      }}
                    />
                    <Icon
                      icon={faThumbsDown}
                      onClick={() => {
                        reviewedAlbum.shift(photo);
                      }}
                    />
                  </IconWrapper>
                </ImageWrapper>
              );
            })}
          </>
        )}
      </ImageContainer>
      {message && <Alert variant={message.type}>{message.msg}</Alert>}
      <form onSubmit={handleReviewedAlbum}>
        <Button type="submit">SAVE</Button>
      </form>
    </>
  );
};

export default ReviewAlbum;
