// containers
const inputContainer = document.querySelectorAll(".input-container");

// radio inputs
const repaymentType = document.getElementById("repayment");
const interestOnlyType = document.getElementById("interestOnly");

function onError(container, isError = false) {
  const label = container.querySelector("span");
  const errorMessage = container.nextElementSibling;
  if (isError) {
    errorMessage.classList.remove("hidden");
    label.classList.add("!bg-red");
    label.classList.add("!text-white");
    container.classList.add("!border-red");
  } else {
    errorMessage.classList.add("hidden");
    label.classList.remove("!bg-red");
    label.classList.remove("!text-white");
    container.classList.remove("!border-red");
  }
}

function toggleTemplate(isComplete = false, result) {
  const monthlyPayment = document.getElementById("monthlyPaymentResult");
  const termPayment = document.getElementById("termPaymentResult");
  const completeTemplate = document.getElementById("completeTemplate");
  const emptyTemplate = document.getElementById("emptyTemplate");
  if (isComplete) {
    completeTemplate.classList.remove("hidden");
    emptyTemplate.classList.add("hidden");
    monthlyPayment.textContent = result.monthlyPayment;
    termPayment.textContent = result.totalPayment;
  } else {
    completeTemplate.classList.add("hidden");
    emptyTemplate.classList.remove("hidden");
  }
}

function calculateMortgage(amount, rate, term, type) {
  const monthlyRate = rate / 12 / 100;
  const totalPayments = term * 12;

  if (type.toLowerCase() === "repayment") {
    // Amortizing Loan (Repayment)
    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    const totalPayment = monthlyPayment * totalPayments;
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
  } else if (type.toLowerCase() === "interestOnly") {
    // Interest-Only Loan
    const monthlyPayment = amount * monthlyRate;
    const totalPayment = monthlyPayment * totalPayments;
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
  } else {
    console.log("Invalid mortgage type. Use 'Repayment' or 'Interest Only'.");
    return {};
  }
}

// check inputs
function checkRadioInput() {
  const mortgageTypeContainer = document.getElementById(
    "mortgageTypeContainer"
  );
  if (repaymentType.checked) {
    mortgageTypeContainer.querySelector("#typeError").classList.add("hidden");
    return repaymentType.value;
  } else if (interestOnlyType.checked) {
    mortgageTypeContainer.querySelector("#typeError").classList.add("hidden");
    return interestOnlyType.value;
  } else {
    mortgageTypeContainer
      .querySelector("#typeError")
      .classList.remove("hidden");
    return null;
  }
}

function checkInputs() {
  let isError = false;
  inputContainer.forEach((container) => {
    const input = container.querySelector("input");
    const value = input.value.trim();
    if (!value) {
      isError = true;
      onError(container, true);
    } else {
      onError(container);
    }
  });
  return isError;
}

// events
document.querySelectorAll("input[type='radio']").forEach((element) => {
  element.addEventListener("change", (e) => {
    const value = e.target.value;

    if (value === repaymentType.value) {
      repaymentType.parentElement.classList.add("bg-lime/10");
      repaymentType.parentElement.classList.add("!border-lime");
      interestOnlyType.parentElement.classList.remove("bg-lime/10");
      interestOnlyType.parentElement.classList.remove("!border-lime");
    } else {
      interestOnlyType.parentElement.classList.add("bg-lime/10");
      repaymentType.parentElement.classList.remove("bg-lime/10");
      interestOnlyType.parentElement.classList.remove("!border-lime");
      repaymentType.parentElement.classList.remove("!border-lime");
    }
  });
});

document.getElementById("clearButton").addEventListener("click", () => {
  mortgageTypeContainer.querySelector("#typeError").classList.add("hidden");
  toggleTemplate();
  inputContainer.forEach((container) => {
    onError(container);
  });
  document
    .querySelectorAll("input[type='number'")
    .forEach((ele) => (ele.value = ""));
  // clear radio input
  document
    .querySelectorAll("input[type='radio'")
    .forEach((ele) => (ele.checked = false));
  interestOnlyType.parentElement.classList.remove("bg-lime/10");
  repaymentType.parentElement.classList.remove("bg-lime/10");
  interestOnlyType.parentElement.classList.remove("!border-lime");
  repaymentType.parentElement.classList.remove("!border-lime");
});

inputContainer.forEach((container) => {
  const input = container.querySelector("input");
  const label = container.querySelector("span");
  input.addEventListener("focus", () => {
    label.classList.add("!bg-lime");
    container.classList.add("!border-lime");
  });
  input.addEventListener("blur", () => {
    label.classList.remove("!bg-lime");
    container.classList.remove("!border-lime");
  });
});

document.getElementById("submitButton").addEventListener("click", () => {
  const isError = checkInputs();
  const mortgageType = checkRadioInput();
  if (isError || !mortgageType) return toggleTemplate();
  // inputs elements
  const mortgageAmount = document.getElementById("mortgageAmount");
  const interestRate = document.getElementById("interestRate");
  const mortgageTerm = document.getElementById("mortgageTerm");
  // get value
  const amount = parseFloat(mortgageAmount.value);
  const rate = parseFloat(interestRate.value);
  const term = parseInt(mortgageTerm.value);
  const result = calculateMortgage(amount, rate, term, mortgageType);
  toggleTemplate(true, result);
});
