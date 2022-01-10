import React from "react";
import Header from "../components/Header";
import ReviewedAlbum from "../components/ReviewedAlbum";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import { useAuthContext } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";

const ReviwedAlbumPage = () => {
  const { currentUser } = useAuthContext();
  const params = useParams();

  const queryRef = query(
    collection(db, "albums"),
    where("owner", "==", currentUser.uid),
    where("review", "==", true),
    where("album", "==", params.id)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);

  return (
    <>
      <Header title={data && data[0].album.toUpperCase()} />
      <ReviewedAlbum />
    </>
  );
};

export default ReviwedAlbumPage;
