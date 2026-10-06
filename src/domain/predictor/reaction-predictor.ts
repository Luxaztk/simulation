/**
 * Bộ suy luận và dự đoán sản phẩm phản ứng hóa học vô cơ (Inorganic Reaction Predictor)
 * Áp dụng hệ thống quy tắc (Rule Base) mở rộng của Hóa học vô cơ phổ thông (Lớp 10 & 11):
 * - Phản ứng nhiệt phân (Thermal Decomposition) & Tự oxi hóa - khử (Self-Redox)
 * - Axit có tính oxi hóa mạnh (HNO₃ đặc/loãng, H₂SO₄ đặc nóng)
 * - Phân hóa cơ chế Axit đặc vs Axit loãng (Concentration Divergence)
 * - Thuốc thử oxi hóa mạnh (KMnO₄, MnO₂ + HCl đặc)
 * - Axit thường (HCl, H₂SO₄ loãng) + Kim loại
 * - Kim loại đẩy kim loại trong dung dịch muối
 * - Halogen đẩy halogen
 * - Khử oxide kim loại bằng CO, H₂
 * - Đốt cháy đơn chất với Oxygen
 */

import { parseChemicalFormula } from '../parser/formula-parser';
import {
  balanceChemicalEquation,
  extractConditionAndFormula,
  BalancedReactionResult,
} from '../balancer/equation-balancer';

export interface ReactionPrediction {
  readonly reactants: readonly string[];
  readonly predictedProducts: readonly string[];
  readonly categoryNameVi: string;
  readonly balancedResult: BalancedReactionResult;
  readonly descriptionVi: string;
}

interface ReactionRuleMatchResult {
  readonly products: string[];
  readonly autoConditions?: string[];
}

interface ReactionRule {
  readonly id: string;
  readonly nameVi: string;
  readonly descriptionVi: string;
  readonly match: (
    reactantsSet: Set<string>,
    rawList: string[],
    conditionsSet: Set<string>
  ) => ReactionRuleMatchResult | null;
}

