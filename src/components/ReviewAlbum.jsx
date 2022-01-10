import React from "react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

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

const ReviewAlbum = () => {
  const params = useParams();
  const queryRef = query(
    collection(db, "albums"),
    where("albumId", "==", params.id)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  return (
    <>
      <ImageContainer>
        {data && (
          <>
            {data[0].images.map((photo) => {
              return (
                <ImageWrapper>
                  <Img key={photo.uuid} src={photo.url} alt={photo.name} />
                  <IconWrapper>
                    <Icon icon={faThumbsUp} />
                    <Icon icon={faThumbsDown} />
                  </IconWrapper>
                </ImageWrapper>
              );
            })}
          </>
        )}
      </ImageContainer>
    </>
  );
};

export default ReviewAlbum;
