import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  FileText,
  Sparkles,
  Zap,
  TestTube2,
  Droplets,
  Flame,
  XCircle,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { PRESET_REACTIONS, PresetReactionItem } from '../../domain/predictor/reaction-predictor';

export interface ReactionInputBarProps {
  currentEquation: string;
  isAdvancedMode: boolean;
  onEquationSubmit: (equation: string, isAdvanced: boolean) => void;
  onToggleMode: (isAdvanced: boolean) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const ReactionInputBar: React.FC<ReactionInputBarProps> = ({
  currentEquation,
  isAdvancedMode,
  onEquationSubmit,
  onToggleMode,
  isLoading = false,
  errorMessage = null,
}) => {
  const [inputVal, setInputVal] = useState<string>(currentEquation);
  const [presetFilter, setPresetFilter] = useState<'all' | 'acid' | 'thermal' | 'redox'>('all');

  useEffect(() => {
    setInputVal(currentEquation);
  }, [currentEquation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onEquationSubmit(inputVal.trim(), isAdvancedMode);
    }
  };

  const handleSelectPreset = (preset: PresetReactionItem) => {
    if (isAdvancedMode) {
      // Trong chế độ nâng cao, chỉ lấy vế trái
      const leftPart = preset.equation.split(/->|⟶|=/)[0].trim();
      setInputVal(leftPart);
      onEquationSubmit(leftPart, true);
    } else {
      setInputVal(preset.equation);
      onEquationSubmit(preset.equation, false);
    }
  };

  const handleSwitchMode = (advanced: boolean) => {
    onToggleMode(advanced);
    if (advanced) {
      // Cắt lấy vế trái
      const leftPart = inputVal.split(/->|⟶|=/)[0].trim();
      setInputVal(leftPart);
      onEquationSubmit(leftPart, true);
    } else {
      // Khôi phục dạng có mũi tên
      if (!inputVal.includes('->') && !inputVal.includes('⟶')) {
        // Tìm preset khớp hoặc thêm default
        const matched = PRESET_REACTIONS.find((p) => p.equation.startsWith(inputVal.trim()));
        const fullEq = matched ? matched.equation : `${inputVal.trim()} -> `;
        setInputVal(fullEq);
      }
    }
  };

  const handleApplyCondition = (cond: 'đặc' | 'loãng' | 't°' | 'clear') => {
    let s = inputVal;
    if (cond === 'clear') {
      s = s.replace(/\((đặc|dac|loãng|loang|t°|t°C|t0|to|conc|dil)\)/gi, '').trim();
    } else if (cond === 'đặc') {
      if (/\((loãng|loang|dil)\)/i.test(s)) {
        s = s.replace(/\((loãng|loang|dil)\)/gi, '(đặc)');
      } else if (!/\((đặc|dac|conc)\)/i.test(s)) {
        if (/HNO3/i.test(s) && !/HNO3\s*\(/i.test(s)) {
          s = s.replace(/HNO3/i, 'HNO3(đặc)');
        } else if (/H2SO4/i.test(s) && !/H2SO4\s*\(/i.test(s)) {
          s = s.replace(/H2SO4/i, 'H2SO4(đặc)');
        } else if (/HCl/i.test(s) && !/HCl\s*\(/i.test(s)) {
          s = s.replace(/HCl/i, 'HCl(đặc)');
        } else {
          s = `${s} (đặc)`.trim();
        }
      }
    } else if (cond === 'loãng') {
      if (/\((đặc|dac|conc)\)/i.test(s)) {
        s = s.replace(/\((đặc|dac|conc)\)/gi, '(loãng)');
      } else if (!/\((loãng|loang|dil)\)/i.test(s)) {
        if (/HNO3/i.test(s) && !/HNO3\s*\(/i.test(s)) {
          s = s.replace(/HNO3/i, 'HNO3(loãng)');
        } else if (/H2SO4/i.test(s) && !/H2SO4\s*\(/i.test(s)) {
          s = s.replace(/H2SO4/i, 'H2SO4(loãng)');
        } else {
          s = `${s} (loãng)`.trim();
        }
      }
    } else if (cond === 't°') {
      if (!/\((t°|t°C|t0|to)\)/i.test(s)) {
        s = `${s} (t°)`.trim();
      }
    }
    setInputVal(s);
    if (s.trim()) {
      onEquationSubmit(s.trim(), isAdvancedMode);
    }
  };

  const filteredPresets = presetFilter === 'all'
    ? PRESET_REACTIONS
    : PRESET_REACTIONS.filter((p) => p.group === presetFilter);

  const isConcActive = /\((đặc|dac|conc)\)/i.test(inputVal);
  const isDiluteActive = /\((loãng|loang|dil)\)/i.test(inputVal);
  const isHeatActive = /\((t°|t°C|t0|to)\)/i.test(inputVal);

  return (
    <div className="reaction-input-bar-card">
      <div className="bar-top-row">
        <div className="mode-toggle-group">
          <button
            type="button"
            className={`mode-btn ${!isAdvancedMode ? 'active' : ''}`}
            onClick={() => handleSwitchMode(false)}
          >
            <span className="mode-icon"><FileText size={15} /></span>
            <span>Chế độ Tiêu chuẩn (Nhập cả 2 vế: A + B → C + D)</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${isAdvancedMode ? 'active' : ''}`}
            onClick={() => handleSwitchMode(true)}
          >
            <span className="mode-icon"><Sparkles size={15} /></span>
            <span>Chế độ Nâng cao (Tự động suy luận sản phẩm từ chất vào)</span>
          </button>
        </div>

        <div className="engine-status-tag">
          <span className="dot-pulse"></span>
          <span>Open Inorganic Engine • Phản ứng nâng cao</span>
        </div>
      </div>

      <form className="reaction-input-form" onSubmit={handleSubmit}>
        <div className="input-group-wrapper">
          <div className="input-prefix-icon"><FlaskConical size={18} /></div>
          <input
            type="text"
            className="reaction-text-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isAdvancedMode
                ? 'Ví dụ: Cu + HNO3(đặc)  hoặc  Fe + H2SO4(loãng)  hoặc  KClO3(t°)  hoặc  Fe(OH)2 + O2 + H2O'
                : 'Ví dụ: Cu + HNO3(đặc) -> Cu(NO3)2 + NO2 + H2O  hoặc  KClO3(t°) -> KCl + O2'
            }
          />
          <button type="submit" className="submit-reaction-btn" disabled={isLoading}>
            {isLoading ? (
              'Đang phân tích...'
            ) : (
              <>
                <Zap size={16} /> Cân Bằng & Mô Phỏng
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Condition Selectors */}
      <div className="condition-quick-row">
        <span className="condition-label">Thêm nhanh điều kiện nâng cao:</span>
        <div className="condition-chips-group">
          <button
            type="button"
            className={`condition-pill ${isConcActive ? 'active-conc' : ''}`}
            onClick={() => handleApplyCondition('đặc')}
            title="Thêm hoặc đổi sang axit đặc (HNO₃ đặc tạo NO₂, H₂SO₄ đặc tạo SO₂)"
          >
            <TestTube2 size={13} /> Axit đặc (conc)
          </button>
          <button
            type="button"
            className={`condition-pill ${isDiluteActive ? 'active-dilute' : ''}`}
            onClick={() => handleApplyCondition('loãng')}
            title="Thêm hoặc đổi sang axit loãng (HNO₃ loãng tạo NO, H₂SO₄ loãng tạo H₂)"
          >
            <Droplets size={13} /> Axit loãng (dil)
          </button>
          <button
            type="button"
            className={`condition-pill ${isHeatActive ? 'active-heat' : ''}`}
            onClick={() => handleApplyCondition('t°')}
            title="Thêm điều kiện nhiệt độ cao / nhiệt phân (t°)"
          >
            <Flame size={13} /> Nhiệt phân (t°)
          </button>
          {(isConcActive || isDiluteActive || isHeatActive) && (
            <button
              type="button"
              className="condition-pill clear-pill"
              onClick={() => handleApplyCondition('clear')}
              title="Xóa bỏ điều kiện"
            >
              <XCircle size={13} /> Xóa điều kiện
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="input-error-banner">
          <span className="error-icon"><AlertTriangle size={16} /></span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Preset Recommendations with Category Tabs */}
      <div className="presets-bar">
        <div className="presets-header-row">
          <span className="presets-label">Phản ứng mẫu Hóa 10:</span>
          <div className="preset-tabs">
            <button
              type="button"
              className={`preset-tab-btn ${presetFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPresetFilter('all')}
            >
              <Layers size={13} /> Tất cả ({PRESET_REACTIONS.length})
            </button>
            <button
              type="button"
              className={`preset-tab-btn ${presetFilter === 'acid' ? 'active' : ''}`}
              onClick={() => setPresetFilter('acid')}
            >
              <TestTube2 size={13} /> Axit đặc / loãng ({PRESET_REACTIONS.filter((p) => p.group === 'acid').length})
            </button>
            <button
              type="button"
              className={`preset-tab-btn ${presetFilter === 'thermal' ? 'active' : ''}`}
              onClick={() => setPresetFilter('thermal')}
            >
              <Flame size={13} /> Nhiệt phân ({PRESET_REACTIONS.filter((p) => p.group === 'thermal').length})
            </button>
            <button
              type="button"
              className={`preset-tab-btn ${presetFilter === 'redox' ? 'active' : ''}`}
              onClick={() => setPresetFilter('redox')}
            >
              <Zap size={13} /> Oxi hóa - khử ({PRESET_REACTIONS.filter((p) => p.group === 'redox').length})
            </button>
          </div>
        </div>

        <div className="presets-scroll-list">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={`preset-chip preset-chip-${preset.group}`}
              onClick={() => handleSelectPreset(preset)}
              title={`${preset.nameVi} (${preset.category})`}
            >
              <span className="preset-name">{preset.equation}</span>
              <span className="preset-cat">{preset.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
