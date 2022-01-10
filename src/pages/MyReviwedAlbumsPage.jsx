import React from "react";
import Header from "../components/Header";
import ReviewedAlbums from "../components/ReviewedAlbums";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";
import styled from "@emotion/styled";

const Text = styled.span({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "1rem",
});

const MyReviwedAlbumsPage = () => {
  const { currentUser } = useAuthContext();

  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    where("review", "==", true)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);
  return (
    <div>
      <Header title={"REVIEWED ALBUMS"} />
      {data && data.length > 0 ? (
        <>
          <ReviewedAlbums />
        </>
      ) : (
        <>
          <Text>You don't have any reviewed albums.</Text>
        </>
      )}
    </div>
  );
};

export default MyReviwedAlbumsPage;
