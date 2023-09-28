import React from "react";
import Home from "./home/Home";
import { Route, Routes, Navigate } from 'react-router-dom';
import ResultsList from "./details/ResultsList";

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<ResultsList />} />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;