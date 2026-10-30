import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Livros from "./pages/Livros";
import Emprestimos from "./pages/Emprestimos";
import Cadastro from "./pages/Cadastro";

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
          <Route
            path="/emprestimos"
            element={
              <PrivateRoute>
                <Emprestimos />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/livros" replace />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
