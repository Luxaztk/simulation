import { describe, it, expect } from 'vitest';
import { balanceChemicalEquation } from './equation-balancer';

describe('Chemical Equation Balancer', () => {
  it('cân bằng chính xác phản ứng Fe(OH)2 + O2 + H2O -> Fe(OH)3', () => {
    const result = balanceChemicalEquation('Fe(OH)2 + O2 + H2O -> Fe(OH)3');
    expect(result.balancedEquation).toBe('4Fe(OH)2 + O2 + 2H2O ⟶ 4Fe(OH)3');
    expect(result.isRedox).toBe(true);
    expect(result.reducingAgent?.formula).toBe('Fe(OH)2');
    expect(result.oxidizingAgent?.formula).toBe('O2');
    expect(result.electronsTransferred).toBe(4);
  });

  it('cân bằng chính xác phản ứng Cu + HNO3 -> Cu(NO3)2 + NO + H2O', () => {
    const result = balanceChemicalEquation('Cu + HNO3 -> Cu(NO3)2 + NO + H2O');
    expect(result.balancedEquation).toBe('3Cu + 8HNO3 ⟶ 3Cu(NO3)2 + 2NO + 4H2O');
    expect(result.isRedox).toBe(true);
    expect(result.reducingAgent?.formula).toBe('Cu');
    expect(result.oxidizingAgent?.formula).toBe('HNO3');
    expect(result.electronsTransferred).toBe(6); // 3 * 2e = 6e
  });

  it('cân bằng chính xác phản ứng thuốc thử KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O', () => {
    const result = balanceChemicalEquation('KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O');
    expect(result.balancedEquation).toBe('2KMnO4 + 16HCl ⟶ 2KCl + 2MnCl2 + 5Cl2 + 8H2O');
    expect(result.isRedox).toBe(true);
    expect(result.oxidizingAgent?.formula).toBe('KMnO4');
    expect(result.reducingAgent?.formula).toBe('HCl');
    expect(result.electronsTransferred).toBe(10); // 2 * 5e = 10e
  });

  it('cân bằng chính xác phản ứng kim loại tác dụng axit Al + H2SO4 -> Al2(SO4)3 + H2', () => {
    const result = balanceChemicalEquation('Al + H2SO4 -> Al2(SO4)3 + H2');
    expect(result.balancedEquation).toBe('2Al + 3H2SO4 ⟶ Al2(SO4)3 + 3H2');
    expect(result.isRedox).toBe(true);
    expect(result.reducingAgent?.formula).toBe('Al');
    expect(result.oxidizingAgent?.formula).toBe('H2SO4');
    expect(result.electronsTransferred).toBe(6);
  });

  it('cân bằng chính xác phản ứng thế Fe + CuSO4 -> FeSO4 + Cu', () => {
    const result = balanceChemicalEquation('Fe + CuSO4 -> FeSO4 + Cu');
    expect(result.balancedEquation).toBe('Fe + CuSO4 ⟶ FeSO4 + Cu');
    expect(result.isRedox).toBe(true);
    expect(result.reducingAgent?.formula).toBe('Fe');
    expect(result.oxidizingAgent?.formula).toBe('CuSO4');
    expect(result.electronsTransferred).toBe(2);
  });

  it('cân bằng chính xác phản ứng chuẩn độ FeSO4 + KMnO4 + H2SO4 -> Fe2(SO4)3 + MnSO4 + K2SO4 + H2O', () => {
    const result = balanceChemicalEquation(
      'FeSO4 + KMnO4 + H2SO4 -> Fe2(SO4)3 + MnSO4 + K2SO4 + H2O'
    );
    expect(result.balancedEquation).toBe(
      '10FeSO4 + 2KMnO4 + 8H2SO4 ⟶ 5Fe2(SO4)3 + 2MnSO4 + K2SO4 + 8H2O'
    );
    expect(result.isRedox).toBe(true);
    expect(result.reducingAgent?.formula).toBe('FeSO4');
    expect(result.oxidizingAgent?.formula).toBe('KMnO4');
    expect(result.electronsTransferred).toBe(10);
  });

  it('cân bằng chính xác phản ứng khử oxit sắt Fe2O3 + CO -> Fe + CO2', () => {
    const result = balanceChemicalEquation('Fe2O3 + CO -> Fe + CO2');
    expect(result.balancedEquation).toBe('Fe2O3 + 3CO ⟶ 2Fe + 3CO2');
    expect(result.isRedox).toBe(true);
    expect(result.reducingAgent?.formula).toBe('CO');
    expect(result.oxidizingAgent?.formula).toBe('Fe2O3');
    expect(result.electronsTransferred).toBe(6);
  });

  it('cân bằng chính xác phản ứng kim loại tác dụng axit Zn + HCl -> ZnCl2 + H2', () => {
    const result = balanceChemicalEquation('Zn + HCl -> ZnCl2 + H2');
    expect(result.balancedEquation).toBe('Zn + 2HCl ⟶ ZnCl2 + H2');
    expect(result.isRedox).toBe(true);
    expect(result.reducingAgent?.formula).toBe('Zn');
    expect(result.oxidizingAgent?.formula).toBe('HCl');
    expect(result.electronsTransferred).toBe(2);
  });

  it('cân bằng chính xác nhiệt phân KClO3(t°) -> KCl + O2 (Tự oxi hóa - khử / Nội phân tử)', () => {
    const result = balanceChemicalEquation('KClO3(t°) -> KCl + O2');
    expect(result.balancedEquation).toBe('2KClO3 ⟶ 2KCl + 3O2');
    expect(result.isRedox).toBe(true);
    expect(result.reactionType).toBe('self_redox');
    expect(result.conditionLabel).toBe('t°');
    expect(result.reactants[0].role).toBe('self_redox');
    expect(result.oxidationHalfReaction).not.toBeNull();
    expect(result.reductionHalfReaction).not.toBeNull();
  });

  it('cân bằng chính xác nhiệt phân Cu(NO3)2(t°) -> CuO + NO2 + O2', () => {
    const result = balanceChemicalEquation('Cu(NO3)2(t°) -> CuO + NO2 + O2');
    expect(result.balancedEquation).toBe('2Cu(NO3)2 ⟶ 2CuO + 4NO2 + O2');
    expect(result.isRedox).toBe(true);
    expect(result.reactionType).toBe('self_redox');
  });

  it('cân bằng chính xác nhiệt phân đá vôi CaCO3(t°) -> CaO + CO2 (Phản ứng phân hủy không oxi hóa - khử)', () => {
    const result = balanceChemicalEquation('CaCO3(t°) -> CaO + CO2');
    expect(result.balancedEquation).toBe('CaCO3 ⟶ CaO + CO2');
    expect(result.isRedox).toBe(false);
    expect(result.reactionType).toBe('decomposition');
    expect(result.conditionLabel).toBe('t°');
  });

  it('cân bằng chính xác Cu + HNO3(đặc) -> Cu(NO3)2 + NO2 + H2O', () => {
    const result = balanceChemicalEquation('Cu + HNO3(đặc) -> Cu(NO3)2 + NO2 + H2O');
    expect(result.balancedEquation).toBe('Cu + 4HNO3 ⟶ Cu(NO3)2 + 2NO2 + 2H2O');
    expect(result.isRedox).toBe(true);
    expect(result.conditionLabel).toBe('đặc');
    expect(result.reducingAgent?.formula).toBe('Cu');
    expect(result.oxidizingAgent?.formula).toBe('HNO3');
    expect(result.electronsTransferred).toBe(2);
  });

  it('cân bằng chính xác Fe + H2SO4(đặc) -> Fe2(SO4)3 + SO2 + H2O', () => {
    const result = balanceChemicalEquation('Fe + H2SO4(đặc) -> Fe2(SO4)3 + SO2 + H2O');
    expect(result.balancedEquation).toBe('2Fe + 6H2SO4 ⟶ Fe2(SO4)3 + 3SO2 + 6H2O');
    expect(result.isRedox).toBe(true);
    expect(result.conditionLabel).toBe('đặc');
  });

  it('ném ngoại lệ với phương trình bất khả thi (nguyên tố không bảo toàn)', () => {
    expect(() => balanceChemicalEquation('Cu + HCl -> AlCl3 + H2')).toThrow();
  });
});
