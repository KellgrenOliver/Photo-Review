import React from "react";
import { useParams } from "react-router-dom";
import { collection, query, where } from "firebase/firestore";
import { useFirestoreQueryData } from "@react-query-firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import ReviewAlbum from "../components/ReviewAlbum";

const ReviewAlbumPage = () => {
  const params = useParams();
  const queryRef = query(
    collection(db, "albums"),
    where("albumId", "==", params.id)
  );

  const { data } = useFirestoreQueryData(["albums"], queryRef);
  return (
    <div>
      <Header title={data && data[0].album} />
      <ReviewAlbum />
    </div>
  );
};

export default ReviewAlbumPage;