const PREDICTOR_RULES: ReactionRule[] = [
  // ==========================================
  // NHÓM 1: PHẢN ỨNG NHIỆT PHÂN (THERMAL DECOMPOSITION)
  // ==========================================

  // 1.1 Nhiệt phân KClO3 điều chế O2
  {
    id: 'decomp_kclo3',
    nameVi: 'Nhiệt phân KClO₃ (Xúc tác MnO₂, t°)',
    descriptionVi: 'Phản ứng oxi hóa - khử nội phân tử (tự oxi hóa - khử): Cl⁺⁵ nhận 6e⁻ thành Cl⁻¹, O⁻² nhường 2e⁻ thành O₂⁰.',
    match: (set) => {
      if (set.has('KClO3') && (set.size === 1 || (set.size === 2 && set.has('MnO2')))) {
        return { products: ['KCl', 'O2'], autoConditions: ['t°'] };
      }
      return null;
    },
  },

  // 1.2 Nhiệt phân thuốc tím KMnO4
  {
    id: 'decomp_kmno4',
    nameVi: 'Nhiệt phân KMnO₄ ở nhiệt độ cao điều chế O₂',
    descriptionVi: 'Phản ứng tự oxi hóa - khử nội phân tử: Mn⁺⁷ vừa bị khử xuống Mn⁺⁶ (K₂MnO₄) và Mn⁺⁴ (MnO₂), O⁻² bị oxi hóa thành O₂.',
    match: (set) => {
      if (set.has('KMnO4') && set.size === 1) {
        return { products: ['K2MnO4', 'MnO2', 'O2'], autoConditions: ['t°'] };
      }
      return null;
    },
  },

  // 1.3 Nhiệt phân muối nitrate kim loại trung bình (Cu, Fe, Zn...)
  {
    id: 'decomp_nitrate_mid',
    nameVi: 'Nhiệt phân muối nitrate kim loại từ Mg đến Cu',
    descriptionVi: 'Muối nitrate phân hủy tạo oxide kim loại, khí nitrogen dioxide NO₂ màu nâu đỏ và khí oxygen O₂.',
    match: (set) => {
      if (set.size === 1) {
        if (set.has('Cu(NO3)2')) {
          return { products: ['CuO', 'NO2', 'O2'], autoConditions: ['t°'] };
        }
        if (set.has('Fe(NO3)3')) {
          return { products: ['Fe2O3', 'NO2', 'O2'], autoConditions: ['t°'] };
        }
        if (set.has('Zn(NO3)2')) {
          return { products: ['ZnO', 'NO2', 'O2'], autoConditions: ['t°'] };
        }
        if (set.has('Mg(NO3)2')) {
          return { products: ['MgO', 'NO2', 'O2'], autoConditions: ['t°'] };
        }
        if (set.has('Pb(NO3)2')) {
          return { products: ['PbO', 'NO2', 'O2'], autoConditions: ['t°'] };
        }
      }
      return null;
    },
  },

  // 1.4 Nhiệt phân muối nitrate kim loại sau Cu (Ag, Hg...)
  {
    id: 'decomp_nitrate_precious',
    nameVi: 'Nhiệt phân muối nitrate kim loại kém hoạt động (Ag, Hg)',
    descriptionVi: 'Ion kim loại có tính oxi hóa rất mạnh nên bị khử hoàn toàn về kim loại tự do, giải phóng khí NO₂ và O₂.',
    match: (set) => {
      if (set.size === 1 && set.has('AgNO3')) {
        return { products: ['Ag', 'NO2', 'O2'], autoConditions: ['t°'] };
      }
      return null;
    },
  },

  // 1.5 Nhiệt phân muối nitrate kim loại kiềm (K, Na)
  {
    id: 'decomp_nitrate_alkali',
    nameVi: 'Nhiệt phân muối nitrate kim loại kiềm trước Mg (Na, K)',
    descriptionVi: 'Muối nitrate bị khử thành muối nitrite tương ứng và giải phóng khí O₂.',
    match: (set) => {
      if (set.size === 1) {
        if (set.has('KNO3')) {
          return { products: ['KNO2', 'O2'], autoConditions: ['t°'] };
        }
        if (set.has('NaNO3')) {
          return { products: ['NaNO2', 'O2'], autoConditions: ['t°'] };
        }
      }
      return null;
    },
  },

  // 1.6 Nhiệt phân muối amoni (NH4NO3, NH4NO2, NH4HCO3, NH4Cl)
  {
    id: 'decomp_ammonium_salts',
    nameVi: 'Nhiệt phân muối amoni',
    descriptionVi: 'Muối amoni phân hủy nhiệt sinh khí tương ứng; NH₄NO₃ và NH₄NO₂ là phản ứng oxi hóa - khử giữa N⁻³ và N⁺.',
    match: (set) => {
      if (set.size === 1) {
        if (set.has('NH4NO3')) {
          return { products: ['N2O', 'H2O'], autoConditions: ['t°'] };
        }
        if (set.has('NH4NO2')) {
          return { products: ['N2', 'H2O'], autoConditions: ['t°'] };
        }
        if (set.has('NH4HCO3')) {
          return { products: ['NH3', 'CO2', 'H2O'], autoConditions: ['t°'] };
        }
        if (set.has('NH4Cl')) {
          return { products: ['NH3', 'HCl'], autoConditions: ['t°'] };
        }
      }
      return null;
    },
  },

  // 1.7 Nhiệt phân hydroxide không tan
  {
    id: 'decomp_insoluble_hydroxide',
    nameVi: 'Nhiệt phân hydroxide kim loại không tan',
    descriptionVi: 'Nung kết tủa hydroxide không tan của kim loại ở nhiệt độ cao sinh ra oxide base và hơi nước.',
    match: (set) => {
      if (set.size === 1) {
        if (set.has('Fe(OH)3')) {
          return { products: ['Fe2O3', 'H2O'], autoConditions: ['t°'] };
        }
        if (set.has('Cu(OH)2')) {
          return { products: ['CuO', 'H2O'], autoConditions: ['t°'] };
        }
        if (set.has('Al(OH)3')) {
          return { products: ['Al2O3', 'H2O'], autoConditions: ['t°'] };
        }
        if (set.has('Mg(OH)2')) {
          return { products: ['MgO', 'H2O'], autoConditions: ['t°'] };
        }
      }
      return null;
    },
  },

  // 1.8 Nhiệt phân muối carbonate và hydrogen carbonate
  {
    id: 'decomp_carbonates',
    nameVi: 'Nhiệt phân muối carbonate / hydrocarbonate',
    descriptionVi: 'Nung đá vôi CaCO₃ sinh vôi sống CaO và CO₂; muối hydrogencarbonate bị phân hủy tạo muối trung hòa, CO₂ và H₂O.',
    match: (set) => {
      if (set.size === 1) {
        if (set.has('CaCO3')) {
          return { products: ['CaO', 'CO2'], autoConditions: ['t°'] };
        }
        if (set.has('MgCO3')) {
          return { products: ['MgO', 'CO2'], autoConditions: ['t°'] };
        }
        if (set.has('BaCO3')) {
          return { products: ['BaO', 'CO2'], autoConditions: ['t°'] };
        }
        if (set.has('NaHCO3')) {
          return { products: ['Na2CO3', 'CO2', 'H2O'], autoConditions: ['t°'] };
        }
        if (set.has('KHCO3')) {
          return { products: ['K2CO3', 'CO2', 'H2O'], autoConditions: ['t°'] };
        }
      }
      return null;
    },
  },

  // ==========================================
  // NHÓM 2: CƠ CHẾ NÂNG CAO - AXIT ĐẶC VS AXIT LOÃNG
  // ==========================================

  // 2.1 MnO2 + HCl đặc nóng (Điều chế khí Clo)
  {
    id: 'mno2_hcl_conc',
    nameVi: 'MnO₂ tác dụng với axit HCl đặc nóng',
    descriptionVi: 'Chất oxi hóa MnO₂ oxi hóa ion Cl⁻ trong axit HCl đặc ở nhiệt độ cao thành khí Clo Cl₂ vàng lục.',
    match: (set) => {
      if (set.has('MnO2') && set.has('HCl')) {
        return { products: ['MnCl2', 'Cl2', 'H2O'], autoConditions: ['đặc', 't°'] };
      }
      return null;
    },
  },

  // 2.2 Kim loại Cu tác dụng H2SO4 đặc vs loãng
  {
    id: 'cu_h2so4_divergence',
    nameVi: 'Cu tác dụng với H₂SO₄ đặc nóng vs loãng',
    descriptionVi: 'Cu đứng sau H nên không tác dụng H₂SO₄ loãng. Khi gặp H₂SO₄ đặc nóng, Cu bị oxi hóa thành CuSO₄ và sinh khí SO₂.',
    match: (set, _raw, conditions) => {
      if (set.has('Cu') && set.has('H2SO4')) {
        if (conditions.has('loãng')) {
          throw new Error(
            'Đồng (Cu) đứng sau Hydrogen trong dãy hoạt động hóa học nên KHÔNG tác dụng với H₂SO₄ loãng (hoặc HCl). ' +
            'Vui lòng chọn điều kiện [Axit đặc (conc)] để phản ứng sinh ra CuSO₄ + SO₂ + H₂O!'
          );
        }
        return { products: ['CuSO4', 'SO2', 'H2O'], autoConditions: ['đặc'] };
      }
      return null;
    },
  },

  // 2.3 Kim loại Fe tác dụng H2SO4 đặc vs loãng
  {
    id: 'fe_h2so4_divergence',
    nameVi: 'Fe tác dụng với H₂SO₄ đặc nóng vs loãng',
    descriptionVi: 'H₂SO₄ loãng chỉ oxi hóa Fe lên Fe²⁺ giải phóng H₂. H₂SO₄ đặc nóng oxi hóa Fe lên mức cao nhất Fe³⁺ và sinh khí mùi hắc SO₂.',
    match: (set, _raw, conditions) => {
      if (set.has('Fe') && set.has('H2SO4')) {
        if (conditions.has('đặc')) {
          return { products: ['Fe2(SO4)3', 'SO2', 'H2O'], autoConditions: ['đặc'] };
        }
        return { products: ['FeSO4', 'H2'], autoConditions: ['loãng'] };
      }
      return null;
    },
  },

  // 2.4 Kim loại Zn / Al tác dụng H2SO4 đặc vs loãng
  {
    id: 'metal_h2so4_divergence',
    nameVi: 'Kim loại (Zn, Al) tác dụng H₂SO₄ đặc vs loãng',
    descriptionVi: 'Axit đặc tạo khí SO₂, axit loãng giải phóng khí Hydrogen H₂.',
    match: (set, _raw, conditions) => {
      if (set.has('Zn') && set.has('H2SO4')) {
        if (conditions.has('đặc')) {
          return { products: ['ZnSO4', 'SO2', 'H2O'], autoConditions: ['đặc'] };
        }
        return { products: ['ZnSO4', 'H2'], autoConditions: ['loãng'] };
      }
      if (set.has('Al') && set.has('H2SO4')) {
        if (conditions.has('đặc')) {
          return { products: ['Al2(SO4)3', 'SO2', 'H2O'], autoConditions: ['đặc'] };
        }
        return { products: ['Al2(SO4)3', 'H2'], autoConditions: ['loãng'] };
      }
      return null;
    },
  },

  // 2.5 Kim loại Cu tác dụng HNO3 đặc vs loãng
  {
    id: 'cu_hno3_divergence',
    nameVi: 'Cu tác dụng với HNO₃ đặc (khí NO₂) vs loãng (khí NO)',
    descriptionVi: 'HNO₃ đặc tạo khí NO₂ màu nâu đỏ; HNO₃ loãng tạo khí NO không màu hóa nâu ngoài không khí.',
    match: (set, _raw, conditions) => {
      if (set.has('Cu') && set.has('HNO3')) {
        if (conditions.has('đặc')) {
          return { products: ['Cu(NO3)2', 'NO2', 'H2O'], autoConditions: ['đặc'] };
        }
        return { products: ['Cu(NO3)2', 'NO', 'H2O'], autoConditions: ['loãng'] };
      }
      return null;
    },
  },

  // 2.6 Kim loại Fe tác dụng HNO3 đặc vs loãng
  {
    id: 'fe_hno3_divergence',
    nameVi: 'Fe tác dụng với HNO₃ đặc nóng (khí NO₂) vs loãng (khí NO)',
    descriptionVi: 'HNO₃ đưa Fe lên mức oxi hóa cực đại Fe³⁺. Axit đặc sinh khí NO₂ màu nâu đỏ; axit loãng sinh khí NO không màu.',
    match: (set, _raw, conditions) => {
      if (set.has('Fe') && set.has('HNO3')) {
        if (conditions.has('đặc')) {
          return { products: ['Fe(NO3)3', 'NO2', 'H2O'], autoConditions: ['đặc'] };
        }
        return { products: ['Fe(NO3)3', 'NO', 'H2O'], autoConditions: ['loãng'] };
      }
      return null;
    },
  },

  // 2.7 Kim loại Zn / Ag tác dụng HNO3
  {
    id: 'zn_ag_hno3_divergence',
    nameVi: 'Kim loại (Zn, Ag) tác dụng HNO₃',
    descriptionVi: 'Oxi hóa kim loại lên muối nitrate cao nhất, giải phóng oxide của nitrogen.',
    match: (set, _raw, conditions) => {
      if (set.has('Zn') && set.has('HNO3')) {
        if (conditions.has('đặc')) {
          return { products: ['Zn(NO3)2', 'NO2', 'H2O'], autoConditions: ['đặc'] };
        }
        return { products: ['Zn(NO3)2', 'NO', 'H2O'], autoConditions: ['loãng'] };
      }
      if (set.has('Ag') && set.has('HNO3')) {
        return { products: ['AgNO3', 'NO2', 'H2O'] };
      }
      return null;
    },
  },

  // 2.8 Phi kim (C, S, P) tác dụng HNO3 đặc / H2SO4 đặc
  {
    id: 'nonmetal_conc_acid',
    nameVi: 'Phi kim (C, S, P) tác dụng với axit oxi hóa mạnh (đặc)',
    descriptionVi: 'Các phi kim bị axit đặc oxi hóa lên mức oxi hóa cao nhất (CO₂, H₂SO₄, H₃PO₄) và giải phóng khí NO₂ hoặc SO₂.',
    match: (set) => {
      if (set.has('C') && set.has('HNO3')) {
        return { products: ['CO2', 'NO2', 'H2O'], autoConditions: ['đặc'] };
      }
      if (set.has('C') && set.has('H2SO4')) {
        return { products: ['CO2', 'SO2', 'H2O'], autoConditions: ['đặc'] };
      }
      if (set.has('S') && set.has('HNO3')) {
        return { products: ['H2SO4', 'NO2', 'H2O'], autoConditions: ['đặc'] };
      }
      if (set.has('S') && set.has('H2SO4')) {
        return { products: ['SO2', 'H2O'], autoConditions: ['đặc'] };
      }
      if (set.has('P') && set.has('HNO3')) {
        return { products: ['H3PO4', 'NO2', 'H2O'], autoConditions: ['đặc'] };
      }
      return null;
    },
  },

  // ==========================================
  // NHÓM 3: PHẢN ỨNG OXI HÓA - KHỬ CƠ BẢN VÀ THUỐC THỬ
  // ==========================================

  // 3.1 Oxi hóa kết tủa Fe(OH)2 trong không khí ẩm
  {
    id: 'fe_oh2_oxidation',
    nameVi: 'Oxi hóa Fe(OH)₂ trong không khí ẩm',
    descriptionVi: 'Kết tủa trắng xanh Fe(OH)₂ bị oxygen và hơi ẩm trong không khí oxi hóa thành Fe(OH)₃ nâu đỏ.',
    match: (set) => {
      if (set.has('Fe(OH)2') && set.has('O2') && set.has('H2O')) {
        return { products: ['Fe(OH)3'] };
      }
      return null;
    },
  },

  // 3.2 Thuốc tím KMnO4 + HCl (Điều chế khí Clo trong PTN)
  {
    id: 'kmno4_hcl',
    nameVi: 'KMnO₄ tác dụng với HCl đặc',
    descriptionVi: 'KMnO₄ là chất oxi hóa rất mạnh, oxi hóa Cl⁻ trong HCl thành khí Clo Cl₂ vàng lục.',
    match: (set) => {
      if (set.has('KMnO4') && set.has('HCl')) {
        return { products: ['KCl', 'MnCl2', 'Cl2', 'H2O'], autoConditions: ['đặc'] };
      }
      return null;
    },
  },

  // 3.3 Chuẩn độ KMnO4 + FeSO4 + H2SO4
  {
    id: 'kmno4_feso4_h2so4',
    nameVi: 'Chuẩn độ FeSO₄ bằng dung dịch thuốc tím KMnO₄ trong môi trường axit H₂SO₄',
    descriptionVi: 'Fe²⁺ bị oxi hóa lên Fe³⁺, Mn⁺⁷ bị khử xuống Mn²⁺ không màu trong môi trường H₂SO₄.',
    match: (set) => {
      if (set.has('KMnO4') && set.has('FeSO4') && set.has('H2SO4')) {
        return { products: ['Fe2(SO4)3', 'MnSO4', 'K2SO4', 'H2O'] };
      }
      return null;
    },
  },

  // 3.4 Kim loại tác dụng HCl
  {
    id: 'metal_hcl',
    nameVi: 'Kim loại tác dụng với axit HCl',
    descriptionVi: 'Kim loại khử ion H⁺ trong axit thành khí Hydrogen H₂ thoát ra.',
    match: (set) => {
      if (set.has('Cu') && set.has('HCl')) {
        throw new Error(
          'Đồng (Cu) đứng sau Hydrogen trong dãy hoạt động hóa học nên KHÔNG tác dụng với dung dịch HCl!'
        );
      }
      if (set.has('Zn') && set.has('HCl')) {
        return { products: ['ZnCl2', 'H2'] };
      }
      if (set.has('Fe') && set.has('HCl')) {
        return { products: ['FeCl2', 'H2'] };
      }
      if (set.has('Al') && set.has('HCl')) {
        return { products: ['AlCl3', 'H2'] };
      }
      if (set.has('Mg') && set.has('HCl')) {
        return { products: ['MgCl2', 'H2'] };
      }
      return null;
    },
  },

  // 3.5 Kim loại mạnh đẩy kim loại yếu khỏi dung dịch muối
  {
    id: 'metal_displace_salt',
    nameVi: 'Kim loại mạnh đẩy kim loại yếu ra khỏi dung dịch muối',
    descriptionVi: 'Theo quy tắc alpha của dãy điện hóa: Kim loại có tính khử mạnh hơn khử ion kim loại có tính oxi hóa mạnh hơn.',
    match: (set) => {
      if (set.has('Fe') && set.has('CuSO4')) {
        return { products: ['FeSO4', 'Cu'] };
      }
      if (set.has('Zn') && set.has('CuSO4')) {
        return { products: ['ZnSO4', 'Cu'] };
      }
      if (set.has('Cu') && set.has('AgNO3')) {
        return { products: ['Cu(NO3)2', 'Ag'] };
      }
      if (set.has('Fe') && set.has('AgNO3')) {
        return { products: ['Fe(NO3)2', 'Ag'] };
      }
      return null;
    },
  },

  // 3.6 Halogen mạnh đẩy halogen yếu khỏi dung dịch muối
  {
    id: 'halogen_displacement',
    nameVi: 'Halogen mạnh đẩy halogen yếu ra khỏi dung dịch muối halide',
    descriptionVi: 'Tính oxi hóa giảm dần F₂ > Cl₂ > Br₂ > I₂. Halogen đứng trước oxi hóa ion halide của halogen đứng sau.',
    match: (set) => {
      if (set.has('Cl2') && set.has('NaBr')) {
        return { products: ['NaCl', 'Br2'] };
      }
      if (set.has('Cl2') && set.has('KBr')) {
        return { products: ['KCl', 'Br2'] };
      }
      if (set.has('Cl2') && set.has('KI')) {
        return { products: ['KCl', 'I2'] };
      }
      if (set.has('Br2') && set.has('KI')) {
        return { products: ['KBr', 'I2'] };
      }
      return null;
    },
  },

  // 3.7 Khử oxide kim loại bằng khí CO hoặc H2
  {
    id: 'oxide_gas_reduction',
    nameVi: 'Khử oxide kim loại bằng CO hoặc H₂ ở nhiệt độ cao',
    descriptionVi: 'Chất khử khí CO / H₂ chiếm oxygen của oxide kim loại tạo thành kim loại tự do và CO₂ / H₂O.',
    match: (set) => {
      if (set.has('Fe2O3') && set.has('CO')) {
        return { products: ['Fe', 'CO2'], autoConditions: ['t°'] };
      }
      if (set.has('Fe3O4') && set.has('CO')) {
        return { products: ['Fe', 'CO2'], autoConditions: ['t°'] };
      }
      if (set.has('FeO') && set.has('CO')) {
        return { products: ['Fe', 'CO2'], autoConditions: ['t°'] };
      }
      if (set.has('CuO') && set.has('CO')) {
        return { products: ['Cu', 'CO2'], autoConditions: ['t°'] };
      }
      if (set.has('CuO') && set.has('H2')) {
        return { products: ['Cu', 'H2O'], autoConditions: ['t°'] };
      }
      if (set.has('Fe2O3') && set.has('H2')) {
        return { products: ['Fe', 'H2O'], autoConditions: ['t°'] };
      }
      return null;
    },
  },

  // 3.8 Đốt cháy đơn chất với Oxygen
  {
    id: 'combustion_oxygen',
    nameVi: 'Phản ứng đốt cháy chất với Oxygen O₂',
    descriptionVi: 'Oxygen là chất oxi hóa mạnh, oxi hóa các đơn chất tạo thành oxide tương ứng.',
    match: (set) => {
      if (set.has('C') && set.has('O2')) {
        return { products: ['CO2'], autoConditions: ['t°'] };
      }
      if (set.has('S') && set.has('O2')) {
        return { products: ['SO2'], autoConditions: ['t°'] };
      }
      if (set.has('P') && set.has('O2')) {
        return { products: ['P2O5'], autoConditions: ['t°'] };
      }
      if (set.has('Mg') && set.has('O2')) {
        return { products: ['MgO'], autoConditions: ['t°'] };
      }
      if (set.has('Fe') && set.has('O2')) {
        return { products: ['Fe3O4'], autoConditions: ['t°'] };
      }
      if (set.has('H2') && set.has('O2')) {
        return { products: ['H2O'], autoConditions: ['t°'] };
      }
      return null;
    },
  },
];

