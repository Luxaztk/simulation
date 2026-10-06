import React from 'react';
import { TestTube2, Flame, ArrowUp, ChevronDown } from 'lucide-react';
import { GenericSimulationState } from '../../simulation/engine/generic-engine';

export interface PrecipitateTubeVisualizerProps {
  state: GenericSimulationState | null;
}

interface ReactionPhenomenon {
  title: string;
  subtitle: string;
  startColor: string;
  endColor: string;
  currentColor: string;
  currentPhenomenonText: string;
  gasBubbleText?: string;
  gasColor?: string;
  startLabel: string;
  endLabel: string;
  isHeating?: boolean;
}

export const PrecipitateTubeVisualizer: React.FC<PrecipitateTubeVisualizerProps> = ({ state }) => {
  if (!state) return null;

  const { balancedReaction, progressPercent, finalMoles } = state;
  const eq = balancedReaction.balancedEquation;
  const percent = progressPercent;
  const isThermal =
    balancedReaction.conditionLabel?.includes('t°') ||
    balancedReaction.reactionType === 'self_redox' ||
    balancedReaction.reactionType === 'decomposition' ||
    /t°|nhiệt|heat/i.test(balancedReaction.conditionLabel || '');

  // Xác định hiện tượng thực nghiệm dựa trên các chất trong phản ứng
  const getPhenomenon = (): ReactionPhenomenon => {
    // 1. Fe(OH)2 -> Fe(OH)3
    if (eq.includes('Fe(OH)2') && eq.includes('Fe(OH)3')) {
      const hex = percent >= 99 ? '#8B3A2B' : percent > 0 ? '#5a7a50' : '#6bb596';
      return {
        title: 'Quan Sát Biến Đổi Màu Sắc Kết Tủa Trong Ống Nghiệm',
        subtitle: 'Oxi hóa Fe²⁺ thành Fe³⁺ làm kết tủa chuyển dần từ trắng xanh sang nâu đỏ',
        startColor: '#6bb596',
        endColor: '#8B3A2B',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99
            ? '100% kết tủa nâu đỏ Fe(OH)₃'
            : percent > 0
            ? 'Hỗn hợp kết tủa xanh rêu ngả nâu'
            : '100% kết tủa trắng xanh Fe(OH)₂',
        gasBubbleText: 'Khí O₂ tiếp xúc bề mặt',
        startLabel: 'Trắng xanh [Fe(OH)₂]',
        endLabel: 'Nâu đỏ [Fe(OH)₃]',
      };
    }

    // 2. Cu + HNO3 đặc (Khí NO2 nâu đỏ)
    if (eq.includes('Cu') && eq.includes('NO2')) {
      const hex = percent >= 99 ? '#0284c7' : percent > 0 ? '#38bdf8' : '#b45309';
      return {
        title: 'Đồng Cu Tác Dụng Dung Dịch HNO₃ Đặc (Phản Ứng Mãnh Liệt)',
        subtitle: 'Đồng tan nhanh, dung dịch chuyển sang xanh lam Cu²⁺, bốc khói khí NO₂ màu nâu đỏ rất độc',
        startColor: '#b45309',
        endColor: '#0284c7',
        currentColor: hex,
        currentPhenomenonText:
          percent > 0 ? 'Dung dịch xanh lam đậm Cu(NO₃)₂ kèm sủi khí NO₂' : 'Mảnh kim loại Cu đỏ cam ban đầu',
        gasBubbleText: 'Khí NO₂ màu nâu đỏ bốc lên',
        gasColor: '#9a3412',
        startLabel: 'Cu kim loại',
        endLabel: 'Dung dịch Cu²⁺ xanh lam + NO₂ nâu đỏ',
      };
    }

    // 3. Cu + HNO3 loãng (Khí NO không màu)
    if (eq.includes('Cu') && eq.includes('NO') && !eq.includes('NO2')) {
      const hex = percent >= 99 ? '#0369a1' : percent > 0 ? '#38bdf8' : '#9e9e9e';
      return {
        title: 'Đồng Cu Tác Dụng Dung Dịch HNO₃ Loãng',
        subtitle: 'Đồng tan dần, dung dịch có màu xanh lam, giải phóng khí NO không màu hóa nâu ngoài không khí',
        startColor: '#cfd8dc',
        endColor: '#0369a1',
        currentColor: hex,
        currentPhenomenonText:
          percent > 0 ? 'Dung dịch màu xanh lam Cu(NO₃)₂ kèm bọt khí NO' : 'Kim loại Cu màu đỏ cam chưa tan',
        gasBubbleText: 'Khí NO không màu (hóa nâu)',
        startLabel: 'Cu chưa phản ứng',
        endLabel: 'Cu(NO₃)₂ xanh lam [Cu²⁺]',
      };
    }

    // 4. Fe + H2SO4 đặc nóng (Fe lên +3, khí SO2)
    if (eq.includes('Fe') && eq.includes('Fe2(SO4)3')) {
      const hex = percent >= 99 ? '#d97706' : percent > 0 ? '#f59e0b' : '#64748b';
      return {
        title: 'Sắt Fe Tác Dụng Với H₂SO₄ Đặc Nóng',
        subtitle: 'Sắt tan dần, bị oxi hóa lên mức cao nhất Fe³⁺ tạo dung dịch vàng nâu, sủi bọt khí SO₂ mùi hắc',
        startColor: '#64748b',
        endColor: '#d97706',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99 ? 'Dung dịch muối Fe³⁺ màu vàng nâu, bốc khí SO₂' : 'Sắt đang tan trong H₂SO₄ đặc nóng',
        gasBubbleText: 'Khí SO₂ mùi hắc thoát ra',
        gasColor: '#fcd34d',
        startLabel: 'Sắt kim loại xám trắng',
        endLabel: 'Fe³⁺ vàng nâu + SO₂',
        isHeating: true,
      };
    }

    // 5. Cu + H2SO4 đặc nóng (Khí SO2)
    if (eq.includes('Cu') && eq.includes('SO2')) {
      const hex = percent >= 99 ? '#0284c7' : percent > 0 ? '#38bdf8' : '#b45309';
      return {
        title: 'Đồng Cu Tác Dụng Với H₂SO₄ Đặc Nóng',
        subtitle: 'Cu tan trong axit đặc nóng tạo dung dịch màu xanh lam CuSO₄ và giải phóng khí mùi hắc SO₂',
        startColor: '#b45309',
        endColor: '#0284c7',
        currentColor: hex,
        currentPhenomenonText:
          percent > 0 ? 'Dung dịch xanh lam CuSO₄ kèm sủi bọt khí SO₂' : 'Mảnh Cu kim loại màu đỏ',
        gasBubbleText: 'Khí SO₂ mùi hắc thoát ra',
        startLabel: 'Cu đỏ chưa tan',
        endLabel: 'CuSO₄ xanh lam + SO₂',
        isHeating: true,
      };
    }

    // 6. Fe / Zn + axit loãng (Giải phóng khí H2)
    if (eq.includes('H2') && (eq.includes('Fe') || eq.includes('Zn') || eq.includes('Al'))) {
      const hex = percent >= 99 ? '#10b981' : percent > 0 ? '#34d399' : '#64748b';
      return {
        title: 'Kim Loại Tác Dụng Axit Loãng Giải Phóng Hydrogen H₂',
        subtitle: 'Kim loại tan dần, bề mặt sủi nhiều bọt khí Hydrogen H₂ không màu, phản ứng tỏa nhiệt nhẹ',
        startColor: '#64748b',
        endColor: '#10b981',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99 ? 'Kim loại tan hoàn toàn, bọt khí H₂ sủi mạnh' : 'Đang sủi bọt khí H₂ không màu',
        gasBubbleText: 'Khí Hydrogen H₂ sủi bọt',
        startLabel: 'Kim loại ban đầu',
        endLabel: 'Dung dịch muối + khí H₂',
      };
    }

    // 7. KMnO4 + HCl hoặc MnO2 + HCl (Điều chế khí Clo)
    if (eq.includes('Cl2')) {
      const hex = percent >= 99 ? '#bef264' : percent > 50 ? '#ce93d8' : '#7b1fa2';
      return {
        title: 'Điều Chế Khí Clo Cl₂ Vàng Lục Trong Phòng Thí Nghiệm',
        subtitle: 'Chất oxi hóa mạnh oxi hóa ion Cl⁻ thành khí Clo Cl₂ màu vàng lục, có mùi xốc đặc trưng',
        startColor: eq.includes('KMnO4') ? '#7b1fa2' : '#334155',
        endColor: '#bef264',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99 ? 'Khí Clo Cl₂ vàng lục thoát ra liên tục' : 'Dung dịch phản ứng, bắt đầu sủi khí Cl₂',
        gasBubbleText: 'Khí Clo Cl₂ vàng lục',
        gasColor: '#a3e635',
        startLabel: eq.includes('KMnO4') ? 'Tím đậm [KMnO₄]' : 'Bột đen [MnO₂]',
        endLabel: 'Khí Cl₂ vàng lục',
        isHeating: eq.includes('MnO2'),
      };
    }

    // 8. Nhiệt phân KClO3 điều chế O2
    if (eq.includes('KClO3')) {
      const hex = percent >= 99 ? '#f8fafc' : percent > 0 ? '#e2e8f0' : '#ffffff';
      return {
        title: 'Nhiệt Phân KClO₃ (Xúc Tác MnO₂, t°) Điều Chế Oxygen O₂',
        subtitle: 'Tinh thể trắng KClO₃ nóng chảy và phân hủy giải phóng khí O₂ (làm que đóm tàn đỏ bùng cháy)',
        startColor: '#ffffff',
        endColor: '#f8fafc',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99 ? 'KClO₃ phân hủy hoàn toàn thành KCl + O₂' : 'KClO₃ đang nóng chảy và phân hủy nhiệt',
        gasBubbleText: 'Khí O₂ làm bùng cháy tàn đóm',
        gasColor: '#38bdf8',
        startLabel: 'Chất rắn KClO₃',
        endLabel: 'Muối KCl + khí O₂',
        isHeating: true,
      };
    }

    // 9. Nhiệt phân thuốc tím KMnO4
    if (eq.includes('KMnO4') && eq.includes('K2MnO4')) {
      const hex = percent >= 99 ? '#1e293b' : percent > 0 ? '#4c1d95' : '#6b21a8';
      return {
        title: 'Nhiệt Phân Thuốc Tím KMnO₄ Ở Nhiệt Độ Cao',
        subtitle: 'Tinh thể tím đen KMnO₄ nổ lách tách, sinh hỗn hợp chất rắn màu đen (K₂MnO₄ + MnO₂) và khí O₂',
        startColor: '#6b21a8',
        endColor: '#1e293b',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99 ? 'Phân hủy thành hỗn hợp đen K₂MnO₄ + MnO₂' : 'Thuốc tím đang bị nung phân hủy',
        gasBubbleText: 'Khí O₂ giải phóng liên tục',
        gasColor: '#38bdf8',
        startLabel: 'Tinh thể tím KMnO₄',
        endLabel: 'Hỗn hợp rắn đen + O₂',
        isHeating: true,
      };
    }

    // 10. Nhiệt phân muối nitrate Cu(NO3)2 / AgNO3
    if ((eq.includes('Cu(NO3)2') || eq.includes('AgNO3')) && eq.includes('NO2')) {
      const hex = eq.includes('AgNO3')
        ? percent >= 99 ? '#94a3b8' : '#e2e8f0'
        : percent >= 99 ? '#0f172a' : '#0284c7';
      return {
        title: 'Nhiệt Phân Muối Nitrate Kim Loại',
        subtitle: 'Muối nitrate phân hủy ở nhiệt độ cao sinh ra oxide/kim loại, khí NO₂ màu nâu đỏ và khí O₂',
        startColor: eq.includes('AgNO3') ? '#e2e8f0' : '#0284c7',
        endColor: eq.includes('AgNO3') ? '#94a3b8' : '#0f172a',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99
            ? eq.includes('AgNO3')
              ? 'Tạo kim loại Ag bạc sáng bóng bám thành ống'
              : 'Tạo bột CuO màu đen'
            : 'Muối đang bị nung phân hủy',
        gasBubbleText: 'Hỗn hợp khí NO₂ (nâu đỏ) + O₂',
        gasColor: '#ea580c',
        startLabel: 'Muối nitrate ban đầu',
        endLabel: 'Sản phẩm rắn + NO₂ + O₂',
        isHeating: true,
      };
    }

    // 11. Nhiệt phân đá vôi CaCO3
    if (eq.includes('CaCO3') && eq.includes('CaO')) {
      const hex = percent >= 99 ? '#f1f5f9' : '#cbd5e1';
      return {
        title: 'Nung Vôi: Nhiệt Phân Đá Vôi CaCO₃ Ở 900°C - 1000°C',
        subtitle: 'Đá vôi CaCO₃ phân hủy thành vôi sống CaO xốp trắng và khí carbon dioxide CO₂',
        startColor: '#cbd5e1',
        endColor: '#f1f5f9',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99 ? 'Thu được vôi sống CaO xốp trắng' : 'Đá vôi CaCO₃ đang được nung nóng',
        gasBubbleText: 'Khí CO₂ làm đục nước vôi trong',
        gasColor: '#94a3b8',
        startLabel: 'Đá vôi CaCO₃',
        endLabel: 'Vôi sống CaO + CO₂',
        isHeating: true,
      };
    }

    // 12. Fe + CuSO4
    if (eq.includes('Fe') && eq.includes('CuSO4')) {
      const hex = percent >= 99 ? '#81c784' : percent > 0 ? '#4fc3f7' : '#0288d1';
      return {
        title: 'Kim Loại Sắt Tác Dụng Dung Dịch Muối Đồng CuSO₄',
        subtitle: 'Màu xanh lam của CuSO₄ nhạt dần chuyển sang xanh lục nhạt FeSO₄, đồng đỏ bám ngoài thanh sắt',
        startColor: '#0288d1',
        endColor: '#81c784',
        currentColor: hex,
        currentPhenomenonText:
          percent >= 99 ? 'Cu đỏ bám dày, dung dịch xanh nhạt Fe²⁺' : 'Đang chuyển dịch kim loại',
        startLabel: 'Xanh lam [CuSO₄]',
        endLabel: 'Xanh nhạt [FeSO₄]',
      };
    }

    // Mặc định cho mọi phản ứng khác
    return {
      title: 'Mô Phỏng Trạng Thái Phản Ứng Trong Bình Thí Nghiệm',
      subtitle: `Diễn tiến phản ứng tỉ lượng: ${eq}`,
      startColor: '#455a64',
      endColor: '#26a69a',
      currentColor: percent >= 99 ? '#26a69a' : percent > 0 ? '#37474f' : '#455a64',
      currentPhenomenonText: `Tiến độ chuyển hóa đạt ${percent.toFixed(1)}%`,
      gasBubbleText: isThermal ? 'Khí thoát ra khi nung nóng' : 'Phản ứng đang diễn ra',
      startLabel: 'Chất tham gia',
      endLabel: 'Sản phẩm hoàn toàn',
      isHeating: isThermal,
    };
  };

  const phen = getPhenomenon();
  const showFlame = isThermal || phen.isHeating;

  return (
    <div className="tube-visualizer-card">
      <div className="tube-header">
        <div>
          <span className="badge badge-success">Hiện tượng thực nghiệm trực quan</span>
          <h3 className="tube-title">
            <span className="tube-icon"><TestTube2 size={20} /></span> {phen.title}
          </h3>
          <p className="tube-subtitle">{phen.subtitle}</p>
        </div>

        <div className="precipitate-status-pill" style={{ borderColor: phen.currentColor }}>
          <span className="color-swatch" style={{ backgroundColor: phen.currentColor }}></span>
          <span className="color-name">
            Trạng thái: <strong>{phen.currentPhenomenonText}</strong>
          </span>
        </div>
      </div>

      <div className="tube-simulation-display">
        {/* Test Tube Graphic with Heating Flame */}
        <div className="test-tube-wrapper">
          {phen.gasBubbleText && (
            <div
              className="air-flow-indicator"
              style={phen.gasColor ? { color: phen.gasColor, borderColor: phen.gasColor } : {}}
            >
              <span className="air-tag">{phen.gasBubbleText}</span>
              <div className="air-arrows">
                <ArrowUp size={11} />
                <ArrowUp size={11} />
                <ArrowUp size={11} />
              </div>
            </div>
          )}

          <div className="test-tube">
            <div className="tube-lip"></div>
            <div className="tube-glass">
              {/* Air Bubbles layer */}
              <div className="bubble-layer">
                <span className="bubble b1"></span>
                <span className="bubble b2"></span>
                <span className="bubble b3"></span>
              </div>

              {/* Precipitate / Solution Liquid Fill */}
              <div
                className="precipitate-fill"
                style={{
                  backgroundColor: phen.currentColor,
                  boxShadow: `0 0 20px ${phen.currentColor}40`,
                }}
              >
                <div className="precipitate-particles"></div>
                <div className="fill-label">{phen.currentPhenomenonText}</div>
              </div>
            </div>
            <div className="tube-bottom-curve"></div>
          </div>

          {/* Burner Flame Graphic for Thermal Reactions */}
          {showFlame && (
            <div className="burner-flame-wrapper">
              <div className="flame-particles">
                <span className="flame-core"><Flame size={20} /></span>
                <span className="flame-heat-label">Nhiệt phân t°C</span>
              </div>
              <div className="burner-stand"></div>
            </div>
          )}
        </div>

        {/* Dynamic Transition Metrics */}
        <div className="tube-metrics-column">
          <div className="transition-progress-card">
            <div className="progress-label-row">
              <span className="trans-title">Tiến độ chuyển hóa phản ứng:</span>
              <span className="trans-percent">{percent.toFixed(1)}%</span>
            </div>
            <div className="color-spectrum-bar">
              <div
                className="spectrum-pointer"
                style={{ left: `${Math.min(98, Math.max(2, percent))}%` }}
              >
                <ChevronDown size={14} />
              </div>
            </div>
            <div className="spectrum-legend">
              <span className="legend-start">{phen.startLabel}</span>
              <span className="legend-end">{phen.endLabel}</span>
            </div>
          </div>

          <div className="observation-box">
            <h4 className="obs-title">Phương trình đã cân bằng:</h4>
            <p className="obs-content font-mono text-warning">
              {balancedReaction.balancedEquation}
              {balancedReaction.conditionLabel && (
                <span className="condition-pill-tag"> [{balancedReaction.conditionLabel}]</span>
              )}
            </p>
          </div>

          <div className="substance-amount-grid">
            {balancedReaction.reactants.map((r) => (
              <div key={r.formula} className="amount-item">
                <span className="amt-label">{r.formula} còn dư:</span>
                <span className="amt-val text-amber">
                  {(finalMoles[r.formula] || 0).toFixed(3)} mol
                </span>
              </div>
            ))}
            {balancedReaction.products.map((p) => (
              <div key={p.formula} className="amount-item">
                <span className="amt-label">{p.formula} tạo thành:</span>
                <span className="amt-val text-emerald">
                  {(finalMoles[p.formula] || 0).toFixed(3)} mol
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
