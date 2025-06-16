import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";

function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: questions } = await supabase
        .from("questions")
        .select("count")
        .single();

      const { data: exams } = await supabase
        .from("simulated_exams")
        .select("count")
        .single();

      return {
        questions: questions?.count || 0,
        exams: exams?.count || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Ponto Simulado
        </h2>
        <p className="text-gray-600">
          Sua plataforma completa para estudos de concursos públicos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Estatísticas
          </h3>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-600">
                Questões disponíveis:{" "}
                <span className="font-semibold">{stats?.questions}</span>
              </p>
              <p className="text-gray-600">
                Simulados realizados:{" "}
                <span className="font-semibold">{stats?.exams}</span>
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          <div className="space-y-4">
            <Link
              to="/questions"
              className="block w-full text-center btn-primary"
            >
              Ver Questões
            </Link>
            <Link
              to="/simulated-exams"
              className="block w-full text-center btn-secondary"
            >
              Criar Simulado
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            <p className="text-gray-600">
              Último simulado:{" "}
              <span className="font-semibold">Não disponível</span>
            </p>
            <p className="text-gray-600">
              Questões respondidas: <span className="font-semibold">0</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
