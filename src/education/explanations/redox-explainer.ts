import { SimulationState } from '../../simulation/state/simulation-state';

export interface RedoxEducationalReport {
  reducingAgentTitle: string;
  reducingAgentExplanationVi: string;
  oxidizingAgentTitle: string;
  oxidizingAgentExplanationVi: string;
  oxidationProcessesVi: string[];
  reductionProcessesVi: string[];
  pedagogicalSummaryVi: string;
}

export function generateRedoxExplanation(state: SimulationState): RedoxEducationalReport {
  const { species, status, conversionPercent, feOh2Consumed, feOh3Produced } = state;

  const oxidationProcesses: string[] = [
    `Quá trình oxi hóa Fe²⁺: Fe⁺² ⟶ Fe⁺³ + 1e⁻ (mỗi ion Fe²⁺ nhường 1 electron, số oxi hóa tăng từ +2 lên +3).`,
  ];

  const reductionProcesses: string[] = [
    `Quá trình khử O₂: O₂⁰ + 4e⁻ ⟶ 2O⁻² (mỗi phân tử O₂ nhận 4 electron, số oxi hóa giảm từ 0 xuống -2).`,
  ];

  let pedagogicalSummary = '';
  if (status === 'completed') {
    pedagogicalSummary = `Phản ứng oxi hóa kết tủa diễn ra hoàn toàn 100%! Toàn bộ ${feOh2Consumed.toFixed(2)} mol Fe(OH)₂ trắng xanh đã bị oxi hóa thành ${feOh3Produced.toFixed(2)} mol Fe(OH)₃ màu nâu đỏ.`;
  } else if (status === 'partial_insufficient_o2') {
    pedagogicalSummary = `Lượng oxygen không đủ để oxi hóa hết kết tủa (mới đạt ${conversionPercent.toFixed(1)}%). Hỗn hợp kết tủa có màu xanh rêu ngả nâu do Fe(OH)₃ nâu đỏ sinh ra pha lẫn với ${species.fe_oh2.toFixed(2)} mol Fe(OH)₂ trắng xanh còn dư.`;
  } else {
    pedagogicalSummary = `Chưa có phản ứng xảy ra do không có oxygen (khí trơ / môi trường kín). Kết tủa giữ nguyên màu trắng xanh của Fe(OH)₂.`;
  }

  return {
    reducingAgentTitle: 'Chất khử: Fe(OH)₂ (Sắt(II) hydroxide)',
    reducingAgentExplanationVi:
      'Fe(OH)₂ là chất khử (reducing agent) vì ion Fe²⁺ nhường 1 electron, số oxi hóa tăng từ +2 lên +3.',
    oxidizingAgentTitle: 'Chất oxi hóa: O₂ (Oxygen)',
    oxidizingAgentExplanationVi:
      'O₂ là chất oxi hóa (oxidizing agent) vì phân tử O₂ nhận 4 electron, số oxi hóa giảm từ 0 xuống -2.',
    oxidationProcessesVi: oxidationProcesses,
    reductionProcessesVi: reductionProcesses,
    pedagogicalSummaryVi: pedagogicalSummary,
  };
}
