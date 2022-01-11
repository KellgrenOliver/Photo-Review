import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { collection, query, where, doc, setDoc } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Alert from "react-bootstrap/Alert";
import ReviewAlbumPhoto from "./ReviewAlbumPhoto";

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
  opacity: "0.3",
  "&.liked": {
    color: "gray",
    opacity: 1,
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
const SaveWrapper = styled.div({
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

const ReviewAlbum = () => {
  const [reviewedAlbum, setReviewedAlbum] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const params = useParams();
  const [message, setMessage] = useState();
  const [highlightImage, setHighlightImage] = useState("");
  const [isLiked, setIsLiked] = useState();
  const [isDisLiked, setIsDisLiked] = useState();

  const queryRef = query(
    collection(db, "albums"),
    where("albumId", "==", params.id)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  const handleReviewedAlbum = async (e) => {
    e.preventDefault();

    if (data[0].images.length !== reviewedAlbum.length + removedPhotos.length) {
      setMessage({
        type: "warning",
        msg: "Please review all images.",
      });
      return;
    }

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

  useEffect(() => {
    console.log({ removedPhotos });
    console.log({ reviewedAlbum });
  }, [removedPhotos, reviewedAlbum]);

  const addPhotoToGallery = (photo) => {
    setReviewedAlbum([...reviewedAlbum, photo]);
    const filteredAlbum = removedPhotos.filter(function (obj) {
      return obj.uuid !== photo.uuid;
    });
    setIsLiked(photo.uuid);
    setIsDisLiked(false);
    setRemovedPhotos(filteredAlbum);
  };

  const removePhotoFromGallery = (photo) => {
    const filteredAlbum = reviewedAlbum.filter(function (obj) {
      return obj.uuid !== photo.uuid;
    });
    setIsDisLiked(photo.uuid);
    setIsLiked(false);
    setRemovedPhotos([...removedPhotos, photo]);
    setReviewedAlbum(filteredAlbum);
  };

  return (
    <>
      <ImageContainer>
        {data && (
          <>
            {data[0].images.map((photo) => {
              return (
                // <ImageWrapper key={photo.uuid}>
                //   <Img
                //     src={photo.url}
                //     alt={photo.name}
                //     onClick={() => {
                //       setHighlightImage(photo.url);
                //     }}
                //   />
                //   <IconWrapper>
                //     <Icon
                //       className={isLiked === photo.uuid && "liked"}
                //       icon={faThumbsUp}
                //       onClick={() => {
                //         addPhotoToGallery(photo);
                //       }}
                //     />
                //     <Icon
                //       className={isDisLiked === photo.uuid && "liked"}
                //       icon={faThumbsDown}
                //       onClick={() => {
                //         removePhotoFromGallery(photo);
                //       }}
                //     />
                //   </IconWrapper>
                // </ImageWrapper>
                <ReviewAlbumPhoto photo={photo} key={photo.uuid} />
              );
            })}
          </>
        )}
      </ImageContainer>
      <SaveWrapper>
        {message && <Alert variant={message.type}>{message.msg}</Alert>}
        <form onSubmit={handleReviewedAlbum}>
          <Button type="submit">SAVE</Button>
        </form>
      </SaveWrapper>
      {highlightImage.length > 0 && (
        <HighlightImageWrapper highlightImage={highlightImage}>
          <CloseX onClick={() => setHighlightImage("")}>X</CloseX>
        </HighlightImageWrapper>
      )}
    </>
  );
};

export default ReviewAlbum;
