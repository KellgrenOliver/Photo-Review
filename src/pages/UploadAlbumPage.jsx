import React from "react";
import styled from "@emotion/styled";
import UploadAlbum from "../components/UploadAlbum";
import Header from "../components/Header";

const Container = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  textAlign: "center",
});

const UploadAlbumPage = () => {
  return (
    <Container>
      <Header title={"UPLOAD ALBUM"} />
      {/* Render upload album component */}
      <UploadAlbum />
    </Container>
  );
};

export default UploadAlbumPage;
