function parseNumber(value) {
  if (typeof value !== "string") return NaN;
  const normalized = value.trim().replace(",", ".");
  if (normalized === "") return NaN;
  return Number(normalized);
}

function normalizeHeightInput(heightValue, unit) {
  // heightValue is expected to be a Number (parsed). Guard clauses above ensure positivity.
  if (!Number.isFinite(heightValue) || heightValue <= 0) {
    return { heightMeters: NaN, adjusted: false, message: "" };
  }

  // Heurística más precisa:
  // - Si unidad es 'm' y el valor es grande (>= 100) es muy probable que el usuario ingresó cm (ej. 175)
  //   => convertir a metros dividiendo por 100.
  // - Si unidad es 'cm' y el valor es pequeño (< 3) es probable que el usuario ingresó metros (ej. 1.75)
  //   => usar el valor tal cual (metros).
  if (unit === "m") {
    if (heightValue >= 100) {
      return {
        heightMeters: heightValue / 100,
        adjusted: true,
        message:
          "Se interpretó la altura como centímetros y se convirtió automáticamente a metros.",
      };
    }
    return { heightMeters: heightValue, adjusted: false, message: "" };
  }

  if (unit === "cm") {
    if (heightValue > 0 && heightValue < 3) {
      return {
        heightMeters: heightValue,
        adjusted: true,
        message:
          "Se interpretó la altura como metros aunque estaba seleccionada la unidad cm.",
      };
    }
    return { heightMeters: heightValue / 100, adjusted: false, message: "" };
  }

  return { heightMeters: NaN, adjusted: false, message: "" };
}

function toMeters(heightValue, unit) {
  return normalizeHeightInput(heightValue, unit).heightMeters;
}

function calculateBMI(weightKg, heightMeters) {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightMeters)) {
    return { error: "entrada_invalida" };
  }
  if (weightKg <= 0 || heightMeters <= 0) {
    return { error: "rango_invalido" };
  }

  const bmi = weightKg / (heightMeters * heightMeters);
  return { bmi };
}

function classifyBMI(bmi) {
  if (bmi < 18.5) return "Bajo peso";
  if (bmi < 25) return "Peso normal";
  if (bmi < 30) return "Sobrepeso";
  if (bmi < 35) return "Obesidad grado I";
  if (bmi < 40) return "Obesidad grado II";
  return "Obesidad grado III";
}

function formatBMI(bmi) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(bmi);
}

function initCalculator() {
  const form = document.getElementById("imc-form");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const unitSelect = document.getElementById("height-unit");
  const imcValue = document.getElementById("imc-value");
  const imcCategory = document.getElementById("imc-category");
  const errorEl = document.getElementById("error-message");
  const noteEl = document.getElementById("imc-note");
  const clearBtn = document.getElementById("clear-btn");
  const defaultNote =
    "Nota: este resultado es orientativo y no sustituye una evaluación médica.";

  let unitTs = null;
  if (typeof window.TomSelect === "function") {
    unitTs = new window.TomSelect(unitSelect, {
      create: false,
      controlInput: null,
      dropdownParent: "body",
      sortField: [{ field: "$order", direction: "asc" }],
    });
  }

  function getUnit() {
    return unitTs ? unitTs.getValue() : unitSelect.value;
  }

  function resetResult() {
    imcValue.textContent = "0.00";
    imcCategory.textContent = "Sin calcular";
  }

  function runCalculation(event) {
    if (event) event.preventDefault();

    const weight = parseNumber(weightInput.value);
    const height = parseNumber(heightInput.value);
    const unit = getUnit();
    const normalizedHeight = normalizeHeightInput(height, unit);
    const heightMeters = normalizedHeight.heightMeters;

    const result = calculateBMI(weight, heightMeters);
    if (result.error) {
      errorEl.textContent = "Ingresa valores válidos: peso > 0 y altura > 0.";
      noteEl.textContent = defaultNote;
      resetResult();
      return;
    }

    imcValue.textContent = formatBMI(result.bmi);
    imcCategory.textContent = classifyBMI(result.bmi);
    errorEl.textContent = "";
    noteEl.textContent = normalizedHeight.adjusted
      ? `${normalizedHeight.message} ${defaultNote}`
      : defaultNote;
  }

  form.addEventListener("submit", runCalculation);
  weightInput.addEventListener("input", runCalculation);
  heightInput.addEventListener("input", runCalculation);

  if (unitTs) {
    unitTs.on("change", runCalculation);
  } else {
    unitSelect.addEventListener("change", runCalculation);
  }

  clearBtn.addEventListener("click", () => {
    weightInput.value = "";
    heightInput.value = "";
    if (unitTs) {
      unitTs.setValue("m", true);
    } else {
      unitSelect.value = "m";
    }
    errorEl.textContent = "";
    noteEl.textContent = defaultNote;
    resetResult();
    weightInput.focus();
  });

  resetResult();
}

if (typeof document !== "undefined") {
  initCalculator();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    parseNumber,
    normalizeHeightInput,
    toMeters,
    calculateBMI,
    classifyBMI,
  };
}
