import { pathToHash } from '../config/navigation.js';
import { riskCausalAnalysis } from '../data/risk-causal-analysis.js';
import {
  SIM_CONTEXT_KEY,
  explanationText,
  formatPct,
  impactStyle,
  logRiskAnalysis,
  presentRiskAnalysis,
} from '../domain/risk-causal.js';

function renderHero(presentation) {
  return `
    <section class="relative bg-surface-container-low rounded-xl p-6 md:p-8 overflow-hidden shadow-sm">
      <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-tertiary-fixed/20 blur-3xl pointer-events-none"></div>
      <div class="absolute right-1/4 -bottom-16 w-64 h-64 rounded-full bg-primary-fixed/25 blur-2xl pointer-events-none"></div>
      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div class="space-y-2 max-w-3xl min-w-0">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-tertiary text-xs font-semibold tracking-wide uppercase">
            <span class="material-symbols-outlined text-[15px] text-tertiary">analytics</span>
            <span>${presentation.kicker}</span>
          </div>
          <h1 class="font-headline text-2xl md:text-3xl lg:text-4xl text-on-surface font-bold tracking-tight">
            ${presentation.title}
          </h1>
          <p class="text-secondary text-sm md:text-base leading-relaxed">${presentation.subtitle}</p>
        </div>
        <div class="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0">
          <div class="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container text-on-surface shadow-sm">
            <span class="flex h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
            <div class="flex flex-col">
              <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">${presentation.calibrationTitle}</span>
              <span class="text-xs font-semibold text-primary">${presentation.calibrationDetail}</span>
            </div>
          </div>
          <span class="text-[11px] text-secondary font-medium px-2 py-0.5 rounded-md bg-secondary-container/70">
            ${presentation.contextChip}
          </span>
        </div>
      </div>
    </section>
  `;
}

function renderDonut(presented) {
  const segments = presented.segments
    .map(({ factor, dasharray, dashoffset }) => {
      const style = impactStyle(factor.impact_type);
      const legend = factor.legend || factor.name;
      return `
        <circle
          class="transition-all duration-700 hover:opacity-85 cursor-pointer ${style.strokeClass}"
          cx="80"
          cy="80"
          fill="transparent"
          r="62"
          stroke-dasharray="${dasharray}"
          stroke-dashoffset="${dashoffset}"
          stroke-width="17"
        >
          <title>${legend}: ${formatPct(factor.weight_pct)}%</title>
        </circle>
      `;
    })
    .join('');

  return `
    <div class="relative w-52 h-52 shrink-0 flex items-center justify-center">
      <svg aria-label="Gráfico de distribución del riesgo" class="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
        <circle class="stroke-surface-container-highest" cx="80" cy="80" fill="transparent" r="62" stroke-width="16"></circle>
        ${segments}
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
        <span class="font-display text-3xl font-extrabold text-on-surface leading-tight">${formatPct(presented.focusPct)}<span class="text-error text-xl font-bold">%</span></span>
        <span class="text-[11px] font-semibold uppercase text-secondary tracking-tight">${riskCausalAnalysis.presentation.focusLabel}</span>
      </div>
    </div>
  `;
}

function renderLegend(factors) {
  return factors
    .map((factor) => {
      const style = impactStyle(factor.impact_type);
      const legend = factor.legend || factor.name;
      return `
        <div class="flex items-center justify-between p-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest transition-colors">
          <div class="flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full ${style.dotClass} shrink-0"></span>
            <span class="text-on-surface font-semibold">${legend}</span>
          </div>
          <span class="font-bold text-on-surface bg-surface-container px-2 py-0.5 rounded">${formatPct(factor.weight_pct)}%</span>
        </div>
      `;
    })
    .join('');
}

function renderStackedBar(factors) {
  return factors
    .map((factor) => {
      const style = impactStyle(factor.impact_type);
      const legend = factor.legend || factor.name;
      return `<div class="${style.barClass} h-full" style="width: ${Number(factor.weight_pct)}%" title="${legend}: ${formatPct(factor.weight_pct)}%"></div>`;
    })
    .join('');
}

