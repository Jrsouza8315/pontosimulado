import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";

function AdminPanel() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");

  // Users Management
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  // Questions Management
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ["admin-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId) => {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-questions"]);
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Painel Administrativo
        </h2>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`${
                activeTab === "users"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Usuários
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`${
                activeTab === "questions"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Questões
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Gerenciar Usuários
            </h3>
            {usersLoading ? (
              <p>Carregando usuários...</p>
            ) : (
              <div className="space-y-4">
                {users?.map((user) => (
                  <div key={user.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          Criado em:{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateUserRoleMutation.mutate({
                            userId: user.id,
                            newRole: e.target.value,
                          })
                        }
                        className="input-field"
                      >
                        <option value="visitor">Visitante</option>
                        <option value="subscriber">Assinante</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === "questions" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Gerenciar Questões
              </h3>
              <button className="btn-primary">Adicionar Questão</button>
            </div>
            {questionsLoading ? (
              <p>Carregando questões...</p>
            ) : (
              <div className="space-y-4">
                {questions?.map((question) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-900 mb-2">{question.text}</p>
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <span>{question.exam_board}</span>
                          <span>{question.subject}</span>
                          <span>Dificuldade: {question.difficulty}</span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          deleteQuestionMutation.mutate(question.id)
                        }
                        className="text-red-600 hover:text-red-800"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
