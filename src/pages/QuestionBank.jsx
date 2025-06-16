import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export default function QuestionBank() {
  const [filters, setFilters] = useState({
    exam_board: "",
    subject: "",
    difficulty: "",
    year: "",
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", filters],
    queryFn: async () => {
      let query = supabase.from("questions").select("*");

      if (filters.exam_board) {
        query = query.eq("exam_board", filters.exam_board);
      }
      if (filters.subject) {
        query = query.eq("subject", filters.subject);
      }
      if (filters.difficulty) {
        query = query.eq("difficulty", filters.difficulty);
      }
      if (filters.year) {
        query = query.eq("year", filters.year);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Banco de Questões
          </h1>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="label">Banca</label>
              <select
                className="input"
                value={filters.exam_board}
                onChange={(e) =>
                  setFilters({ ...filters, exam_board: e.target.value })
                }
              >
                <option value="">Todas</option>
                <option value="CESPE">CESPE</option>
                <option value="FGV">FGV</option>
                <option value="VUNESP">VUNESP</option>
              </select>
            </div>

            <div>
              <label className="label">Disciplina</label>
              <select
                className="input"
                value={filters.subject}
                onChange={(e) =>
                  setFilters({ ...filters, subject: e.target.value })
                }
              >
                <option value="">Todas</option>
                <option value="Direito Constitucional">
                  Direito Constitucional
                </option>
                <option value="Direito Administrativo">
                  Direito Administrativo
                </option>
                <option value="Direito Penal">Direito Penal</option>
              </select>
            </div>

            <div>
              <label className="label">Dificuldade</label>
              <select
                className="input"
                value={filters.difficulty}
                onChange={(e) =>
                  setFilters({ ...filters, difficulty: e.target.value })
                }
              >
                <option value="">Todas</option>
                <option value="Fácil">Fácil</option>
                <option value="Médio">Médio</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>

            <div>
              <label className="label">Ano</label>
              <select
                className="input"
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              >
                <option value="">Todos</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>

          {/* Lista de Questões */}
          <div className="space-y-6">
            {questions?.map((question) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {question.exam_board}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {question.subject}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{question.year}</span>
                </div>
                <p className="text-gray-900 mb-4">{question.text}</p>
                <div className="space-y-2">
                  {question.alternatives.map((alt, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-2 text-gray-600">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-gray-700">{alt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
