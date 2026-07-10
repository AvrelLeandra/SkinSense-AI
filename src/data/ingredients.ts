import { IngredientInfo } from '../types';

export const POPULAR_INGREDIENTS: IngredientInfo[] = [
  {
    name: "Retinol",
    mechanism: "Accelerates cellular turnover, stimulates collagen production, and enhances skin cell regeneration.",
    benefits: [
      "Reduces fine lines and wrinkles",
      "Improves skin texture and elasticity",
      "Fades hyperpigmentation",
      "Unclogs pores and treats mild acne"
    ],
    sideEffects: [
      "Mild irritation or peeling (purging)",
      "Dryness and skin flaking",
      "Increased sensitivity to UV light"
    ],
    frequency: "Nightly (start with 2-3 times per week, gradually increasing)",
    bestSkinTypes: ["Normal", "Oily", "Dry", "Combination"],
    compatibleWith: ["Hyaluronic Acid", "Ceramides", "Niacinamide", "Peptides"],
    avoidWith: ["Salicylic Acid (BHA)", "Glycolic Acid (AHA)", "Benzoyl Peroxide", "Vitamin C"],
    evidence: "Extensively studied and clinically proven as the gold standard for anti-aging and acne control over several decades of dermatological research.",
    myth: "Myth: Retinol thins the skin. Fact: It actually thickens the deeper layers of skin (dermis) by building collagen, although it thins the very outer layer of dead cells (stratum corneum)."
  },
  {
    name: "Vitamin C",
    mechanism: "A potent antioxidant that neutralizes free radicals, inhibits melanin synthesis, and assists in collagen stabilization.",
    benefits: [
      "Brightens skin tone and boosts radiance",
      "Fades dark spots and hyperpigmentation",
      "Protects against environmental pollution",
      "Boosts collagen synthesis"
    ],
    sideEffects: [
      "Slight tingling sensation upon application",
      "Redness or irritation in highly sensitive skin",
      "May oxidize on skin if not formulated correctly"
    ],
    frequency: "Morning (ideal for antioxidant protection alongside sunscreen)",
    bestSkinTypes: ["Normal", "Dry", "Oily", "Combination"],
    compatibleWith: ["Vitamin E", "Ferulic Acid", "Hyaluronic Acid", "Squalane"],
    avoidWith: ["Retinol", "Benzoyl Peroxide", "Niacinamide (sometimes can cause flushing in sensitive individuals)", "AHA/BHAs (can destabilize pH)"],
    evidence: "Strong clinical backing for photo-protection and hyperpigmentation reduction when formulated as L-Ascorbic Acid at a concentration of 10-20% and a low pH (< 3.5).",
    myth: "Myth: You shouldn't use Vitamin C during the day. Fact: Using it in the morning is highly recommended because its antioxidant properties boost your sunscreen's defense against UV rays."
  },
  {
    name: "Niacinamide (Vitamin B3)",
    mechanism: "Strengthens the skin's moisture barrier, reduces sebum production, inhibits melanosome transfer, and exhibits anti-inflammatory properties.",
    benefits: [
      "Refines appearance of enlarged pores",
      "Strengthens skin barrier function",
      "Reduces excess oil and sebum",
      "Calms redness and inflammation"
    ],
    sideEffects: [
      "Extremely well-tolerated; rare cases of warmth or flushing at high concentrations (10%+)."
    ],
    frequency: "Morning and/or Night",
    bestSkinTypes: ["Sensitive", "Normal", "Oily", "Dry", "Combination"],
    compatibleWith: ["Zinc", "Hyaluronic Acid", "Retinol", "Salicylic Acid", "Centella Asiatica"],
    avoidWith: ["Pure Vitamin C (if using highly sensitive skin, space them out to avoid temporary redness)"],
    evidence: "Backed by numerous randomized controlled trials demonstrating significant improvement in skin elasticity, hyperpigmentation, and barrier strength.",
    myth: "Myth: Higher percentage means better results. Fact: 2% to 5% is the clinically proven effective range. Going up to 10% or 20% increases risk of irritation without proportional benefits."
  },
  {
    name: "Salicylic Acid (BHA)",
    mechanism: "Oil-soluble beta-hydroxy acid that penetrates deep into hair follicles/pores to dissolve sebum, debris, and dead skin cells.",
    benefits: [
      "Deeply exfoliates pores and prevents blackheads",
      "Reduces active acne lesions",
      "Provides anti-inflammatory relief to red skin",
      "Regulates sebum production"
    ],
    sideEffects: [
      "Dryness",
      "Flaking or peeling",
      "Slight irritation if overused"
    ],
    frequency: "2-3 times per week, primarily at Night",
    bestSkinTypes: ["Oily", "Combination"],
    compatibleWith: ["Hyaluronic Acid", "Niacinamide", "Centella Asiatica"],
    avoidWith: ["Retinol", "Glycolic Acid (AHA)", "Benzoyl Peroxide", "Physical exfoliants"],
    evidence: "Clinically recognized by global dermatological guidelines as a primary over-the-counter active for acne prevention and pore regulation.",
    myth: "Myth: Salicylic Acid is only for oily teenager skin. Fact: It is excellent for adults too, helping with clogged pores, blackheads, and texturizing mature combination skin."
  },
  {
    name: "Hyaluronic Acid",
    mechanism: "A powerful humectant capable of holding up to 1,000 times its weight in water, drawing moisture from the air into the upper layers of skin.",
    benefits: [
      "Deeply hydrates and plumps skin immediately",
      "Reduces the visibility of fine lines",
      "Soothes and accelerates skin barrier recovery",
      "Improves skincare product absorption"
    ],
    sideEffects: [
      "None; native to skin and exceptionally safe. If used in extremely dry climates without an occlusive, it may draw moisture from deeper skin layers."
    ],
    frequency: "Morning and Night",
    bestSkinTypes: ["Dry", "Normal", "Oily", "Combination", "Sensitive"],
    compatibleWith: ["Almost everything! Perfect for layering under Retinol, Vitamin C, or Exfoliants."],
    avoidWith: ["None"],
    evidence: "Widely validated in dermatology for topical hydration, moisture barrier optimization, and supporting wound healing.",
    myth: "Myth: Hyaluronic Acid is a harsh exfoliating acid. Fact: Despite 'acid' in its name, it is not an exfoliant at all. It is a sugary hydration magnet that nourishes skin."
  },
  {
    name: "Centella Asiatica (Cica)",
    mechanism: "Contains active compounds like madecassoside and asiaticoside that stimulate collagen synthesis, speed up wound healing, and act as rich anti-inflammatory agents.",
    benefits: [
      "Drastically reduces redness and inflammation",
      "Accelerates healing of popped pimples or skin damage",
      "Repairs compromised skin barriers",
      "Intensely soothes skin sensitivity"
    ],
    sideEffects: [
      "Extremely rare allergic reactions to plant extract."
    ],
    frequency: "Morning and Night",
    bestSkinTypes: ["Sensitive", "Dry", "Combination", "Normal"],
    compatibleWith: ["Ceramides", "Hyaluronic Acid", "Niacinamide", "Retinol"],
    avoidWith: ["None"],
    evidence: "Clinically used for centuries in traditional Asian medicine; modern trials show rapid reduction in trans-epidermal water loss (TEWL) and dramatic speedup in tissue recovery.",
    myth: "Myth: Cica is only for wounded or compromised skin. Fact: It makes an excellent daily addition for anyone dealing with daily stressors like pollution, light rosacea, or dry air."
  }
];

