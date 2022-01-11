import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthContextProvider from "./contexts/AuthContext";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LogoutPage from "./pages/LogoutPage";
import MyProfilePage from "./pages/MyProfilePage";
import UploadAlbumPage from "./pages/UploadAlbumPage";
import MyAlbumsPage from "./pages/MyAlbumsPage";
import AlbumPage from "./pages/AlbumPage";
import ReviewAlbumPage from "./pages/ReviewAlbumPage";
import MyReviwedAlbumsPage from "./pages/MyReviwedAlbumsPage";
import ReviwedAlbumPage from "./pages/ReviwedAlbumPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2,
      cacheTime: 1000 * 60 * 60 * 4,
    },
  },
});

const App = () => {
  return (
    <div id="app">
      <Router>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <AuthContextProvider>
            <Navigation />
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route exact path="/signup" element={<SignupPage />} />
              <Route exact path="/logout" element={<LogoutPage />} />
              <Route exact path="/myprofile" element={<MyProfilePage />} />
              <Route exact path="/albums" element={<MyAlbumsPage />} />
              <Route exact path="/albums/:id" element={<AlbumPage />} />
              <Route exact path="/uploadalbum" element={<UploadAlbumPage />} />
              <Route
                exact
                path="/reviewalbum/:id"
                element={<ReviewAlbumPage />}
              />
              <Route
                exact
                path="/reviewedalbums"
                element={<MyReviwedAlbumsPage />}
              />
              <Route
                exact
                path="/reviewedalbums/:id"
                element={<ReviwedAlbumPage />}
              />
            </Routes>
          </AuthContextProvider>
        </QueryClientProvider>
      </Router>
    </div>
  );
};

export default App;