function renderChart(presentation, presented) {
  return `
    <div class="lg:col-span-7 bg-surface-container rounded-xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
      <div class="flex items-center justify-between gap-4 mb-4">
        <div>
          <span class="text-xs uppercase font-bold text-secondary tracking-wider">${presentation.chartKicker}</span>
          <h2 class="font-headline text-xl md:text-2xl text-on-surface font-bold">${presentation.chartTitle}</h2>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-error-container text-on-error-container flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">trending_up</span> ${presentation.riskBadge}
        </span>
      </div>
      <div class="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
        ${renderDonut(presented)}
        <div class="space-y-3 w-full sm:max-w-xs text-xs" id="risk-legend">
          ${renderLegend(presented.factors)}
        </div>
      </div>
      <div class="pt-4">
        <div class="flex justify-between text-[11px] text-secondary font-medium mb-1.5">
          <span>${presentation.barCaption}</span>
          <span class="text-on-surface font-semibold" id="risk-variance">${formatPct(presented.sum)}% de la varianza explicada</span>
        </div>
        <div class="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden flex" id="risk-stacked-bar">
          ${renderStackedBar(presented.factors)}
        </div>
      </div>
    </div>
  `;
}

function renderInsight(presentation) {
  const { phenology, finding } = presentation;
  return `
    <div class="lg:col-span-5 flex flex-col justify-between space-y-4">
      <div class="relative bg-surface-container rounded-xl overflow-hidden shadow-sm flex-1 flex flex-col justify-end min-h-[220px]">
        <img alt="${phenology.imageAlt}" class="absolute inset-0 w-full h-full object-cover" src="${phenology.image}" />
        <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/65 to-transparent"></div>
        <div class="relative z-10 p-6 text-inverse-on-surface space-y-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold tracking-wide uppercase">
            <span class="material-symbols-outlined text-[14px]">nest_eco_leaf</span>
            ${phenology.phase}
          </span>
          <h3 class="font-headline text-lg font-bold text-surface-bright leading-snug">${phenology.title}</h3>
          <p class="text-xs text-surface-variant leading-relaxed">${phenology.body}</p>
        </div>
      </div>
      <div class="p-6 rounded-xl bg-error-container/40 text-on-surface space-y-3 shadow-sm">
        <div class="flex items-center gap-2 text-error font-bold text-sm">
          <span class="material-symbols-outlined text-[20px]">warning</span>
          <span>${finding.kicker}</span>
        </div>
        <p class="font-headline text-sm md:text-base font-semibold text-on-surface leading-snug">${finding.quote}</p>
        <div class="pt-2 flex items-center justify-between text-xs text-secondary font-medium">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px] text-primary">eco</span> ${finding.focusLabel}
          </span>
          <span class="font-bold text-error">${finding.focusValue}</span>
        </div>
      </div>
    </div>
  `;
}

