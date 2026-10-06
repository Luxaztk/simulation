import React, { useState } from 'react';
import { Scale, Zap, RotateCcw } from 'lucide-react';
import { BalancedReactionResult, BalancedSpecies } from '../../domain/balancer/equation-balancer';
import { molesToGrams, gramsToMoles } from '../../domain/parser/formula-parser';

export interface SidebarControlsProps {
  reaction: BalancedReactionResult | null;
  initialMoles: Record<string, number>;
  onMolesChange: (formula: string, moles: number) => void;
  progressFraction: number;
  onProgressChange: (fraction: number) => void;
  onResetRatio: () => void;
  limitingReactantFormula?: string;
  isRunning?: boolean;
}

const GAS_FORMULAS = new Set(['O2', 'Cl2', 'CO', 'H2', 'NO', 'NO2', 'SO2', 'CO2', 'N2']);
const GAS_MOLAR_VOLUME = 24.79; // L/mol (25°C, 1 bar theo CT GDPT 2018)

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  reaction,
  initialMoles,
  onMolesChange,
  progressFraction,
  onProgressChange,
  onResetRatio,
  limitingReactantFormula,
  isRunning = false,
}) => {
  // Quản lý đơn vị hiển thị của từng chất: 'mol' | 'g' | 'L'
  const [unitModeMap, setUnitModeMap] = useState<Record<string, 'mol' | 'g' | 'L'>>({});

  if (!reaction) {
    return (
      <aside className="sidebar-controls">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Bảng Điều Khiển</h2>
        </div>
        <p className="sidebar-empty-note">Vui lòng nhập phương trình phản ứng để bắt đầu điều chỉnh số liệu.</p>
      </aside>
    );
  }

  const getUnit = (formula: string): 'mol' | 'g' | 'L' => {
    return unitModeMap[formula] || 'mol';
  };

  const setUnit = (formula: string, unit: 'mol' | 'g' | 'L') => {
    setUnitModeMap((prev) => ({ ...prev, [formula]: unit }));
  };

  const getDisplayValue = (species: BalancedSpecies): number => {
    const moles = initialMoles[species.formula] ?? species.coefficient;
    const unit = getUnit(species.formula);
    if (unit === 'g') {
      return molesToGrams(moles, species.parsed.molarMass);
    }
    if (unit === 'L') {
      return Number((moles * GAS_MOLAR_VOLUME).toFixed(3));
    }
    return Number(moles.toFixed(3));
  };

  const handleInputChange = (species: BalancedSpecies, rawVal: number) => {
    const unit = getUnit(species.formula);
    let moles = rawVal;
    if (unit === 'g') {
      moles = gramsToMoles(rawVal, species.parsed.molarMass);
    } else if (unit === 'L') {
      moles = rawVal / GAS_MOLAR_VOLUME;
    }
    moles = Math.max(0, Number(moles.toFixed(4)));
    onMolesChange(species.formula, moles);
  };

  return (
    <aside className="sidebar-controls">
      <div className="sidebar-header">
        <div className="header-icon-badge"><Scale size={18} /></div>
        <div>
          <h2 className="sidebar-title">Điều Chỉnh Lượng Chất</h2>
          <p className="sidebar-subtitle">Nhập số mol, gam hoặc thể tích chất tham gia</p>
        </div>
      </div>

      {/* Danh sách các chất tham gia */}
      <div className="sidebar-species-list">
        {reaction.reactants.map((reactant) => {
          const unit = getUnit(reactant.formula);
          const val = getDisplayValue(reactant);
          const moles = initialMoles[reactant.formula] ?? reactant.coefficient;
          const isLimiting = limitingReactantFormula === reactant.formula;
          const isGas = GAS_FORMULAS.has(reactant.formula);

          return (
            <div
              key={reactant.formula}
              className={`reactant-input-card ${isLimiting ? 'is-limiting' : ''}`}
            >
              <div className="card-top-row">
                <div className="formula-tag-group">
                  <span className="reactant-formula-title">{reactant.formula}</span>
                  <span className="coeff-badge">Hệ số: {reactant.coefficient}</span>
                  {reactant.role === 'reducing_agent' && (
                    <span className="role-tag tag-donor">Chất khử (Cho e)</span>
                  )}
                  {reactant.role === 'oxidizing_agent' && (
                    <span className="role-tag tag-acceptor">Chất oxi hóa (Nhận e)</span>
                  )}
                  {reactant.role === 'medium' && (
                    <span className="role-tag tag-medium">Môi trường</span>
                  )}
                </div>

                {isLimiting && (
                  <span className="limiting-pill" title="Chất này sẽ phản ứng hết trước và quyết định mức độ phản ứng">
                    <Zap size={11} className="inline mr-1" /> Hết trước
                  </span>
                )}
              </div>

              <div className="molar-mass-sub">
                M = {reactant.parsed.molarMass} g/mol
              </div>

              {/* Bộ chuyển đổi đơn vị */}
              <div className="unit-switch-row">
                <span className="unit-label">Đơn vị:</span>
                <div className="unit-pill-selector">
                  <button
                    type="button"
                    className={`unit-pill ${unit === 'mol' ? 'active' : ''}`}
                    onClick={() => setUnit(reactant.formula, 'mol')}
                  >
                    mol
                  </button>
                  <button
                    type="button"
                    className={`unit-pill ${unit === 'g' ? 'active' : ''}`}
                    onClick={() => setUnit(reactant.formula, 'g')}
                  >
                    gam (g)
                  </button>
                  {isGas && (
                    <button
                      type="button"
                      className={`unit-pill ${unit === 'L' ? 'active' : ''}`}
                      onClick={() => setUnit(reactant.formula, 'L')}
                    >
                      Lít (đktc)
                    </button>
                  )}
                </div>
              </div>

              {/* Ô nhập số & thanh trượt */}
              <div className="input-number-row">
                <button
                  type="button"
                  className="step-btn step-down"
                  onClick={() => handleInputChange(reactant, Math.max(0, val - (unit === 'mol' ? 0.5 : 5)))}
                  title="Giảm lượng chất"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  step={unit === 'mol' ? '0.1' : '1'}
                  className="species-number-field"
                  value={val}
                  onChange={(e) => handleInputChange(reactant, parseFloat(e.target.value) || 0)}
                />
                <button
                  type="button"
                  className="step-btn step-up"
                  onClick={() => handleInputChange(reactant, val + (unit === 'mol' ? 0.5 : 5))}
                  title="Tăng lượng chất"
                >
                  +
                </button>
                <span className="unit-suffix-text">{unit}</span>
              </div>

              <input
                type="range"
                min="0"
                max={unit === 'mol' ? '10' : unit === 'L' ? '250' : '500'}
                step={unit === 'mol' ? '0.1' : '1'}
                className="species-slider"
                value={val}
                onChange={(e) => handleInputChange(reactant, parseFloat(e.target.value) || 0)}
              />

              <div className="mol-equivalent-note">
                ≈ <strong>{moles.toFixed(3)} mol</strong> {reactant.formula}
              </div>
            </div>
          );
        })}
      </div>

      {/* Điều chỉnh mức độ tiến triển phản ứng */}
      <div className="reaction-progress-control-card">
        <div className="progress-header-row">
          <span className="control-label">Mức độ tiến triển phản ứng:</span>
          <span className="progress-value-badge">
            {(progressFraction * 100).toFixed(0)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          className="progress-slider"
          value={progressFraction}
          onChange={(e) => onProgressChange(parseFloat(e.target.value))}
        />
        <div className="progress-legend-row">
          <span>0% (Chưa phản ứng)</span>
          <span>100% (Phản ứng tối đa)</span>
        </div>
      </div>

      {/* Các nút hành động */}
      <div className="sidebar-action-buttons">
        <button
          type="button"
          className="btn-reset-ratio"
          onClick={onResetRatio}
          title="Thiết lập lại số mol ban đầu đúng chuẩn theo hệ số tỉ lượng của phương trình"
        >
          <RotateCcw size={14} className="inline mr-1.5" /> Đặt theo Tỉ Lượng Chuẩn
        </button>
      </div>
    </aside>
  );
};
