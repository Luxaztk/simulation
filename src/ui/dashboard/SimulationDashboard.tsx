import React, { useState, useEffect } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { Header } from '../components/Header';
import { ReactionInputBar } from '../components/ReactionInputBar';
import { SidebarControls } from '../components/SidebarControls';
import { ElectronTransferVisualizer } from '../components/ElectronTransferVisualizer';
import { PrecipitateTubeVisualizer } from '../components/PrecipitateTubeVisualizer';
import { RedoxRulesTable } from '../components/RedoxRulesTable';
import { OutputPanel } from '../components/OutputPanel';
import { balanceChemicalEquation, BalancedReactionResult } from '../../domain/balancer/equation-balancer';
import { predictReactionProducts } from '../../domain/predictor/reaction-predictor';
import { simulateGenericReaction, GenericSimulationState } from '../../simulation/engine/generic-engine';

export const SimulationDashboard: React.FC = () => {
  const [currentEquation, setCurrentEquation] = useState<string>(
    'Fe(OH)2 + O2 + H2O -> Fe(OH)3'
  );
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [balancedReaction, setBalancedReaction] = useState<BalancedReactionResult | null>(null);
  const [initialMoles, setInitialMoles] = useState<Record<string, number>>({});
  const [progressFraction, setProgressFraction] = useState<number>(1.0);
  const [simulationState, setSimulationState] = useState<GenericSimulationState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Khởi tạo mặc định lúc mount với phản ứng Fe(OH)2 + O2 + H2O -> Fe(OH)3
  useEffect(() => {
    handleEquationSubmit('Fe(OH)2 + O2 + H2O -> Fe(OH)3', false);
  }, []);

  const handleEquationSubmit = (equation: string, advanced: boolean) => {
    setErrorMessage(null);
    try {
      let reactionRes: BalancedReactionResult;

      if (advanced) {
        const pred = predictReactionProducts(equation);
        reactionRes = pred.balancedResult;
      } else {
        reactionRes = balanceChemicalEquation(equation);
      }

      setBalancedReaction(reactionRes);
      setCurrentEquation(equation);

      // Thiết lập số mol mặc định theo hệ số tỉ lượng
      const defaultMoles: Record<string, number> = {};
      reactionRes.reactants.forEach((r) => {
        defaultMoles[r.formula] = r.coefficient;
      });
      setInitialMoles(defaultMoles);
      setProgressFraction(1.0);

      // Chạy mô phỏng định lượng
      const simRes = simulateGenericReaction({
        balancedReaction: reactionRes,
        initialMoles: defaultMoles,
        progressFraction: 1.0,
      });
      setSimulationState(simRes);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    }
  };

  const handleMolesChange = (formula: string, moles: number) => {
    if (!balancedReaction) return;
    const updatedMoles = { ...initialMoles, [formula]: moles };
    setInitialMoles(updatedMoles);

    const simRes = simulateGenericReaction({
      balancedReaction,
      initialMoles: updatedMoles,
      progressFraction,
    });
    setSimulationState(simRes);
  };

  const handleProgressChange = (fraction: number) => {
    if (!balancedReaction) return;
    setProgressFraction(fraction);

    const simRes = simulateGenericReaction({
      balancedReaction,
      initialMoles,
      progressFraction: fraction,
    });
    setSimulationState(simRes);
  };

  const handleResetRatio = () => {
    if (!balancedReaction) return;
    const defaultMoles: Record<string, number> = {};
    balancedReaction.reactants.forEach((r) => {
      defaultMoles[r.formula] = r.coefficient;
    });
    setInitialMoles(defaultMoles);
    setProgressFraction(1.0);

    const simRes = simulateGenericReaction({
      balancedReaction,
      initialMoles: defaultMoles,
      progressFraction: 1.0,
    });
    setSimulationState(simRes);
  };

  return (
    <div className="site-wrapper">
      <SiteHeader />
      <div className="app-layout">
        {/* Sidebar: Điều khiển lượng chất tham gia động */}
        <SidebarControls
          reaction={balancedReaction}
          initialMoles={initialMoles}
          onMolesChange={handleMolesChange}
          progressFraction={progressFraction}
          onProgressChange={handleProgressChange}
          onResetRatio={handleResetRatio}
          limitingReactantFormula={simulationState?.limitingReactantFormula}
        />

        {/* Main Content Area */}
        <main className="main-content-area">
          <Header balancedEquation={balancedReaction?.balancedEquation} />

          {/* Thanh nhập phản ứng thông minh & Preset recommendations */}
          <section className="main-section-block">
            <ReactionInputBar
              currentEquation={currentEquation}
              isAdvancedMode={isAdvancedMode}
              onEquationSubmit={handleEquationSubmit}
              onToggleMode={setIsAdvancedMode}
              errorMessage={errorMessage}
            />
          </section>

          <div className="main-sections-stack">
            {/* 1. Core Visualizer: Dòng chuyển dịch electron (Visualizer) */}
            <section className="main-section-block">
              <ElectronTransferVisualizer state={simulationState} />
            </section>

            {/* 2. Thực nghiệm & Biến đổi trạng thái (Tube / Solution Visualizer) */}
            <section className="main-section-block">
              <PrecipitateTubeVisualizer state={simulationState} />
            </section>

            {/* 3. Bảng nhận biết & Mẹo ghi nhớ: "Khử cho - O nhận" */}
            <section className="main-section-block">
              <RedoxRulesTable reaction={balancedReaction} />
            </section>

            {/* 4. Dữ liệu định lượng & Kiểm chứng bảo toàn nguyên tố */}
            <section className="main-section-block">
              <OutputPanel state={simulationState} />
            </section>
          </div>

          <footer className="app-footer">
            <p>
              Mô phỏng giáo dục Hóa học 10 • Open Inorganic Redox Engine • Cân bằng đại số & Thăng bằng electron • Bảo toàn electron ∑n(e⁻ cho) = ∑n(e⁻ nhận)
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};
