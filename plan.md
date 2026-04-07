# Plan: Calculadora de Índice de Masa Corporal (IMC)

## Objetivo
Calcular IMC con peso y altura, y mostrar una interpretación saludable clara.

## Alcance MVP (una sola página)
- Input de peso (kg).
- Input de altura (cm o m).
- Botón calcular (o resultado en tiempo real).
- Resultado IMC + categoría.

## Flujo de usuario (1 paso)
1. Usuario ingresa peso y altura.
2. Obtiene IMC y categoría al instante.

## Requisitos funcionales
- Fórmula: `IMC = peso / (altura_m ^ 2)`.
- Soportar altura en cm convirtiendo a metros.
- Categorías estándar (OMS): bajo peso, normal, sobrepeso, obesidad.

## Requisitos no funcionales
- Validación estricta de valores (>0).
- Mensajes claros y amigables.
- Interfaz simple para móvil.

## Implementación sugerida
- Función pura `calcularIMC(pesoKg, alturaM)`.
- Función `clasificarIMC(imc)` por rangos.
- Mostrar resultado con redondeo a 1–2 decimales.

## Criterios de aceptación
- IMC correcto en casos de prueba conocidos.
- Valores inválidos muestran error claro.
- La categoría coincide con el rango mostrado.

## Tareas de ejecución
1. Construir UI de entrada y salida.
2. Implementar cálculo y clasificación.
3. Agregar validaciones y mensajes.
4. Ajustar formato numérico y accesibilidad.
5. Probar casos límite y normales.