export interface CompatibilityResult {
  compatible: boolean;
  status: 'Perfect Match' | 'Proceed with Caution' | 'High Risk Conflict';
  explanation: string;
  advice: string;
}

export function checkCompatibility(ing1: string, ing2: string): CompatibilityResult {
  const norm1 = ing1.toLowerCase();
  const norm2 = ing2.toLowerCase();

  const isRetinol = (s: string) => s.includes('retinol') || s.includes('retinoid');
  const isVitC = (s: string) => s.includes('vitamin c') || s.includes('ascorbic');
  const isNiacinamide = (s: string) => s.includes('niacinamide');
  const isBHA = (s: string) => s.includes('salicylic') || s.includes('bha');
  const isAHA = (s: string) => s.includes('glycolic') || s.includes('lactic') || s.includes('aha');
  const isHA = (s: string) => s.includes('hyaluronic') || s.includes('ha');
  const isCeramides = (s: string) => s.includes('ceramide');
  const isBP = (s: string) => s.includes('benzoyl') || s.includes('peroxide');

  // Retinol + Acid
  if ((isRetinol(norm1) && (isBHA(norm2) || isAHA(norm2))) || (isRetinol(norm2) && (isBHA(norm1) || isAHA(norm1)))) {
    return {
      compatible: false,
      status: 'High Risk Conflict',
      explanation: "Retinol and exfoliating acids (AHAs/BHAs) both increase cell turnover. Mixing them together in the same routine can severely compromise your skin's moisture barrier, leading to extreme peeling, redness, burning, and sensitivity.",
      advice: "Use your AHA/BHA exfoliator on alternate nights, or use your acid in the morning and Retinol at night."
    };
  }

  // Retinol + Vit C
  if ((isRetinol(norm1) && isVitC(norm2)) || (isRetinol(norm2) && isVitC(norm1))) {
    return {
      compatible: false,
      status: 'Proceed with Caution',
      explanation: "Vitamin C works best in an acidic environment (low pH), whereas Retinol requires a higher pH to be active. Applying them directly together can make both products less effective and cause irritation.",
      advice: "Apply Vitamin C in the morning for antioxidant protection and use Retinol at night for cellular repair."
    };
  }

  // Retinol + Benzoyl Peroxide
  if ((isRetinol(norm1) && isBP(norm2)) || (isRetinol(norm2) && isBP(norm1))) {
    return {
      compatible: false,
      status: 'High Risk Conflict',
      explanation: "Benzoyl Peroxide oxidizes Retinol, rendering both compounds inactive when layered directly. It also causes intense drying and skin barrier disruption.",
      advice: "Use Benzoyl Peroxide as a spot treatment in the morning or on alternate nights when you are not using Retinol."
    };
  }

  // AHA + BHA
  if ((isAHA(norm1) && isBHA(norm2)) || (isAHA(norm2) && isBHA(norm1))) {
    return {
      compatible: true,
      status: 'Proceed with Caution',
      explanation: "AHAs (surface exfoliation) and BHAs (pore exfoliation) can be used together to address texture and clogged pores simultaneously, but over-exfoliation is highly likely.",
      advice: "Look for pre-formulated AHA/BHA blends which are balanced, or limit separate use to once or twice a week max."
    };
  }

  // Vit C + Niacinamide
  if ((isVitC(norm1) && isNiacinamide(norm2)) || (isVitC(norm2) && isNiacinamide(norm1))) {
    return {
      compatible: true,
      status: 'Perfect Match',
      explanation: "Historically, there was a myth that Niacinamide and L-Ascorbic Acid turn into niacin and flush the skin. Modern science has debunked this for stabilized formulations. Together, they create a powerhouse combo to tackle hyperpigmentation and uneven tone.",
      advice: "Apply Vitamin C first, let it absorb for 2-3 minutes, then apply your Niacinamide. If you have highly sensitive skin and experience temporary flushing, use Vit C in the morning and Niacinamide at night."
    };
  }

  // Retinol + HA / Ceramides
  if ((isRetinol(norm1) && (isHA(norm2) || isCeramides(norm2))) || (isRetinol(norm2) && (isHA(norm1) || isCeramides(norm1)))) {
    return {
      compatible: true,
      status: 'Perfect Match',
      explanation: "Hyaluronic Acid and Ceramides intensely hydrate and repair the skin barrier. This perfectly counteracts the dryness, peeling, and initial irritation often caused by Retinol.",
      advice: "Apply Hyaluronic Acid first to damp skin, then your Retinol, and lock it in with a Ceramide-rich moisturizer (the 'sandwich method' is highly recommended for sensitive skin)."
    };
  }

  // Vit C + HA / Ceramides
  if ((isVitC(norm1) && (isHA(norm2) || isCeramides(norm2))) || (isVitC(norm2) && (isHA(norm1) || isCeramides(norm1)))) {
    return {
      compatible: true,
      status: 'Perfect Match',
      explanation: "Vitamin C provides excellent antioxidant protection but can occasionally dry out skin. Hyaluronic Acid and Ceramides soothe skin and retain moisture, keeping skin plump and radiant.",
      advice: "Apply Vitamin C first, let it dry, then layer Hyaluronic Acid or Ceramide moisturizer."
    };
  }

  // Fallback for general matches
  return {
    compatible: true,
    status: 'Perfect Match',
    explanation: `${ing1} and ${ing2} have complementary mechanisms and can be safely layered to achieve healthy, glowing skin without interference.`,
    advice: "Layer from thinnest consistency (serums) to thickest consistency (creams/oils)."
  };
}