function renderFactorFooter(factor, style) {
  const benchmark = typeof factor.benchmark_comparison === 'string' ? factor.benchmark_comparison.trim() : '';
  const footer = factor.footer;

  if (!footer) {
    if (!benchmark) return '';
    return `
      <div class="pt-3 bg-surface-container-high rounded-lg p-3">
        <p class="text-[10px] text-secondary">${benchmark}</p>
      </div>
    `;
  }

  if (footer.type === 'bar') {
    return `
      <div class="pt-3 bg-surface-container-high rounded-lg p-3 space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="text-secondary font-medium">${footer.label}</span>
          <span class="font-bold font-mono ${style.valueClass}">${footer.value}</span>
        </div>
        <div class="h-1.5 bg-surface-variant rounded-full overflow-hidden">
          <div class="${style.barClass} h-full rounded-full" style="width: ${Number(footer.barPct)}%"></div>
        </div>
        ${benchmark ? `<span class="text-[10px] text-secondary block text-right">${benchmark}</span>` : ''}
      </div>
    `;
  }

  if (footer.type === 'window') {
    return `
      <div class="pt-3 bg-surface-container-high rounded-lg p-3 space-y-2">
        <div class="flex justify-between items-center text-xs">
          <span class="text-secondary font-medium">${footer.label}</span>
          <span class="font-bold ${style.valueClass}">${footer.value}</span>
        </div>
        ${
          benchmark
            ? `<div class="flex items-center gap-1.5 text-[11px] text-on-surface-variant font-medium">
                <span class="material-symbols-outlined text-sm ${style.valueClass}">${footer.detailIcon || 'timer_off'}</span>
                <span>${benchmark}</span>
              </div>`
            : ''
        }
      </div>
    `;
  }

  if (footer.type === 'stat') {
    return `
      <div class="pt-3 bg-surface-container-high rounded-lg p-3 space-y-1.5">
        <div class="flex justify-between items-center text-xs">
          <span class="text-secondary font-medium">${footer.label}</span>
          <span class="font-bold text-on-surface">${footer.value}${footer.delta ? ` <span class="text-error text-[10px]">${footer.delta}</span>` : ''}</span>
        </div>
        ${benchmark ? `<p class="text-[10px] text-secondary">${benchmark}</p>` : ''}
      </div>
    `;
  }

  if (footer.type === 'check') {
    return `
      <div class="pt-3 bg-surface-container-high rounded-lg p-3 space-y-1.5">
        <div class="flex justify-between items-center text-xs">
          <span class="text-secondary font-medium">${footer.label}</span>
          <span class="font-bold ${style.valueClass}">${footer.value}</span>
        </div>
        ${
          benchmark
            ? `<span class="text-[10px] text-secondary flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px] text-primary">check_circle</span>
                ${benchmark}
              </span>`
            : ''
        }
      </div>
    `;
  }

  return '';
}

function renderFactorCard(factor) {
  const style = impactStyle(factor.impact_type);
  return `
    <article
      class="bg-surface-container rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
      data-impact="${factor.impact_type}"
      data-weight="${factor.weight_pct}"
    >
      <div class="space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div class="p-2 rounded-lg ${style.iconWrapClass}">
            <span class="material-symbols-outlined text-[24px]">${factor.icon}</span>
          </div>
          <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${style.badgeClass}">
            ${style.label} · ${formatPct(factor.weight_pct)}%
          </span>
        </div>
        <div>
          <h3 class="font-headline text-base font-bold text-on-surface">${factor.name}</h3>
          ${factor.subtitle ? `<p class="text-xs text-secondary mt-0.5">${factor.subtitle}</p>` : ''}
        </div>
        <p class="text-xs text-on-surface-variant leading-relaxed">${explanationText(factor)}</p>
      </div>
      ${renderFactorFooter(factor, style)}
    </article>
  `;
}

function renderProtective(mechanism) {
  const style = impactStyle(mechanism.impact_type);
  const reduction = mechanism.risk_reduction_label ? ` · ${mechanism.risk_reduction_label}` : '';
  return `
    <article class="bg-surface-container rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 relative overflow-hidden">
      <div class="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-primary-fixed/30 blur-2xl pointer-events-none"></div>
      <div class="space-y-3 relative z-10">
        <div class="flex items-start justify-between gap-2">
          <div class="p-2 rounded-lg ${style.iconWrapClass}">
            <span class="material-symbols-outlined text-[24px]">${mechanism.icon}</span>
          </div>
          <span class="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${style.badgeClass}">
            <span class="material-symbols-outlined text-xs">shield</span>
            ${style.label}${reduction}
          </span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div class="sm:col-span-8 space-y-2">
            <h3 class="font-headline text-lg font-bold text-on-surface">${mechanism.name}</h3>
            <p class="text-xs text-on-surface-variant leading-relaxed">${explanationText(mechanism)}</p>
          </div>
          <div class="sm:col-span-4 rounded-xl overflow-hidden h-28 relative shadow-inner">
            <img alt="${mechanism.imageAlt || mechanism.name}" class="w-full h-full object-cover" src="${mechanism.image}" />
            <div class="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          </div>
        </div>
      </div>
      <div class="pt-3 bg-surface-container-high/90 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[18px]">wb_twilight</span>
          <span class="text-secondary font-medium">${mechanism.coverageLabel}</span>
          <span class="font-bold text-on-surface">${mechanism.coverageValue}</span>
        </div>
        <span class="text-[11px] text-primary font-bold bg-surface-container px-2.5 py-1 rounded">
          ${mechanism.coverageNote}
        </span>
      </div>
    </article>
  `;
}

