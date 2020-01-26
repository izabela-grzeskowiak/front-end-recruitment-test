(function() {
  const form = document.querySelector(".checkout");
  const inputs = Array.from(
    document.querySelectorAll("input.mdl-textfield__input")
  );

  const validators = {
    required: {
      pattern: /([^\s])/,
      error: "This field cannot be empty"
    },
    email: {
      pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      error: "Please provide email in correct format"
    },
    onlyLetters: {
      pattern: /^[a-zA-Z]+$/,
      error: "Only letters are allowed"
    },
    onlyDigits: {
      pattern: /^[0-9]+$/,
      error: "Only digits are allowed"
    },
    phone: {
      pattern: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
      error: "Please provide phone number in correct format"
    },
    securityCode: {
      pattern: /^\d{3}$/,
      error: "Please provide security code in correct format"
    },
    expirationDate: {
      pattern: /^((0[1-9])|(1[0-2]))\/(\d{2})$/,
      error: "Please date in format MM/YY"
    },
    creditCardNumber: {
      pattern: /\b(?:\d{4}[ -]?){3}(?=\d{4}\b)/,
      error: "Please provide credit card number in correct format"
    },
    maxLength: maxLength => ({
      pattern: new RegExp(`^[0-9a-zA-Z]{0,${maxLength}}$`),
      error: `Your input is to long, it shouldn't exceed ${maxLength} characters`
    })
  };

  const validationSchema = {
    first_name: [
      validators.required,
      validators.onlyLetters,
      validators.maxLength(25)
    ],
    last_name: [
      validators.required,
      validators.onlyLetters,
      validators.maxLength(30)
    ],
    email: [validators.required, validators.email],
    postal_code: [
      validators.required,
      validators.onlyDigits,
      validators.maxLength(10)
    ],
    phone: [validators.required, validators.phone],
    credit_card_number: [validators.required, validators.creditCardNumber],
    secutity_code: [validators.required, validators.securityCode],
    expiration_date: [validators.required, validators.expirationDate]
  };

  const displayErrorMessage = (error, input) => {
    input.parentElement.classList.add("mdl-textfield--error");
    input.parentElement.insertAdjacentHTML(
      "beforeend",
      `<span class="mdl-textfield__error-message">${error}</span>`
    );
  };

  const cleanErrors = input => {
    if (input.parentElement.classList.contains("mdl-textfield--error")) {
      input.parentElement.classList.remove("mdl-textfield--error");
      input.parentElement
        .querySelector(".mdl-textfield__error-message")
        .remove();
    }
  };

  const isInputValid = input => {
    cleanErrors(input);
    const validationType = input.getAttribute("data-validate");
    const validators = validationSchema[validationType];
    if (!validators) return;
    let errorRegistered = false;

    validators.forEach(({ pattern, error }) => {
      if (!pattern.test(input.value) && !errorRegistered) {
        displayErrorMessage(error, input);
        errorRegistered = true;
      }
    });
    return !errorRegistered;
  };

  const showSuccessMessage = () => {
    document
      .querySelector(".checkout__success-message")
      .classList.add("checkout__success-message--visible");
  };

  if (!form) return;

  inputs.forEach(input => {
    input.addEventListener("blur", () => isInputValid(input));
  });

  form.addEventListener("submit", event => {
    event.preventDefault();

    let inputStatuses = [];

    inputs.forEach(input => inputStatuses.push(isInputValid(input)));
    inputStatuses.every(input => input) ? showSuccessMessage() : "";
  });
})();