/**
 * Dự đoán sản phẩm phản ứng từ danh sách các chất tham gia và điều kiện tùy chọn
 */
export function predictReactionProducts(
  reactants: string[] | string,
  explicitConditions?: string[]
): ReactionPrediction {
  const rawList: string[] = typeof reactants === 'string'
    ? reactants.split('+').map((s) => s.trim()).filter(Boolean)
    : reactants.map((s) => s.trim()).filter(Boolean);

  if (rawList.length === 0) {
    throw new Error('Cần cung cấp ít nhất một chất phản ứng đầu vào.');
  }

  // Tách điều kiện gắn trong tên công thức (như Cu + HNO3(đặc))
  const detectedConditions = new Set<string>(explicitConditions || []);
  const cleanedFormulas: string[] = [];

  for (const item of rawList) {
    const ext = extractConditionAndFormula(item);
    cleanedFormulas.push(ext.formula);
    ext.conditions.forEach((c) => detectedConditions.add(c));
  }

  // Chuẩn hóa tên công thức qua parser
  const normalizedReactants = cleanedFormulas.map((f) => parseChemicalFormula(f).formula);
  const reactantsSet = new Set<string>(normalizedReactants);

  // Quét qua các rule để tìm quy tắc thỏa mãn
  for (const rule of PREDICTOR_RULES) {
    const matchResult = rule.match(reactantsSet, normalizedReactants, detectedConditions);
    if (matchResult && matchResult.products.length > 0) {
      const finalConditions = new Set<string>(detectedConditions);
      if (matchResult.autoConditions) {
        matchResult.autoConditions.forEach((c) => finalConditions.add(c));
      }

      // Cân bằng phản ứng tự động để kiểm chứng tính đúng đắn và xác định vai trò
      const balancedResult = balanceChemicalEquation({
        reactants: normalizedReactants,
        products: matchResult.products,
        conditions: Array.from(finalConditions),
      });

      return {
        reactants: normalizedReactants,
        predictedProducts: matchResult.products,
        categoryNameVi: rule.nameVi,
        balancedResult,
        descriptionVi: rule.descriptionVi,
      };
    }
  }

  throw new Error(
    `Chưa có quy tắc dự đoán sản phẩm cho hệ chất tham gia: [${normalizedReactants.join(', ')}]. ` +
    `Bạn có thể chuyển sang chế độ 'Tiêu chuẩn (nhập cả chất đầu vào và chất đầu ra)' để cân bằng trực tiếp!`
  );
}

