import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";

function Questions() {
  const [filters, setFilters] = useState({
    examBoard: "",
    subject: "",
    difficulty: "",
    year: "",
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", filters],
    queryFn: async () => {
      let query = supabase.from("questions").select("*");

      if (filters.examBoard) {
        query = query.eq("exam_board", filters.examBoard);
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

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Banco de Questões
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <select
            name="examBoard"
            value={filters.examBoard}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Todas as Bancas</option>
            <option value="CESPE">CESPE/CEBRASPE</option>
            <option value="FGV">FGV</option>
            <option value="QUADRIX">QUADRIX</option>
            <option value="IBFC">IBFC</option>
            <option value="IDECAN">IDECAN</option>
            <option value="FCC">FCC</option>
          </select>

          <select
            name="subject"
            value={filters.subject}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Todas as Disciplinas</option>
            <option value="Direito_Administrativo">
              Direito Administrativo
            </option>
            <option value="Direito_Constitucional">
              Direito Constitucional
            </option>
            <option value="Direito_Penal">Direito Penal</option>
            <option value="Direito_Processual_Penal">
              Direito Processual Penal
            </option>
            <option value="Direito_Civil">Direito Civil</option>
            <option value="Direito_Processual_Civil">
              Direito Processual Civil
            </option>
          </select>

          <select
            name="difficulty"
            value={filters.difficulty}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Todas as Dificuldades</option>
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>

          <select
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="input-field"
          >
            <option value="">Todos os Anos</option>
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Questions List */}
        {isLoading ? (
          <p>Carregando questões...</p>
        ) : questions?.length === 0 ? (
          <p>Nenhuma questão encontrada com os filtros selecionados.</p>
        ) : (
          <div className="space-y-4">
            {questions?.map((question) => (
              <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">
                    {question.exam_board} - {question.year}
                  </span>
                  <span className="text-sm text-gray-500">
                    Dificuldade: {question.difficulty}
                  </span>
                </div>
                <p className="text-gray-900 mb-4">{question.text}</p>
                <div className="space-y-2">
                  {question.alternatives?.map((alt, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span>{alt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Questions;
