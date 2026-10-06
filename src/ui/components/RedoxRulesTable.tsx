import React from 'react';
import { BookOpen } from 'lucide-react';
import { BalancedReactionResult } from '../../domain/balancer/equation-balancer';

export interface RedoxRulesTableProps {
  reaction?: BalancedReactionResult | null;
}

export const RedoxRulesTable: React.FC<RedoxRulesTableProps> = ({ reaction }) => {
  const reducingAgent = reaction?.reducingAgent;
  const oxidizingAgent = reaction?.oxidizingAgent;
  const oxHalf = reaction?.oxidationHalfReaction;
  const redHalf = reaction?.reductionHalfReaction;

  return (
    <div className="redox-rules-card">
      <div className="rules-header">
        <h3 className="rules-title">
          <span className="rules-icon"><BookOpen size={20} /></span> Bảng Nhận Biết & Quy Tắc Cốt Lõi Phản Ứng Oxi Hóa – Khử (Hóa 10)
        </h3>
        <span className="badge badge-warning">Khử Cho • O Nhận</span>
      </div>

      <div className="table-responsive">
        <table className="redox-matrix-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Khái niệm (Hóa 10)</th>
              <th style={{ width: '39%' }} className="th-donor">
                Bên Cho Electron (Chất Khử)
              </th>
              <th style={{ width: '39%' }} className="th-acceptor">
                Bên Nhận Electron (Chất Oxi Hóa)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="row-label"><strong>Chất tham gia</strong></td>
              <td className="td-donor">
                <span className="highlight-pill pill-emerald">
                  {reducingAgent ? reducingAgent.formula : 'Chất Khử'}
                </span>
              </td>
              <td className="td-acceptor">
                <span className="highlight-pill pill-cyan">
                  {oxidizingAgent ? oxidizingAgent.formula : 'Chất Oxi Hóa'}
                </span>
              </td>
            </tr>
            <tr>
              <td className="row-label"><strong>Hành vi electron</strong></td>
              <td className="td-donor">
                <strong className="text-emerald">Cho (nhường) electron</strong>
                {oxHalf && (
                  <div className="sub-note">
                    Nguyên tố {oxHalf.element} nhường {oxHalf.electronsTransferred}e⁻
                  </div>
                )}
              </td>
              <td className="td-acceptor">
                <strong className="text-cyan">Nhận electron</strong>
                {redHalf && (
                  <div className="sub-note">
                    Nguyên tố {redHalf.element} nhận {redHalf.electronsTransferred}e⁻
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td className="row-label"><strong>Sự biến thiên số oxi hóa</strong></td>
              <td className="td-donor">
                {oxHalf ? (
                  <span className="ox-change-badge ox-up">
                    TĂNG: {oxHalf.fromState >= 0 ? `+${oxHalf.fromState}` : oxHalf.fromState} ⟶{' '}
                    {oxHalf.toState >= 0 ? `+${oxHalf.toState}` : oxHalf.toState}
                  </span>
                ) : (
                  <span className="ox-change-badge ox-up">TĂNG số oxi hóa</span>
                )}
              </td>
              <td className="td-acceptor">
                {redHalf ? (
                  <span className="ox-change-badge ox-down">
                    GIẢM: {redHalf.fromState >= 0 ? `+${redHalf.fromState}` : redHalf.fromState} ⟶{' '}
                    {redHalf.toState >= 0 ? `+${redHalf.toState}` : redHalf.toState}
                  </span>
                ) : (
                  <span className="ox-change-badge ox-down">GIẢM số oxi hóa</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="row-label"><strong>Tên gọi quá trình</strong></td>
              <td className="td-donor">
                <strong>Quá trình oxi hóa</strong> <em>(Sự oxi hóa)</em>
                {oxHalf && <div className="formula-code-mini">{oxHalf.equationText}</div>}
              </td>
              <td className="td-acceptor">
                <strong>Quá trình khử</strong> <em>(Sự khử)</em>
                {redHalf && <div className="formula-code-mini">{redHalf.equationText}</div>}
              </td>
            </tr>
            <tr>
              <td className="row-label"><strong>Bảo toàn electron</strong></td>
              <td className="td-donor" colSpan={2}>
                <div className="motto-box" style={{ marginTop: 0 }}>
                  <div className="motto-item">
                    <span className="motto-badge">∑ n(e⁻ cho) = ∑ n(e⁻ nhận)</span>
                    <span className="motto-text">
                      Tổng số electron do chất khử nhường bằng chính xác tổng số electron mà chất oxi hóa nhận
                      {reaction && reaction.electronsTransferred > 0 && (
                        <strong>: {reaction.electronsTransferred} electron trong một lượt tỉ lượng.</strong>
                      )}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="row-label"><strong>Mẹo ghi nhớ kinh điển</strong></td>
              <td className="td-donor" colSpan={2}>
                <div className="motto-box">
                  <div className="motto-item">
                    <span className="motto-badge">&ldquo;Khử cho - O nhận&rdquo;</span>
                    <span className="motto-text">
                      Chất <strong>Khử</strong> thì <strong>cho</strong> e; Chất <strong>O</strong>xi hóa thì <strong>nhận</strong> e.
                    </span>
                  </div>
                  <div className="motto-item">
                    <span className="motto-badge">&ldquo;Nghịch từ ngữ&rdquo;</span>
                    <span className="motto-text">
                      Chất khử thì <em>bị oxi hóa</em> (tham gia quá trình oxi hóa); Chất oxi hóa thì <em>bị khử</em> (tham gia quá trình khử).
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
