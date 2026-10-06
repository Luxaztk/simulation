import React from 'react';
import { BarChart3, CheckCircle2, XCircle } from 'lucide-react';
import { GenericSimulationState } from '../../simulation/engine/generic-engine';

export interface OutputPanelProps {
  state: GenericSimulationState | null;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ state }) => {
  if (!state) return null;

  const {
    balancedReaction,
    initialMoles,
    finalMoles,
    consumedMoles,
    producedMoles,
    initialMassGrams,
    finalMassGrams,
    totalInitialMassGrams,
    totalFinalMassGrams,
    extentXi,
    limitingReactantFormula,
    electronsTransferredMoles,
    elementBalances,
    isMassConserved,
    progressPercent,
  } = state;

  const reactants = balancedReaction.reactants;
  const products = balancedReaction.products;
  const allSpecies = [...reactants, ...products];

  return (
    <div className="panel output-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <span className="panel-icon"><BarChart3 size={20} /></span> Dữ Liệu Định Lượng & Kiểm Chứng Bảo Toàn Vật Chất
        </h2>
        <span className={`badge ${isMassConserved ? 'badge-success' : 'badge-warning'}`}>
          {isMassConserved ? 'Bảo toàn tuyệt đối (Δ < 10⁻⁴)' : 'Sai lệch bảo toàn'}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-row">
        <div className="stat-card">
          <span className="stat-label">Tiến độ phản ứng:</span>
          <span className="stat-value stat-value-highlight">
            {progressPercent.toFixed(1)}%
          </span>
          <span className="stat-sub">
            Độ tiến triển ξ = {extentXi.toFixed(3)} mol
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Chất phản ứng hết trước:</span>
          <span className="stat-value text-amber">
            {limitingReactantFormula || 'N/A'}
          </span>
          <span className="stat-sub">Giới hạn mức độ phản ứng tối đa</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Số mol electron đã trao đổi:</span>
          <span className="stat-value text-cyan">
            {electronsTransferredMoles.toFixed(3)} mol e⁻
          </span>
          <span className="stat-sub">∑ n(e⁻ cho) = ∑ n(e⁻ nhận)</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Tổng khối lượng hệ:</span>
          <span className="stat-value">
            {totalFinalMassGrams.toFixed(2)} g
          </span>
          <span className="stat-sub">
            Ban đầu: {totalInitialMassGrams.toFixed(2)} g (Bảo toàn)
          </span>
        </div>
      </div>

      {/* Bảng định lượng các chất */}
      <div className="species-table-wrapper">
        <h3 className="section-sub-title">Số Liệu Cấu Tử Trước & Sau Phản Ứng</h3>
        <table className="species-table">
          <thead>
            <tr>
              <th>Cấu tử</th>
              <th>Vai trò</th>
              <th>Hệ số (ν)</th>
              <th>Khối lượng mol (M)</th>
              <th>Số mol ban đầu</th>
              <th>Biến thiên (Δn)</th>
              <th>Số mol sau cùng</th>
              <th>Khối lượng sau cùng</th>
            </tr>
          </thead>
          <tbody>
            {allSpecies.map((sp) => {
              const isR = sp.isReactant;
              const n0 = initialMoles[sp.formula] || 0;
              const delta = isR ? -(consumedMoles[sp.formula] || 0) : producedMoles[sp.formula] || 0;
              const nFinal = finalMoles[sp.formula] || 0;
              const mFinal = finalMassGrams[sp.formula] || 0;

              return (
                <tr key={sp.formula} className={isR ? 'row-reactant' : 'row-product'}>
                  <td>
                    <strong>{sp.formula}</strong>
                  </td>
                  <td>
                    {sp.role === 'reducing_agent' && (
                      <span className="role-tag tag-donor">Chất khử</span>
                    )}
                    {sp.role === 'oxidizing_agent' && (
                      <span className="role-tag tag-acceptor">Chất oxi hóa</span>
                    )}
                    {sp.role === 'self_redox' && (
                      <span className="role-tag tag-self-redox">Tự oxi hóa - khử</span>
                    )}
                    {sp.role === 'medium' && (
                      <span className="role-tag tag-medium">Môi trường</span>
                    )}
                    {sp.role === 'product' && (
                      <span className="role-tag tag-product">Sản phẩm</span>
                    )}
                  </td>
                  <td>
                    <span className="coeff-pill">{sp.coefficient}</span>
                  </td>
                  <td>{sp.parsed.molarMass} g/mol</td>
                  <td>{n0.toFixed(3)} mol</td>
                  <td className={delta < 0 ? 'text-amber' : 'text-emerald'}>
                    {delta < 0 ? delta.toFixed(3) : `+${delta.toFixed(3)}`} mol
                  </td>
                  <td>
                    <strong>{nFinal.toFixed(3)} mol</strong>
                  </td>
                  <td>
                    <strong>{mFinal.toFixed(2)} g</strong>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Element Balance Checklist */}
      <div className="mass-balance-checklist">
        <h3 className="section-sub-title">
          Kiểm Chứng Định Luật Bảo Toàn Nguyên Tố (Định luật Lomonosov – Lavoisier)
        </h3>
        <div className="balance-grid">
          {elementBalances.map((item) => (
            <div
              key={item.element}
              className={`balance-item ${item.isConserved ? 'balance-pass' : 'balance-fail'}`}
            >
              <div className="balance-item-header">
                <span className="element-badge">Nguyên tố: {item.element}</span>
                <span className="balance-status-icon">
                  {item.isConserved ? (
                    <>
                      <CheckCircle2 size={14} className="status-icon-svg text-emerald" /> Đạt
                    </>
                  ) : (
                    <>
                      <XCircle size={14} className="status-icon-svg text-danger" /> Lệch
                    </>
                  )}
                </span>
              </div>
              <div className="balance-detail-line">
                <span>Số mol trước: <strong>{item.initialMoles.toFixed(3)}</strong></span>
                <span>⟶</span>
                <span>Số mol sau: <strong>{item.finalMoles.toFixed(3)}</strong></span>
              </div>
              <div className="balance-delta-sub">
                Độ lệch sai số: Δ = {item.delta.toExponential(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
