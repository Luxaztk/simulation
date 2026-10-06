import React from 'react';

export interface HeaderProps {
  balancedEquation?: string;
}

export const Header: React.FC<HeaderProps> = ({ balancedEquation }) => {
  return (
    <header className="app-header">
      <div className="header-badge-row">
        <span className="badge badge-primary">Hóa Học 10 • Chương 4</span>
        <span className="badge badge-neutral">Bài 15: Phản ứng oxi hóa – khử</span>
        <span className="badge badge-success">Open Inorganic Redox Engine</span>
      </div>
      <h1 className="header-title">
        {balancedEquation ? balancedEquation : 'Mô Phỏng Phản Ứng Oxi Hóa – Khử Vô Cơ'}
      </h1>
      <p className="header-subtitle">
        Khám phá bản chất phản ứng oxi hóa – khử thông qua dòng chuyển dịch electron, nhận biết rõ chất cho e (chất khử) và chất nhận e (chất oxi hóa), tự động cân bằng và dự đoán sản phẩm.
      </p>
    </header>
  );
};
