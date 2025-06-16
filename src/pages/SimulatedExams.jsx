import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../App";

function SimulatedExams() {
  const queryClient = useQueryClient();
  const [examConfig, setExamConfig] = useState({
    examBoard: "",
    subject: "",
    questionCount: 10,
    timeLimit: 60, // minutes
  });

  const { data: exams, isLoading } = useQuery({
    queryKey: ["simulated-exams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("simulated_exams")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createExamMutation = useMutation({
    mutationFn: async (config) => {
      // First, get questions based on filters
      let query = supabase.from("questions").select("*");

      if (config.examBoard) {
        query = query.eq("exam_board", config.examBoard);
      }
      if (config.subject) {
        query = query.eq("subject", config.subject);
      }

      const { data: questions, error: questionsError } = await query;
      if (questionsError) throw questionsError;

      // Randomly select questions
      const selectedQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, config.questionCount);

      // Create the exam
      const { data: exam, error: examError } = await supabase
        .from("simulated_exams")
        .insert({
          exam_board: config.examBoard,
          subject: config.subject,
          question_count: config.questionCount,
          time_limit: config.timeLimit,
          questions: selectedQuestions,
          status: "created",
        })
        .select()
        .single();

      if (examError) throw examError;
      return exam;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["simulated-exams"]);
    },
  });

  const handleConfigChange = (e) => {
    setExamConfig({
      ...examConfig,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateExam = (e) => {
    e.preventDefault();
    createExamMutation.mutate(examConfig);
  };

  return (
    <div className="space-y-6">
      {/* Create New Exam */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Criar Novo Simulado
        </h2>

        <form onSubmit={handleCreateExam} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              name="examBoard"
              value={examConfig.examBoard}
              onChange={handleConfigChange}
              className="input-field"
              required
            >
              <option value="">Selecione a Banca</option>
              <option value="CESPE">CESPE/CEBRASPE</option>
              <option value="FGV">FGV</option>
              <option value="QUADRIX">QUADRIX</option>
              <option value="IBFC">IBFC</option>
              <option value="IDECAN">IDECAN</option>
              <option value="FCC">FCC</option>
            </select>

            <select
              name="subject"
              value={examConfig.subject}
              onChange={handleConfigChange}
              className="input-field"
              required
            >
              <option value="">Selecione a Disciplina</option>
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

            <input
              type="number"
              name="questionCount"
              value={examConfig.questionCount}
              onChange={handleConfigChange}
              className="input-field"
              min="1"
              max="100"
              required
              placeholder="Número de Questões"
            />

            <input
              type="number"
              name="timeLimit"
              value={examConfig.timeLimit}
              onChange={handleConfigChange}
              className="input-field"
              min="1"
              required
              placeholder="Tempo Limite (minutos)"
            />
          </div>

          <button
            type="submit"
            disabled={createExamMutation.isLoading}
            className="btn-primary w-full"
          >
            {createExamMutation.isLoading ? "Criando..." : "Criar Simulado"}
          </button>
        </form>
      </div>

      {/* Exams List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Meus Simulados</h3>

        {isLoading ? (
          <p>Carregando simulados...</p>
        ) : exams?.length === 0 ? (
          <p>Você ainda não criou nenhum simulado.</p>
        ) : (
          <div className="space-y-4">
            {exams?.map((exam) => (
              <div key={exam.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {exam.exam_board} - {exam.subject}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {exam.question_count} questões • {exam.time_limit} minutos
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                    {exam.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SimulatedExams;
