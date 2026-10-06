import React from 'react';
import { Flame, Scale, Zap, ArrowRight } from 'lucide-react';
import { GenericSimulationState } from '../../simulation/engine/generic-engine';

export interface ElectronTransferVisualizerProps {
  state: GenericSimulationState | null;
}

export const ElectronTransferVisualizer: React.FC<ElectronTransferVisualizerProps> = ({ state }) => {
  if (!state) return null;

  const { balancedReaction, electronsTransferredMoles, consumedMoles } = state;
  const {
    isRedox,
    reactionType,
    reducingAgent,
    oxidizingAgent,
    mediumSpecies,
    oxidationHalfReaction,
    reductionHalfReaction,
  } = balancedReaction;

  if (!isRedox) {
    const isDecomp = reactionType === 'decomposition';
    return (
      <div className="electron-visualizer-card non-redox-card">
        <div className="visualizer-header">
          <div>
            <span className={`badge ${isDecomp ? 'badge-warning' : 'badge-neutral'}`}>
              {isDecomp ? (
                <>
                  <Flame size={13} className="badge-icon-svg" /> Phân Loại: Phản Ứng Nhiệt Phân
                </>
              ) : (
                <>
                  <Scale size={13} className="badge-icon-svg" /> Phân Loại Phản Ứng
                </>
              )}
            </span>
            <h2 className="visualizer-title">
              <span className="visualizer-type-icon">{isDecomp ? <Flame size={20} /> : <Scale size={20} />}</span>{' '}
              {isDecomp
                ? 'Phản Ứng Phân Hủy Nhiệt Không Phải Là Oxi Hóa – Khử'
                : 'Phản Ứng Không Phải Là Oxi Hóa – Khử'}
            </h2>
            <p className="visualizer-subtitle">
              {isDecomp
                ? 'Dưới tác dụng của nhiệt độ cao, hợp chất phân hủy thành các chất đơn giản hơn nhưng tất cả các nguyên tố đều giữ nguyên số oxi hóa (không có electron trao đổi).'
                : 'Tất cả các nguyên tố đều giữ nguyên số oxi hóa trước và sau phản ứng (ví dụ: phản ứng trao đổi ion, axit – bazơ).'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isSelfRedox = reactionType === 'self_redox';

  // Lượng chất khử và chất oxi hóa đã phản ứng
  const donorConsumed = reducingAgent ? consumedMoles[reducingAgent.formula] || 0 : 0;
  const acceptorConsumed = oxidizingAgent ? consumedMoles[oxidizingAgent.formula] || 0 : 0;

  return (
    <div className="electron-visualizer-card">
      <div className="visualizer-header">
        <div>
          <span className="badge badge-primary">
            {isSelfRedox ? (
              <>
                <Zap size={13} className="badge-icon-svg" /> Tự Oxi Hóa – Khử (Nội Phân Tử)
              </>
            ) : (
              'Trọng Tâm Bài 15 • Hóa Học 10'
            )}
          </span>
          <h2 className="visualizer-title">
            <span className="visualizer-icon"><Zap size={22} /></span>{' '}
            {isSelfRedox
              ? 'Bản Chất: Dòng Chuyển Dịch Electron Nội Phân Tử'
              : 'Bản Chất: Dòng Chuyển Dịch Electron Trong Phản Ứng'}
          </h2>
          <p className="visualizer-subtitle">
            {isSelfRedox
              ? `Trong phân tử ${reducingAgent?.formula}, các nguyên tố vừa đóng vai trò nhường electron, vừa đóng vai trò nhận electron!`
              : 'Phản ứng oxi hóa – khử là phản ứng trong đó có sự nhường và nhận electron giữa các chất phản ứng.'}
          </p>
        </div>

        <div className="electron-counter-box">
          <span className="counter-label">Số mol e⁻ đã trao đổi:</span>
          <span className="counter-val">
            {electronsTransferredMoles.toFixed(3)} mol e⁻
          </span>
          <span className="counter-sub">
            Bảo toàn: n(e⁻ cho) = n(e⁻ nhận)
          </span>
        </div>
      </div>

      {/* 3-Column Visual Flow: Donor -> Stream -> Acceptor */}
      <div className="electron-flow-grid">
        {/* LEFT COLUMN: ELECTRON DONOR (CHẤT KHỬ / BÊN CHO e) */}
        <div className="donor-card">
          <div className="card-role-badge badge-donor">
            {isSelfRedox ? 'PHẦN TỬ CHO e⁻ (Quá trình Oxi hóa)' : 'BÊN CHO ELECTRON (Chất khử)'}
          </div>
          <h3 className="substance-title">
            {reducingAgent ? reducingAgent.formula : 'Chất Khử'}
            {isSelfRedox && <span className="substance-tag-sub"> [Cho e⁻]</span>}
          </h3>
          <p className="substance-desc">
            {isSelfRedox
              ? `Nguyên tố ${oxidationHalfReaction?.element} trong ${reducingAgent?.formula} tăng số oxi hóa, nhường electron.`
              : `${reducingAgent?.formula} đóng vai trò là chất khử vì chứa nguyên tố ${oxidationHalfReaction?.element} nhường electron.`}
          </p>

          {/* Half-reaction box */}
          {oxidationHalfReaction && (
            <div className="half-reaction-box donor-reaction">
              <span className="reaction-label">{oxidationHalfReaction.roleNameVi}:</span>
              <div className="formula-row">
                <span className="atom-state state-before">
                  <span className="atom-symbol">{oxidationHalfReaction.element}</span>
                  <span className="atom-ox ox-plus">
                    {oxidationHalfReaction.fromState >= 0 ? `⁺${oxidationHalfReaction.fromState}` : `⁻${Math.abs(oxidationHalfReaction.fromState)}`}
                  </span>
                </span>
                <span className="reaction-arrow">⟶</span>
                <span className="atom-state state-after">
                  <span className="atom-symbol">{oxidationHalfReaction.element}</span>
                  <span className="atom-ox ox-plus">
                    {oxidationHalfReaction.toState >= 0 ? `⁺${oxidationHalfReaction.toState}` : `⁻${Math.abs(oxidationHalfReaction.toState)}`}
                  </span>
                </span>
                <span className="e-transfer-tag e-lost">
                  + {oxidationHalfReaction.electronsTransferred}e⁻
                </span>
              </div>
              <div className="reaction-rule-note">
                Số oxi hóa của {oxidationHalfReaction.element} <strong>TĂNG</strong> từ{' '}
                <span className="text-emerald">{oxidationHalfReaction.fromState}</span> lên{' '}
                <span className="text-danger">{oxidationHalfReaction.toState}</span>
              </div>
            </div>
          )}

          <div className="donor-stats">
            <div className="stat-line">
              <span>{reducingAgent?.formula} đã phản ứng:</span>
              <strong>{donorConsumed.toFixed(3)} mol</strong>
            </div>
            <div className="stat-line">
              <span>Tổng số e⁻ đã nhường:</span>
              <strong className="text-warning">
                {electronsTransferredMoles.toFixed(3)} mol e⁻
              </strong>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: ANIMATED ELECTRON STREAM */}
        <div className="transfer-stream-column">
          <div className="stream-badge">
            {isSelfRedox ? 'Dòng e⁻ nội phân tử' : 'Dòng electron (e⁻)'}
          </div>
          <div className="stream-animation-box">
            <div className="electron-particle p1">e⁻</div>
            <div className="electron-particle p2">e⁻</div>
            <div className="electron-particle p3">e⁻</div>
            <div className="electron-particle p4">e⁻</div>
            <div className="stream-arrow-line">
              <span className="stream-direction">
                NHƯỜNG e⁻ <ArrowRight size={13} className="stream-arrow-icon" />
              </span>
            </div>
          </div>
          <div className="conservation-pill">
            <span className="pill-icon"><Scale size={15} /></span>
            <span>Định luật bảo toàn e:</span>
            <strong>∑ n(e⁻ cho) = ∑ n(e⁻ nhận)</strong>
          </div>
        </div>

        {/* RIGHT COLUMN: ELECTRON ACCEPTOR (CHẤT OXI HÓA / BÊN NHẬN e) */}
        <div className="acceptor-card">
          <div className="card-role-badge badge-acceptor">
            {isSelfRedox ? 'PHẦN TỬ NHẬN e⁻ (Quá trình Khử)' : 'BÊN NHẬN ELECTRON (Chất oxi hóa)'}
          </div>
          <h3 className="substance-title">
            {oxidizingAgent ? oxidizingAgent.formula : 'Chất Oxi Hóa'}
            {isSelfRedox && <span className="substance-tag-sub"> [Nhận e⁻]</span>}
          </h3>
          <p className="substance-desc">
            {isSelfRedox
              ? `Nguyên tố ${reductionHalfReaction?.element} trong ${oxidizingAgent?.formula} giảm số oxi hóa, nhận electron.`
              : `${oxidizingAgent?.formula} đóng vai trò là chất oxi hóa vì chứa nguyên tố ${reductionHalfReaction?.element} nhận electron.`}
          </p>

          {/* Half-reaction box */}
          {reductionHalfReaction && (
            <div className="half-reaction-box acceptor-reaction">
              <span className="reaction-label">{reductionHalfReaction.roleNameVi}:</span>
              <div className="formula-row">
                <span className="atom-state state-before">
                  <span className="atom-symbol">{reductionHalfReaction.element}</span>
                  <span className="atom-ox ox-state">
                    {reductionHalfReaction.fromState >= 0 ? `⁺${reductionHalfReaction.fromState}` : `⁻${Math.abs(reductionHalfReaction.fromState)}`}
                  </span>
                </span>
                <span className="e-transfer-tag e-gained">
                  + {reductionHalfReaction.electronsTransferred}e⁻
                </span>
                <span className="reaction-arrow">⟶</span>
                <span className="atom-state state-after">
                  <span className="atom-symbol">{reductionHalfReaction.element}</span>
                  <span className="atom-ox ox-state">
                    {reductionHalfReaction.toState >= 0 ? `⁺${reductionHalfReaction.toState}` : `⁻${Math.abs(reductionHalfReaction.toState)}`}
                  </span>
                </span>
              </div>
              <div className="reaction-rule-note">
                Số oxi hóa của {reductionHalfReaction.element} <strong>GIẢM</strong> từ{' '}
                <span className="text-blue">{reductionHalfReaction.fromState}</span> xuống{' '}
                <span className="text-cyan">{reductionHalfReaction.toState}</span>
              </div>
            </div>
          )}

          <div className="acceptor-stats">
            <div className="stat-line">
              <span>{oxidizingAgent?.formula} đã phản ứng:</span>
              <strong>{acceptorConsumed.toFixed(3)} mol</strong>
            </div>
            <div className="stat-line">
              <span>Tổng số e⁻ đã nhận:</span>
              <strong className="text-cyan">
                {electronsTransferredMoles.toFixed(3)} mol e⁻
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Medium species banner nếu có */}
      {mediumSpecies.length > 0 && (
        <div className="medium-species-banner">
          <span className="medium-badge">Chất môi trường (Không đổi số oxi hóa):</span>
          {mediumSpecies.map((m) => (
            <span key={m.formula} className="medium-chip">
              {m.formula} (Hệ số: {m.coefficient})
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
