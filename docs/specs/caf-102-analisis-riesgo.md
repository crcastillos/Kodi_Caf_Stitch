# CAF-102 — Análisis de Riesgo (Explainable AI)

Spec de implementación de la vista `#/riesgos`. Fuente de comportamiento: la story CAF-102 de la guía SDD. Fuente visual: el `<main>` del mock Stitch «Análisis de Riesgo». No hay API en este repo; los datos salen de una fixture local.

## Comportamiento

- El donut y la barra apilada se pintan desde `causal_factors` ya ordenados por `weight_pct` descendente. El orden del array de origen no se usa.
- El largo de cada arco es `weight_pct / 100` del perímetro. No se reescala para tapar el círculo si la suma no es 100.
- Color de segmento, punto de leyenda, barra y tag: solo `impactStyle(impact_type)`.
- Cada card de factor muestra nombre, tag, `explanation` y `benchmark_comparison`.
- `protective_mechanisms` con elementos: sección `#protective-mechanisms` debajo de las cards negativas, con la tarjeta verde del mock. Array vacío: esa sección no existe en el DOM.
- El botón «Simular mitigación y riego» guarda `{ farmId }` en `sessionStorage` (`cafia_sim_context`) y navega a `#/simular`. No implementa CAF-103.
- El botón «Descargar informe agrónomo» se ve como en el mock y no descarga ni genera un archivo.
- Al pintar la vista se hace `console.info` de `model_version`. Si la suma de `weight_pct` no es 100, `console.warn` y la leyenda muestra esa suma. No se normaliza.

## Mapping (`impactStyle`)

| `impact_type` | Tag | Tokens |
|---------------|-----|--------|
| `NEGATIVE_HIGH` | Impacto alto | `error`, `error-container` |
| `NEGATIVE_MED` | Impacto moderado | `tertiary`, `tertiary-fixed` |
| `POSITIVE` | Factor protector | `primary`, `primary-container` |

Un `impact_type` desconocido usa estilo neutro (`secondary`) y el tag «Sin clasificar». No se trata como un cuarto nivel oficial.

## Casos borde

| Caso | Resolución |
|------|------------|
| Los porcentajes no suman 100 | Se muestran tal cual. La leyenda usa la suma real (`94% de la varianza explicada`, por ejemplo). `console.warn`. Los arcos no se estiran. |
| `protective_mechanisms: []` | No se renderiza `#protective-mechanisms` ni un aviso vacío. |
| `causal_factor` sin `explanation` | Texto «Sin detalle disponible para este factor». |
| `model_version` distinto entre visitas | Sin cambio visual. `console.info('cafia model_version', version)` en cada pintado. |
| Factores desordenados en la fixture | `sortFactorsByWeight` antes de donut, leyenda, barra y cards. |

## Contrato de la fixture

Campos que corresponden al `GET /api/v1/farms/{farm_id}/risk-causal-analysis`:

- `farmId`
- `model_version`
- `causal_factors[]`: `name`, `legend`, `subtitle`, `explanation`, `benchmark_comparison`, `weight_pct`, `impact_type`, `icon`, `footer`
- `protective_mechanisms[]`: `name`, `explanation`, `benchmark_comparison`, `impact_type`, `risk_reduction_label`, `icon`, imagen y líneas de cobertura del mock

`footer` e imágenes no vienen en el contrato de una línea de la story. Están para conservar el detalle visual del mock.

El 65% del centro del donut no es un campo. Es la suma de los `weight_pct` con `impact_type === 'NEGATIVE_HIGH'`. La etiqueta «Hídrico + Térmico» sí es texto del mock (`presentation.focusLabel`).

## Qué es solo del mock

Hero (calibración 94.2%, variedad, altitud, suelo), foto fenológica, hallazgo crítico, tres prioridades y el botón de descarga. Viven en `presentation`. La precisión del modelo no sustituye a `model_version`.

El mock pinta un color distinto por factor (incluido un hex que no está en los tokens). Esta vista no lo copia: dos `NEGATIVE_HIGH` comparten rojo y los `NEGATIVE_MED` comparten ámbar.

El mock mete el factor protector dentro de la grilla. Aquí va en su propia sección, con el mismo markup verde.

El `<aside>` y el `<header>` del export no se portan.

## Cómo comprobar los casos que la fixture feliz no muestra

1. `protective_mechanisms: []` en `src/data/risk-causal-analysis.js`, recargar `#/riesgos`: no debe existir `#protective-mechanisms`. Restaurar el mecanismo de sombra después.
2. Bajar un `weight_pct` para que la suma no sea 100, recargar: la leyenda muestra esa suma, la consola avisa, el hueco del donut no se rellena repartiendo el resto. Restaurar los pesos después.

La fixture que queda en el repo suma 100 (42 + 23 + 18 + 11 + 6) y trae un mecanismo protector, para coincidir con el mock en el camino feliz. El 6% («Otros factores edáficos») está en la leyenda del mock; el export no trae card ni cifras propias, así que su texto no inventa mediciones.
