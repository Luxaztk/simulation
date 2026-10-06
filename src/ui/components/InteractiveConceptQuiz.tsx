import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Check, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Trong phản ứng: 4Fe(OH)₂ + O₂ + 2H₂O ⟶ 4Fe(OH)₃, chất nào đóng vai trò là CHẤT KHỬ?',
    options: [
      'Fe(OH)₂ (Sắt(II) hydroxide)',
      'O₂ (Oxygen)',
      'H₂O (Nước)',
      'Fe(OH)₃ (Sắt(III) hydroxide)',
    ],
    correctIndex: 0,
    explanation:
      'Chính xác! Fe(OH)₂ là chất khử vì ion Fe²⁺ nhường 1 electron để tăng số oxi hóa từ +2 lên +3 trong Fe(OH)₃.',
  },
  {
    id: 2,
    question: 'Khi phản ứng xảy ra, nguyên tử Oxygen trong phân tử O₂ đã thực hiện hành vi gì?',
    options: [
      'Nhận 4 electron (Số oxi hóa giảm từ 0 xuống -2)',
      'Nhường 2 electron (Số oxi hóa tăng từ 0 lên +2)',
      'Không nhường cũng không nhận electron',
      'Nhường 4 electron',
    ],
    correctIndex: 0,
    explanation:
      'Đúng rồi! Mỗi phân tử O₂ nhận 4e⁻ để trở thành 2O⁻² (O₂⁰ + 4e⁻ ⟶ 2O⁻²), O₂ đóng vai trò là chất oxi hóa.',
  },
  {
    id: 3,
    question: 'Sự biến đổi ion Fe⁺² nhường electron chuyển thành Fe⁺³ được gọi là:',
    options: [
      'Quá trình oxi hóa (hay Sự oxi hóa Fe²⁺)',
      'Quá trình khử (hay Sự khử sắt)',
      'Quá trình phân hủy',
      'Quá trình trao đổi ion',
    ],
    correctIndex: 0,
    explanation:
      'Chính xác! Quá trình nhường electron của chất khử được gọi là quá trình oxi hóa (sự oxi hóa).',
  },
  {
    id: 4,
    question: 'Hiện tượng kết tủa chuyển dần từ TRẮNG XANH sang NÂU ĐỎ chứng minh điều gì?',
    options: [
      'Fe(OH)₂ (+2) đã bị oxi hóa thành Fe(OH)₃ (+3) màu nâu đỏ',
      'Fe(OH)₂ bị nhiệt phân thành FeO',
      'Nước bị bốc hơi làm kết tủa khô lại',
      'Khí O₂ bị hòa tan tạo kết tủa xanh',
    ],
    correctIndex: 0,
    explanation:
      'Rất chuẩn! Kết tủa trắng xanh Fe(OH)₂ khi tiếp xúc với oxygen trong không khí ẩm bị oxi hóa tạo thành Fe(OH)₃ có màu nâu đỏ đặc trưng của gỉ sắt.',
  },
];

export const InteractiveConceptQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const score = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="concept-quiz-card">
      <div className="quiz-header">
        <div>
          <span className="badge badge-success">Góc Luyện Tập Hóa 10</span>
          <h3 className="quiz-title">
            <span className="quiz-icon"><HelpCircle size={20} /></span> Trắc Nghiệm Tương Tác: Nhận Biết Chất Cho & Nhận Electron
          </h3>
          <p className="quiz-subtitle">
            Khắc sâu bản chất phản ứng oxi hóa – khử qua 4 câu hỏi trắc nghiệm trực quan
          </p>
        </div>

        {showResults && (
          <div className="quiz-score-badge">
            Kết quả: <strong>{score} / {QUIZ_QUESTIONS.length}</strong> câu đúng
          </div>
        )}
      </div>

      <div className="quiz-questions-list">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const selected = selectedAnswers[q.id];
          const isCorrect = selected === q.correctIndex;

          return (
            <div key={q.id} className="quiz-item">
              <div className="question-text">
                <span className="q-number">Câu {idx + 1}:</span> {q.question}
              </div>

              <div className="options-grid">
                {q.options.map((opt, optIdx) => {
                  let optClass = 'quiz-opt-btn';
                  if (selected === optIdx) {
                    optClass += ' selected';
                  }
                  if (showResults) {
                    if (optIdx === q.correctIndex) {
                      optClass += ' opt-correct';
                    } else if (selected === optIdx && !isCorrect) {
                      optClass += ' opt-wrong';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={optClass}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                    >
                      <span className="opt-letter">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div
                  className={`explanation-box ${
                    isCorrect ? 'exp-correct' : 'exp-wrong'
                  }`}
                >
                  <span className="exp-indicator">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={16} className="inline mr-1 text-emerald" /> Đúng rồi!
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="inline mr-1 text-danger" /> Chưa chính xác!
                      </>
                    )}
                  </span>
                  <p className="exp-text">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="quiz-actions-row">
        {!showResults ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowResults(true)}
            disabled={answeredCount === 0}
          >
            <Check size={16} className="inline mr-1.5" /> Kiểm Tra Kết Quả ({answeredCount}/{QUIZ_QUESTIONS.length})
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleResetQuiz}
          >
            <RotateCcw size={16} className="inline mr-1.5" /> Làm lại bài tập
          </button>
        )}
      </div>
    </div>
  );
};