/**
 * Danh sách các phản ứng mẫu tiêu biểu cho Hóa 10 có thể chọn nhanh trong UI
 */
export interface PresetReactionItem {
  readonly id: string;
  readonly nameVi: string;
  readonly equation: string;
  readonly category: string;
  readonly group: 'redox' | 'acid' | 'thermal';
}

export const PRESET_REACTIONS: readonly PresetReactionItem[] = [
  // --- NHÓM 1: CƠ CHẾ NÂNG CAO - AXIT ĐẶC VS AXIT LOÃNG ---
  {
    id: 'cu_hno3_conc',
    nameVi: 'Cu + HNO₃ đặc tạo khí NO₂ nâu đỏ',
    equation: 'Cu + HNO3(đặc) -> Cu(NO3)2 + NO2 + H2O',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },
  {
    id: 'cu_hno3_dilute',
    nameVi: 'Cu + HNO₃ loãng tạo khí NO không màu',
    equation: 'Cu + HNO3(loãng) -> Cu(NO3)2 + NO + H2O',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },
  {
    id: 'fe_h2so4_conc',
    nameVi: 'Fe + H₂SO₄ đặc nóng oxi hóa lên Fe³⁺, khí SO₂',
    equation: 'Fe + H2SO4(đặc) -> Fe2(SO4)3 + SO2 + H2O',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },
  {
    id: 'fe_h2so4_dilute',
    nameVi: 'Fe + H₂SO₄ loãng chỉ lên Fe²⁺, khí H₂',
    equation: 'Fe + H2SO4(loãng) -> FeSO4 + H2',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },
  {
    id: 'cu_h2so4_conc',
    nameVi: 'Cu tan trong H₂SO₄ đặc nóng sinh khí SO₂',
    equation: 'Cu + H2SO4(đặc) -> CuSO4 + SO2 + H2O',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },
  {
    id: 'mno2_hcl_conc',
    nameVi: 'MnO₂ + HCl đặc đun nóng điều chế khí Clo Cl₂',
    equation: 'MnO2 + HCl(đặc) -> MnCl2 + Cl2 + H2O',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },
  {
    id: 'c_h2so4_conc',
    nameVi: 'Carbon C bị H₂SO₄ đặc oxi hóa sinh CO₂ + SO₂',
    equation: 'C + H2SO4(đặc) -> CO2 + SO2 + H2O',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },
  {
    id: 'c_hno3_conc',
    nameVi: 'Carbon C bị HNO₃ đặc oxi hóa sinh CO₂ + NO₂',
    equation: 'C + HNO3(đặc) -> CO2 + NO2 + H2O',
    category: 'Axit đặc vs Loãng',
    group: 'acid',
  },

  // --- NHÓM 2: PHẢN ỨNG NHIỆT PHÂN (THERMAL DECOMPOSITION) ---
  {
    id: 'kclo3_decomp',
    nameVi: 'Nhiệt phân KClO₃ điều chế Oxygen (Tự oxi hóa - khử)',
    equation: 'KClO3(t°) -> KCl + O2',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'kmno4_decomp',
    nameVi: 'Nhiệt phân thuốc tím KMnO₄ (Tự oxi hóa - khử)',
    equation: 'KMnO4(t°) -> K2MnO4 + MnO2 + O2',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'cu_no3_2_decomp',
    nameVi: 'Nhiệt phân muối nitrate Cu(NO₃)₂ sinh NO₂ và O₂',
    equation: 'Cu(NO3)2(t°) -> CuO + NO2 + O2',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'agno3_decomp',
    nameVi: 'Nhiệt phân AgNO₃ tạo kim loại Ag tự do',
    equation: 'AgNO3(t°) -> Ag + NO2 + O2',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'kno3_decomp',
    nameVi: 'Nhiệt phân muối nitrate kim loại kiềm KNO₃',
    equation: 'KNO3(t°) -> KNO2 + O2',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'nh4no3_decomp',
    nameVi: 'Nhiệt phân NH₄NO₃ sinh khí cười N₂O',
    equation: 'NH4NO3(t°) -> N2O + H2O',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'fe_oh3_decomp',
    nameVi: 'Nung kết tủa Fe(OH)₃ nâu đỏ tạo Fe₂O₃',
    equation: 'Fe(OH)3(t°) -> Fe2O3 + H2O',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'caco3_decomp',
    nameVi: 'Nung đá vôi CaCO₃ sinh vôi sống CaO và CO₂',
    equation: 'CaCO3(t°) -> CaO + CO2',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },
  {
    id: 'nahco3_decomp',
    nameVi: 'Nhiệt phân muối baking soda NaHCO₃',
    equation: 'NaHCO3(t°) -> Na2CO3 + CO2 + H2O',
    category: 'Nhiệt phân t°',
    group: 'thermal',
  },

  // --- NHÓM 3: OXI HÓA - KHỬ CƠ BẢN ---
  {
    id: 'fe_oh2_oxidation',
    nameVi: 'Oxi hóa Fe(OH)₂ trong không khí ẩm tạo Fe(OH)₃',
    equation: 'Fe(OH)2 + O2 + H2O -> Fe(OH)3',
    category: 'Kết tủa & Đổi màu',
    group: 'redox',
  },
  {
    id: 'kmno4_hcl',
    nameVi: 'Thuốc tím KMnO₄ tác dụng HCl điều chế khí Cl₂',
    equation: 'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O',
    category: 'Thuốc thử mạnh',
    group: 'redox',
  },
  {
    id: 'feso4_kmno4_h2so4',
    nameVi: 'Chuẩn độ muối sắt(II) bằng dung dịch KMnO₄ / H₂SO₄',
    equation: 'FeSO4 + KMnO4 + H2SO4 -> Fe2(SO4)3 + MnSO4 + K2SO4 + H2O',
    category: 'Chuẩn độ Redox',
    group: 'redox',
  },
  {
    id: 'zn_hcl',
    nameVi: 'Kim loại Zn tác dụng axit HCl giải phóng H₂',
    equation: 'Zn + HCl -> ZnCl2 + H2',
    category: 'Kim loại + Axit',
    group: 'redox',
  },
  {
    id: 'al_h2so4',
    nameVi: 'Kim loại Al tác dụng H₂SO₄ loãng giải phóng H₂',
    equation: 'Al + H2SO4 -> Al2(SO4)3 + H2',
    category: 'Kim loại + Axit',
    group: 'redox',
  },
  {
    id: 'fe_cuso4',
    nameVi: 'Sắt Fe đẩy Đồng Cu ra khỏi dung dịch CuSO₄',
    equation: 'Fe + CuSO4 -> FeSO4 + Cu',
    category: 'Kim loại đẩy kim loại',
    group: 'redox',
  },
  {
    id: 'fe2o3_co',
    nameVi: 'Khử oxide sắt Fe₂O₃ bằng CO trong lò luyện kim',
    equation: 'Fe2O3 + CO -> Fe + CO2',
    category: 'Luyện kim vô cơ',
    group: 'redox',
  },
  {
    id: 'cl2_nabr',
    nameVi: 'Khí Cl₂ oxi hóa muối NaBr giải phóng Br₂',
    equation: 'Cl2 + NaBr -> NaCl + Br2',
    category: 'Halogen',
    group: 'redox',
  },
];
