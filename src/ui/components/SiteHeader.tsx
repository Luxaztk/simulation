import React from 'react';
import { FlaskConical } from 'lucide-react';

export interface SiteHeaderProps {
  onOpenGuideModal?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = () => {
  return (
    <header className="global-site-header">
      <div className="site-header-left">
        <div className="site-logo-badge">
          <FlaskConical className="logo-icon-svg" size={22} />
        </div>
        <div className="site-brand-text">
          <div className="brand-title-row">
            <span className="brand-name">CHEMSIM 10</span>
            <span className="brand-divider">•</span>
            <span className="brand-engine">Open Inorganic Redox Engine</span>
          </div>
          <p className="brand-tagline">
            Mô phỏng giáo dục Hóa học 10 • Chương trình GDPT 2018 • Chương 4: Phản ứng Oxi hóa – Khử
          </p>
        </div>
      </div>

      <div className="site-header-center">
        <div className="pedagogy-motto-pill">
          <span className="motto-key">Khẩu quyết cốt lõi:</span>
          <span className="motto-val">&ldquo;Khử Cho &bull; O Nhận&rdquo;</span>
        </div>
      </div>

      <div className="site-header-right">
        <div className="engine-status-pill">
          <span className="status-indicator-dot"></span>
          <span className="status-text">Engine Sẵn Sàng (V2 Mở)</span>
        </div>
        <span className="curriculum-badge">Bộ GD&ĐT</span>
      </div>
    </header>
  );
};
