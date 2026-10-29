import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-2-3xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex gap-4 font-medium">
          <Link to="/livros" className="hover:text-blue-600">
            Livros
          </Link>
          <Link to="/emprestimos" className="hover:text-blue-600">
            Meus empréstimos
          </Link>
        </div>
        <button onClick={logout} className="text-sm text-red-600">
          Sair
        </button>
      </div>
    </nav>
  );
}