function renderDecision(presentation) {
  const priorities = presentation.priorities
    .map(
      (item) => `
        <div class="p-3 rounded-lg bg-surface-container-lowest/80 flex items-center gap-3">
          <span class="material-symbols-outlined ${item.iconClass} text-[22px]">${item.icon}</span>
          <div>
            <p class="text-xs font-bold text-on-surface">${item.title}</p>
            <p class="text-[11px] text-secondary">${item.detail}</p>
          </div>
        </div>
      `,
    )
    .join('');

  return `
    <section class="bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low rounded-xl p-6 md:p-8 shadow-sm space-y-6">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="flex items-start gap-4 max-w-3xl">
          <div class="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm mt-1">
            <span class="material-symbols-outlined text-[28px]">lightbulb</span>
          </div>
          <div class="space-y-1.5">
            <span class="text-xs uppercase font-bold text-primary tracking-wider">${presentation.decision.kicker}</span>
            <h3 class="font-headline text-lg md:text-xl font-bold text-on-surface leading-tight">${presentation.decision.title}</h3>
            <p class="text-sm text-secondary leading-relaxed">${presentation.decision.body}</p>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-stretch lg:items-center gap-3 w-full lg:w-auto shrink-0">
          <button class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-container-lowest text-primary font-semibold text-sm hover:bg-surface-container-high transition-all shadow-sm" id="btn-descargar-informe" type="button">
            <span class="material-symbols-outlined text-[19px]">download</span>
            <span>Descargar informe agrónomo</span>
          </button>
          <button class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all shadow-sm" id="btn-simular-mitigacion" type="button">
            <span class="material-symbols-outlined text-[19px]">tune</span>
            <span>Simular mitigación y riego</span>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        ${priorities}
      </div>
    </section>
  `;
}

export function renderAnalisisRiesgo() {
  const presented = presentRiskAnalysis(riskCausalAnalysis);
  const { presentation } = riskCausalAnalysis;
  const protective =
    presented.protective.length > 0
      ? `<section class="space-y-4" id="protective-mechanisms">${presented.protective.map(renderProtective).join('')}</section>`
      : '';

  return `
    <div class="flex flex-col w-full pb-16 space-y-8" id="analisis-riesgo">
      ${renderHero(presentation)}
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        ${renderChart(presentation, presented)}
        ${renderInsight(presentation)}
      </section>
      <section class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span class="text-xs uppercase font-bold text-secondary tracking-wider">${presentation.factorsKicker}</span>
            <h2 class="font-headline text-xl md:text-2xl text-on-surface font-bold">${presentation.factorsTitle}</h2>
          </div>
          <p class="text-xs text-secondary">${presentation.factorsNote}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="causal-factors">
          ${presented.factors.map(renderFactorCard).join('')}
        </div>
      </section>
      ${protective}
      ${renderDecision(presentation)}
    </div>
  `;
}

export function bindAnalisisRiesgo() {
  const root = document.getElementById('analisis-riesgo');
  if (!root) return;

  const presented = presentRiskAnalysis(riskCausalAnalysis);
  logRiskAnalysis(riskCausalAnalysis, presented);

  document.getElementById('btn-simular-mitigacion')?.addEventListener('click', () => {
    sessionStorage.setItem(
      SIM_CONTEXT_KEY,
      JSON.stringify({ farmId: riskCausalAnalysis.farmId }),
    );
    window.location.hash = pathToHash('simular');
  });
}
