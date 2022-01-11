import React, { useState } from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

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

const ReviewAlbumPhoto = (photo) => {
  const [reviewedAlbum, setReviewedAlbum] = useState([]);
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const params = useParams();
  const [message, setMessage] = useState();
  const [highlightImage, setHighlightImage] = useState("");
  const [isLiked, setIsLiked] = useState();
  const [isDisLiked, setIsDisLiked] = useState();

  console.log(photo.photo);

  return (
    <>
      {photo.photo && (
        <ImageWrapper key={photo.photo.uuid}>
          <Img
            src={photo.photo.url}
            alt={photo.photo.name}
            onClick={() => {
              setHighlightImage(photo.photo.url);
            }}
          />
          <IconWrapper>
            <Icon
              className={isLiked === photo.photo.uuid && "liked"}
              icon={faThumbsUp}
              // onClick={() => {
              //   addPhotoToGallery(photo);
              // }}
            />
            <Icon
              className={isDisLiked === photo.photo.uuid && "liked"}
              icon={faThumbsDown}
              // onClick={() => {
              //   removePhotoFromGallery(photo);
              // }}
            />
          </IconWrapper>
        </ImageWrapper>
      )}
    </>
  );
};

export default ReviewAlbumPhoto;
