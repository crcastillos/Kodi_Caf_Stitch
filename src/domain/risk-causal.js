export const SIM_CONTEXT_KEY = 'cafia_sim_context';

export const EXPLANATION_FALLBACK = 'Sin detalle disponible para este factor';

const NEUTRAL_STYLE = {
  label: 'Sin clasificar',
  badgeClass: 'bg-surface-container-highest text-on-surface',
  iconWrapClass: 'bg-surface-container-highest text-secondary',
  strokeClass: 'stroke-secondary',
  dotClass: 'bg-secondary',
  barClass: 'bg-secondary',
  valueClass: 'text-secondary',
};

/** Único mapping impact_type → color y tag. */
export const IMPACT_STYLES = {
  NEGATIVE_HIGH: {
    label: 'Impacto alto',
    badgeClass: 'bg-error-container text-on-error-container',
    iconWrapClass: 'bg-error-container text-error',
    strokeClass: 'stroke-error',
    dotClass: 'bg-error',
    barClass: 'bg-error',
    valueClass: 'text-error',
  },
  NEGATIVE_MED: {
    label: 'Impacto moderado',
    badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    iconWrapClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    strokeClass: 'stroke-tertiary',
    dotClass: 'bg-tertiary',
    barClass: 'bg-tertiary',
    valueClass: 'text-tertiary',
  },
  POSITIVE: {
    label: 'Factor protector',
    badgeClass: 'bg-primary-container text-on-primary-container',
    iconWrapClass: 'bg-primary-fixed text-on-primary-fixed-variant',
    strokeClass: 'stroke-primary',
    dotClass: 'bg-primary',
    barClass: 'bg-primary',
    valueClass: 'text-primary',
  },
};

export const DONUT_RADIUS = 62;
export const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;

export function impactStyle(impactType) {
  return IMPACT_STYLES[impactType] ?? NEUTRAL_STYLE;
}

export function sortFactorsByWeight(factors) {
  return [...(factors ?? [])].sort((a, b) => Number(b.weight_pct) - Number(a.weight_pct));
}

export function explanationText(factor) {
  const text = typeof factor?.explanation === 'string' ? factor.explanation.trim() : '';
  return text || EXPLANATION_FALLBACK;
}

export function weightSum(factors) {
  return (factors ?? []).reduce((sum, factor) => sum + Number(factor.weight_pct), 0);
}

export function focusWeight(factors) {
  return (factors ?? [])
    .filter((factor) => factor.impact_type === 'NEGATIVE_HIGH')
    .reduce((sum, factor) => sum + Number(factor.weight_pct), 0);
}

export function formatPct(value) {
  const number = Number(value);
  if (Number.isInteger(number)) return String(number);
  return String(Math.round(number * 10) / 10);
}

/** Arcos con el peso tal cual. No se reescalan para completar el círculo. */
export function donutSegments(factors) {
  let offset = 0;
  return factors.map((factor) => {
    const length = (Number(factor.weight_pct) / 100) * DONUT_CIRCUMFERENCE;
    const segment = {
      factor,
      dasharray: `${length} ${DONUT_CIRCUMFERENCE}`,
      dashoffset: -offset,
    };
    offset += length;
    return segment;
  });
}

export function presentRiskAnalysis(raw) {
  const factors = sortFactorsByWeight(raw?.causal_factors);
  const sum = weightSum(factors);
  return {
    factors,
    sum,
    sumIsComplete: Math.abs(sum - 100) < 0.001,
    focusPct: focusWeight(factors),
    protective: raw?.protective_mechanisms ?? [],
    segments: donutSegments(factors),
  };
}

export function logRiskAnalysis(raw, presented) {
  console.info('cafia model_version', raw?.model_version);
  if (!presented.sumIsComplete) {
    console.warn(
      `CAF-102: los weight_pct de causal_factors suman ${presented.sum}, no 100. No se normalizan.`,
    );
  }
}
