import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Página não encontrada
          </h2>
          <p className="mt-2 text-gray-600">
            A página que você está procurando não existe ou foi movida.
          </p>
          <div className="mt-6">
            <Link to="/" className="btn btn-primary">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
