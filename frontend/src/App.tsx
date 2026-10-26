import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Livros from "./pages/Livros";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/livros"
            element={
              <PrivateRoute>
                <Livros />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/livros" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
