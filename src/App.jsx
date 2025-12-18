import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Home from "./pages/Home";
import Planner from "./pages/Planner";
import Tour from "./pages/Tour";
import Altro from "./pages/Altro";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/planner"
          element={
            <MainLayout>
              <Planner />
            </MainLayout>
          }
        />
        <Route
          path="/tour"
          element={
            <MainLayout>
              <Tour />
            </MainLayout>
          }
        />
        <Route
          path="/altro"
          element={
            <MainLayout>
              <Altro />
            </MainLayout>
          }
        />
        <Route
  path="/login"
  element={
    <MainLayout>
      <Login />
    </MainLayout>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
