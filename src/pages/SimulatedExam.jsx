import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function SimulatedExam() {
  const queryClient = useQueryClient();
  const [examConfig, setExamConfig] = useState({
    exam_board: "",
    subject: "",
    question_count: 10,
    time_limit: 60,
  });

  const createExam = useMutation({
    mutationFn: async (config) => {
      const { data: questions } = await supabase
        .from("questions")
        .select("*")
        .eq("exam_board", config.exam_board)
        .eq("subject", config.subject)
        .limit(config.question_count);

      if (!questions || questions.length === 0) {
        throw new Error(
          "Não há questões disponíveis com os filtros selecionados"
        );
      }

      const { data: exam, error } = await supabase
        .from("simulated_exams")
        .insert({
          exam_board: config.exam_board,
          subject: config.subject,
          question_count: config.question_count,
          time_limit: config.time_limit,
          questions: questions,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return exam;
    },
    onSuccess: () => {
      toast.success("Simulado criado com sucesso!");
      queryClient.invalidateQueries(["simulated-exams"]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createExam.mutate(examConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Criar Novo Simulado
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Banca</label>
              <select
                className="input"
                value={examConfig.exam_board}
                onChange={(e) =>
                  setExamConfig({ ...examConfig, exam_board: e.target.value })
                }
                required
              >
                <option value="">Selecione uma banca</option>
                <option value="CESPE">CESPE</option>
                <option value="FGV">FGV</option>
                <option value="VUNESP">VUNESP</option>
              </select>
            </div>

            <div>
              <label className="label">Disciplina</label>
              <select
                className="input"
                value={examConfig.subject}
                onChange={(e) =>
                  setExamConfig({ ...examConfig, subject: e.target.value })
                }
                required
              >
                <option value="">Selecione uma disciplina</option>
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
              <label className="label">Número de Questões</label>
              <input
                type="number"
                className="input"
                min="1"
                max="100"
                value={examConfig.question_count}
                onChange={(e) =>
                  setExamConfig({
                    ...examConfig,
                    question_count: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <label className="label">Tempo Limite (minutos)</label>
              <input
                type="number"
                className="input"
                min="1"
                value={examConfig.time_limit}
                onChange={(e) =>
                  setExamConfig({
                    ...examConfig,
                    time_limit: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary"
              disabled={createExam.isLoading}
            >
              {createExam.isLoading ? "Criando..." : "Criar Simulado"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
