import React, { useContext } from "react";
import Home from "./home/Home";
import { Route, Routes, Navigate } from 'react-router-dom';
import TrainerHome from "./trainer/TrainerHome";
import SearchResults from "./search/SearchResults";
import UserContext from "./context/UserContext";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import CustomizeLists from "./customizeLists/CustomizeLists";
import ProfileForm from "./forms/ProfileForm";

function AppRoutes() {
  const { currentUser } = useContext(UserContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to='/' />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/trainer" element={<TrainerHome />} />
      <Route path="/customize" element={
        <ProtectedRoute>
          <CustomizeLists />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfileForm />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;