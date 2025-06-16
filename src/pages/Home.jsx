import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Ponto Simulado
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Prepare-se para seus concursos públicos com questões simuladas e
            personalizadas.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {user ? (
              <div className="space-x-4">
                <Link to="/question-bank" className="btn btn-primary">
                  Banco de Questões
                </Link>
                <Link to="/simulated-exam" className="btn btn-secondary">
                  Criar Simulado
                </Link>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="btn btn-primary">
                  Entrar
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
