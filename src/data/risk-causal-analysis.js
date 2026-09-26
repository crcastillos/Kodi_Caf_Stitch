/**
 * Fixture local de CAF-102. `causal_factors` está desordenado a propósito:
 * la vista debe ordenar por weight_pct descendente.
 * El 6% edáfico está en la leyenda del mock; el export no trae card ni cifras.
 */
export const riskCausalAnalysis = {
  farmId: 'finca-el-pinar',
  model_version: 'demo-caf-102',
  presentation: {
    kicker: 'Descomposición Causal del Riesgo Favorable vs Desfavorable',
    title: '¿Qué está aumentando el riesgo de mi finca?',
    subtitle:
      'Diagnóstico causal y desglose porcentual de los factores climáticos y agronómicos en Finca El Pinar.',
    calibrationTitle: 'Calibración Activa',
    calibrationDetail: 'Precisión del modelo: 94.2%',
    contextChip: 'Variedad Bourbon · 1,250 msnm · Suelo Franco-Arenoso',
    chartKicker: 'Métrica de Atribución Shapley',
    chartTitle: 'Desglose Porcentual del Riesgo',
    riskBadge: 'Índice Crítico',
    focusLabel: 'Hídrico + Térmico',
    barCaption: 'Composición acumulada de vulnerabilidad biofísica',
    factorsKicker: 'Desglose Detallado',
    factorsTitle: 'Factores Determinantes de la Parcela',
    factorsNote: 'Ordenados por magnitud de contribución en el ciclo fenológico en curso',
    phenology: {
      phase: 'Fase: Cuajado y Llenado',
      title: 'Etapa de Máxima Sensibilidad Hídrica',
      body: 'Las cerezas en formación requieren turgencia celular sostenida. El estrés hídrico actual induce aborto floral tardío y reducción de calibre en granos tipo SHG.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDe6jv2rI2ILJBJtLh6CeR_adjAUsl5IGCs6HMA_Qb3r4ujhxgaGhEUSHmpxPjj_epT-jSpv8SrC4LHCdsAQaLuD4jbK_XoDnLpiJiG9Oqqz7PI8VeUgPuplSinmbEeuAozBEpCu-dc3fvuyJyZsQ5lEmnLQP4g9n4yW_YYxmM-31pNWaGMSavRaKEnpFV_C0uqtDLC2G9ARguNsgvzBEt2sVpEZ3ipXKxBOitx5NBuIuM4D82G-x5U',
      imageAlt: 'Cerezas de café en maduración bajo luz filtrada',
    },
    finding: {
      kicker: 'Hallazgo Crítico de la IA',
      quote:
        '“El 65% del riesgo global proviene de la combinación de sequía prolongada y altas temperaturas durante el cuajado del fruto.”',
      focusLabel: 'Foco agronómico prioritario',
      focusValue: 'Estrés Térmico-Hídrico',
    },
    decision: {
      kicker: 'Criterio Técnico CafIA',
      title: 'Decisión Inteligente: Enfoque en Agua antes que Químicos',
      body: 'CafIA no entrega únicamente un número frío: te explica la causa raíz para que priorices tus recursos en agua y conservación de suelo antes de incurrir en gastos fitosanitarios innecesarios.',
    },
    priorities: [
      {
        icon: 'check_circle',
        iconClass: 'text-primary',
        title: 'Prioridad 1: Coberturas vivas',
        detail: 'Retiene hasta 22% más humedad',
      },
      {
        icon: 'check_circle',
        iconClass: 'text-primary',
        title: 'Prioridad 2: Riego auxiliar',
        detail: 'Enfocado en lote "El Manantial"',
      },
      {
        icon: 'pause_circle',
        iconClass: 'text-secondary',
        title: 'Pospuesto: Fungicidas extra',
        detail: 'Ahorro proyectado: $420 / ha',
      },
    ],
  },
  causal_factors: [
    {
      name: 'Presión Fúngica / Roya',
      legend: 'Microclima / Roya',
      subtitle: 'Hemileia vastatrix en estrato bajo',
      explanation:
        'El rocío matutino combinado con temperaturas nocturnas templadas (19°C) crea ventanas de <strong class="text-on-surface">6 a 8 horas con humedad relativa &gt;90%</strong>, propiciando la germinación de esporas en hojas bajeras no ventiladas.',
      benchmark_comparison: 'Bajo umbral de fumigación química masiva',
      weight_pct: 11,
      impact_type: 'NEGATIVE_MED',
      icon: 'coronavirus',
      footer: {
        type: 'check',
        label: 'Incidencia Foliar Estimada',
        value: '6.4% del follaje',
      },
    },
    {
      name: 'Otros factores edáficos',
      legend: 'Otros factores edáficos',
      subtitle: 'Resto del desglose de atribución',
      explanation:
        'El modelo agrupa aquí el tramo de suelo que completa el desglose y que el diagnóstico no separa en un hallazgo propio.',
      benchmark_comparison: 'Tramo residual del desglose porcentual, sin comparación histórica aparte.',
      weight_pct: 6,
      impact_type: 'NEGATIVE_MED',
      icon: 'landscape',
    },
    {
      name: 'Déficit de Precipitación',
      legend: 'Déficit de precipitación',
      subtitle: 'Humedad en perfil radicular reducida',
      explanation:
        'La precipitación acumulada en los últimos 60 días se encuentra <strong class="text-on-surface">34% por debajo</strong> del comportamiento histórico de la Cordillera Apaneca-Ilamatepec. La reserva de agua en los primeros 40 cm de suelo está en nivel crítico (18% de capacidad de campo).',
      benchmark_comparison: 'Norma: 820 mm · Registro: 540 mm',
      weight_pct: 42,
      impact_type: 'NEGATIVE_HIGH',
      icon: 'water_drop',
      footer: {
        type: 'bar',
        label: 'Déficit acumulado',
        value: '-280 mm',
        barPct: 78,
      },
    },
    {
      name: 'Edad y Vigor del Cafetal',
      legend: 'Edad y densidad de cafetal',
      subtitle: 'Capacidad de resiliencia del tejido leñoso',
      explanation:
        'Con 7 años promedio, los cafetos tienen alta demanda metabólica. Su índice NDVI muestra un <strong class="text-on-surface">descenso del 12%</strong> en las zonas con pendiente sur más expuestas al sol directo, requiriendo podas de mantenimiento preventivas.',
      benchmark_comparison: 'Afectación acentuada en microcuenca sur de 1.8 ha',
      weight_pct: 18,
      impact_type: 'NEGATIVE_MED',
      icon: 'yard',
      footer: {
        type: 'stat',
        label: 'NDVI promedio actual',
        value: '0.68',
        delta: '(-12%)',
      },
    },
    {
      name: 'Temperaturas Elevadas &amp; Olas de Calor',
      legend: 'Temperaturas elevadas',
      subtitle: 'Parada fotosintética por calor diurno',
      explanation:
        'Se registran <strong class="text-on-surface">14 días consecutivos</strong> con temperaturas diurnas &gt;30°C. Esto genera cierre estomático prematuro en las plantas de café a partir de las 11:00 AM, frenando la fotosíntesis y el llenado de fruto en las parcelas centrales.',
      benchmark_comparison: '4.5 hrs/día sin ganancia neta de biomasa',
      weight_pct: 23,
      impact_type: 'NEGATIVE_HIGH',
      icon: 'thermostat',
      footer: {
        type: 'window',
        label: 'Ventana de estrés térmico',
        value: '11:00 AM – 3:30 PM',
        detailIcon: 'timer_off',
      },
    },
  ],
  protective_mechanisms: [
    {
      name: 'Sistema Agroforestal de Sombra Regulada',
      explanation:
        'El estrato arbóreo de sombra (<em class="font-medium text-on-surface">Inga sp.</em> y guachipilín) reduce la temperatura foliar en <strong class="text-primary font-bold">2.8°C</strong> comparado con parcelas a pleno sol, amortiguando la evapotranspiración y evitando daños irreversibles por quemaduras de sol en los racimos.',
      benchmark_comparison: 'Cobertura de dosel actual: 38% de filtro lumínico. Protección de 4.2 ha críticas.',
      impact_type: 'POSITIVE',
      risk_reduction_label: '-15% de Riesgo Neto',
      icon: 'forest',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDskOmvkO79ddqPLZfWI1Dm5P18ZOrnCEd_jTQZ2IQGnpiZ408Dg2ay1M8-s-W0v3NfYoJL63UiwwyRFCrkG9ChnLODlaUFH0AO3imwKaTe2V-QsFcLtVwmEPYHn03JpEhjokXdD2E73L9sHs_Rd11mYGJASNkKuJrCBcbRqaQL8DxYy34WJ2j8m7-dUklFJSBKjK0DX7IRr1Td2dRI4MUuZbUBH3zLv9PEugOjkl7Cljoy7E5EXcfp',
      imageAlt: 'Sombra agroforestal sobre cafetos Bourbon',
      coverageLabel: 'Cobertura de Dosel Actual:',
      coverageValue: '38% de filtro lumínico',
      coverageNote: 'Protección de 4.2 ha críticas',
    },
  ],
};
