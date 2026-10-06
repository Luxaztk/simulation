import { describe, it, expect } from 'vitest';
import { predictReactionProducts } from './reaction-predictor';

describe('Inorganic Reaction Predictor (Advanced Mode)', () => {
  it('dự đoán chính xác sản phẩm của Fe(OH)2 + O2 + H2O', () => {
    const res = predictReactionProducts(['Fe(OH)2', 'O2', 'H2O']);
    expect(res.predictedProducts).toEqual(['Fe(OH)3']);
    expect(res.balancedResult.balancedEquation).toBe('4Fe(OH)2 + O2 + 2H2O ⟶ 4Fe(OH)3');
    expect(res.balancedResult.reducingAgent?.formula).toBe('Fe(OH)2');
    expect(res.balancedResult.oxidizingAgent?.formula).toBe('O2');
  });

  it('dự đoán chính xác sản phẩm của Cu + HNO3', () => {
    const res = predictReactionProducts(['Cu', 'HNO3']);
    expect(res.predictedProducts).toEqual(['Cu(NO3)2', 'NO', 'H2O']);
    expect(res.balancedResult.balancedEquation).toBe('3Cu + 8HNO3 ⟶ 3Cu(NO3)2 + 2NO + 4H2O');
  });

  it('dự đoán chính xác sản phẩm của KMnO4 + HCl', () => {
    const res = predictReactionProducts('KMnO4 + HCl');
    expect(res.predictedProducts).toEqual(['KCl', 'MnCl2', 'Cl2', 'H2O']);
    expect(res.balancedResult.balancedEquation).toBe('2KMnO4 + 16HCl ⟶ 2KCl + 2MnCl2 + 5Cl2 + 8H2O');
  });

  it('dự đoán chính xác sản phẩm của Zn + HCl', () => {
    const res = predictReactionProducts('Zn + HCl');
    expect(res.predictedProducts).toEqual(['ZnCl2', 'H2']);
    expect(res.balancedResult.balancedEquation).toBe('Zn + 2HCl ⟶ ZnCl2 + H2');
  });

  it('dự đoán chính xác sản phẩm của Fe + CuSO4', () => {
    const res = predictReactionProducts(['Fe', 'CuSO4']);
    expect(res.predictedProducts).toEqual(['FeSO4', 'Cu']);
    expect(res.balancedResult.balancedEquation).toBe('Fe + CuSO4 ⟶ FeSO4 + Cu');
  });

  it('dự đoán chính xác phản ứng khử oxit sắt Fe2O3 + CO', () => {
    const res = predictReactionProducts('Fe2O3 + CO');
    expect(res.predictedProducts).toEqual(['Fe', 'CO2']);
    expect(res.balancedResult.balancedEquation).toBe('Fe2O3 + 3CO ⟶ 2Fe + 3CO2');
  });

  // Test Thermal Decomposition
  it('dự đoán chính xác nhiệt phân KClO3(t°) -> KCl + O2', () => {
    const res = predictReactionProducts('KClO3');
    expect(res.predictedProducts).toEqual(['KCl', 'O2']);
    expect(res.balancedResult.balancedEquation).toBe('2KClO3 ⟶ 2KCl + 3O2');
    expect(res.balancedResult.reactionType).toBe('self_redox');
  });

  it('dự đoán chính xác nhiệt phân muối nitrate Cu(NO3)2 -> CuO + NO2 + O2', () => {
    const res = predictReactionProducts('Cu(NO3)2');
    expect(res.predictedProducts).toEqual(['CuO', 'NO2', 'O2']);
    expect(res.balancedResult.balancedEquation).toBe('2Cu(NO3)2 ⟶ 2CuO + 4NO2 + O2');
  });

  it('dự đoán chính xác nhiệt phân đá vôi CaCO3 -> CaO + CO2', () => {
    const res = predictReactionProducts('CaCO3');
    expect(res.predictedProducts).toEqual(['CaO', 'CO2']);
    expect(res.balancedResult.balancedEquation).toBe('CaCO3 ⟶ CaO + CO2');
    expect(res.balancedResult.isRedox).toBe(false);
  });

  // Test Acid Concentration Divergence
  it('dự đoán chính xác Cu + HNO3 đặc tạo khí NO2', () => {
    const res = predictReactionProducts('Cu + HNO3(đặc)');
    expect(res.predictedProducts).toEqual(['Cu(NO3)2', 'NO2', 'H2O']);
    expect(res.balancedResult.balancedEquation).toBe('Cu + 4HNO3 ⟶ Cu(NO3)2 + 2NO2 + 2H2O');
  });

  it('dự đoán chính xác Fe + H2SO4 đặc tạo Fe2(SO4)3 + SO2 + H2O', () => {
    const res = predictReactionProducts('Fe + H2SO4(đặc)');
    expect(res.predictedProducts).toEqual(['Fe2(SO4)3', 'SO2', 'H2O']);
    expect(res.balancedResult.balancedEquation).toBe('2Fe + 6H2SO4 ⟶ Fe2(SO4)3 + 3SO2 + 6H2O');
  });

  it('dự đoán chính xác Fe + H2SO4 loãng tạo FeSO4 + H2', () => {
    const res = predictReactionProducts('Fe + H2SO4(loãng)');
    expect(res.predictedProducts).toEqual(['FeSO4', 'H2']);
    expect(res.balancedResult.balancedEquation).toBe('Fe + H2SO4 ⟶ FeSO4 + H2');
  });

  it('dự đoán chính xác MnO2 + HCl(đặc) tạo Cl2', () => {
    const res = predictReactionProducts('MnO2 + HCl(đặc)');
    expect(res.predictedProducts).toEqual(['MnCl2', 'Cl2', 'H2O']);
    expect(res.balancedResult.balancedEquation).toBe('MnO2 + 4HCl ⟶ MnCl2 + Cl2 + 2H2O');
  });

  it('ném thông báo giáo dục khi Cu gặp H2SO4 loãng hoặc HCl', () => {
    expect(() => predictReactionProducts('Cu + H2SO4(loãng)')).toThrow(/Hydrogen/);
    expect(() => predictReactionProducts('Cu + HCl')).toThrow(/Hydrogen/);
  });

  it('ném ngoại lệ khi tổ hợp chất chưa có trong rule base', () => {
    expect(() => predictReactionProducts('Xe + Au')).toThrow();
  });
});
