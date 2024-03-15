// CLASSES
class Choices {
  constructor() {
    this.addOns = [];
  }

  setName(value) {
    this.name = value;
  }

  setEmail(value) {
    this.email = value;
  }

  setPhoneNumber(value) {
    this.phoneNumber = value;
  }

  setPlan(value) {
    this.plan = value;
  }

  setAddOns(value) {
    this.addOns = value;
  }

  calculate() {
    let sum = 0;
    sum += this.plan.price;
    this.addOns.forEach((addOn) => {
      sum += addOn.price;
    });
    return sum;
  }
}

class Plan {
  constructor(name, price, key) {
    this.name = name;
    this.price = parseInt(price);
    this.key = key;
  }
}

class AddOn {
  constructor(name, price) {
    this.name = name;
    this.price = parseInt(price);
  }
}

// FUNCTIONS
function emailIsValid(input) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(input);
}

function updateStep(value) {
  step += value;
  const steps = document.querySelectorAll(".step");
  steps.forEach((item) => {
    if (parseInt(item.id) === step) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
}

function buildSummarryElements(choices) {
  displaySelectedPlan(choices.plan);
  displaySelectedAddOns(choices.addOns, choices.plan.key);
  displayTotal(choices.calculate(), choices.plan.key);
}

function displaySelectedPlan(plan) {
  const name = document.querySelector(".summary .details .name");
  const price = document.querySelector(
    ".summary .details .selected-plan-price"
  );
  name.textContent = `${plan.name} (${
    plan.key === "month" ? "Monthly" : "Yearly"
  })`;
  price.textContent = `$${plan.price}/${plan.key === "month" ? "mo" : "yr"}`;
}

function displaySelectedAddOns(addons, key) {
  addons.forEach((addOn) => {
    let div = document.createElement("div");
    div.className = "selected-add-on";
    div.innerHTML = `<p class="name">${addOn.name}</p>
    <p class="price">+$${addOn.price}/${key === "month" ? "mo" : "yr"}</p>`;
    document.querySelector(".summary .purchases").appendChild(div);
  });
}

function displayTotal(total, key) {
  const name = document.querySelector(".summary .total .name");
  const price = document.querySelector(".summary .total .price");
  name.textContent = `Total (per ${key})`;
  price.textContent = `+$${total}/${key === "month" ? "mo" : "yr"}`;
}

function resetSummary() {
  const purchases = document.querySelector(".summary .purchases");
  [...purchases.children].forEach((child) => {
    if (!child.classList.contains("details")) {
      child.remove();
    }
  });
}

// LOGIC
let choices = new Choices();
let step = 1;

/* STEP 1 : PERSONLA INFO */
const infoButton = document.querySelector(".info .buttons button");

/* NEXT STEP BUTTON */
infoButton.addEventListener("click", (event) => {
  const form = document.querySelector("#personal-form");
  const name = form.querySelector("#name").value;
  const email = form.querySelector("#email").value;
  const phone = form.querySelector("#phone-number").value;
  let valid = [false, false, false];

  /* CHECK NAME */
  if (name.trim().length === 0) {
    const error = form.querySelector(".name .error-message");
    error.textContent = "The field is required";
    form.querySelector(".name").classList.add("invalid");
    valid[0] = false;
  } else {
    form.querySelector(".name").classList.remove("invalid");
    valid[0] = true;
  }

  /* CHECK EMAIL */
  if (email.trim().length === 0) {
    const error = form.querySelector(".email .error-message");
    error.textContent = "The field is required";
    form.querySelector(".email").classList.add("invalid");
    valid[1] = false;
  } else if (!emailIsValid(email)) {
    const error = form.querySelector(".email .error-message");
    error.textContent = "Please enter a valid email address";
    form.querySelector(".email").classList.add("invalid");
    valid[1] = false;
  } else {
    form.querySelector(".email").classList.remove("invalid");
    valid[1] = true;
  }

  /* CHECK PHONE NUMBER */
  if (phone.trim().length === 0) {
    const error = form.querySelector(".phone .error-message");
    error.textContent = "The field is required";
    form.querySelector(".phone").classList.add("invalid");
    valid[2] = false;
  } else {
    form.querySelector(".phone").classList.remove("invalid");
    valid[2] = true;
  }

  /* MOVE ON TO THE NEXT STEP */
  if (valid.every((value) => value)) {
    /* UPDATE CHOICES */
    choices.setName(name.trim());
    choices.setEmail(email.trim());
    choices.setPhoneNumber(phone.trim());

    document.querySelector(".info").classList.remove("show");
    document.querySelector(".plan").classList.add("show");

    updateStep(1);
  }
});

/* STEP 2 : SELECT PLAN */
const planButtons = document.querySelectorAll(".plan .buttons button");

/* GO BACK BUTTON */
planButtons[0].addEventListener("click", () => {
  document.querySelector(".info").classList.add("show");
  document.querySelector(".plan").classList.remove("show");

  updateStep(-1);
});

/* NEXT STEP BUTTON */
planButtons[1].addEventListener("click", () => {
  /* UPDATE CHOICES */
  choices.setPlan(
    new Plan(
      document.querySelector(".plan .selected .option-name").textContent,
      parseInt(document.querySelector(".plan .selected .price").textContent),
      document.querySelector(".plan").classList.contains("yearly")
        ? "year"
        : "month"
    )
  );

  /* PREPARE ADD-ONS PRICES */
  if (document.querySelector(".plan").classList.contains("yearly")) {
    /* YEARLY */
    const prices = document.querySelectorAll(
      ".add-ons .option > div:last-of-type"
    );
    prices.forEach((element, index) => {
      element.innerHTML =
        "+$" +
        (index === 0
          ? "<span class='price'>10</span>"
          : index === 1
          ? "<span class='price'>20</span>"
          : "<span class='price'>20</span>") +
        "/yr";
    });
  } else {
    /* MONTHLY */
    const prices = document.querySelectorAll(
      ".add-ons .option > div:last-of-type"
    );
    prices.forEach((element, index) => {
      element.innerHTML =
        "+$" +
        (index === 0
          ? "<span class='price'>1</span>"
          : index === 1
          ? "<span class='price'>2</span>"
          : "<span class='price'>2</span>") +
        "/mo";
    });
  }

  /* MOVE ON TO THE NEXT STEP */
  document.querySelector(".plan").classList.remove("show");
  document.querySelector(".add-ons").classList.add("show");

  updateStep(1);
});

/* YEAR-MONTH SWITCH BUTTON */
const YMButton = document.querySelector(".plan .switch");
YMButton.addEventListener("click", () => {
  const paragraphs = document.querySelectorAll(".plan .option > p");
  if (document.querySelector(".plan").classList.contains("yearly")) {
    /* YEARLY PLAN */
    paragraphs.forEach((paragraph, index) => {
      paragraph.innerHTML =
        "$" +
        (index === 0
          ? "<span class='price'>9</span>"
          : index === 1
          ? "<span class='price'>12</span>"
          : "<span class='price'>15</span>") +
        "/mo";
    });
    document.querySelector(".plan").classList.remove("yearly");
  } else {
    /* MONTHLY PLAN */
    paragraphs.forEach((paragraph, index) => {
      paragraph.innerHTML =
        "$" +
        (index === 0
          ? "<span class='price'>90</span>"
          : index === 1
          ? "<span class='price'>120</span>"
          : "<span class='price'>150</span>") +
        "/yr";
    });
    document.querySelector(".plan").classList.add("yearly");
  }
});

/* HIGHLIGHT SELECTED PLAN */
const options = document.querySelectorAll(".plan .option");
[...options].forEach((option) => {
  option.addEventListener("click", (event) => {
    [...options].forEach((option) => {
      if (event.currentTarget === option) {
        option.classList.add("selected");
      } else {
        option.classList.remove("selected");
      }
    });
  });
});

/* STEP 3 : ADD-ONS */
const addOnsButtons = document.querySelectorAll(".add-ons  button");

/* GO BACK BUTTON */
addOnsButtons[0].addEventListener("click", () => {
  document.querySelector(".plan").classList.add("show");
  document.querySelector(".add-ons").classList.remove("show");

  updateStep(-1);
});

/* NEXT STEP BUTTON */
addOnsButtons[1].addEventListener("click", () => {
  let addOns = document.querySelectorAll(".add-ons input:checked");

  /* MODIFY SUMMARY PURCHASES CODE */
  if (addOns.length === 0) {
    /* NO ADD-ONS */
    document.querySelector(".summary .purchases").classList.add("empty");
  } else {
    /* ADD-ON OR MORE */
    document.querySelector(".summary .purchases").classList.remove("empty");
  }

  /* UPDATE CHOICES */
  let parents = Array.from(addOns).map((input) => {
    return input.parentElement;
  });
  let result = [];
  parents.forEach((input) => {
    result.push(
      new AddOn(
        input.querySelector("input").getAttribute("name"),
        input.querySelector(".price").textContent
      )
    );
  });
  choices.setAddOns(result);

  /* MODIFY SUMMARY PURCHASES CODE */
  buildSummarryElements(choices);

  document.querySelector(".add-ons").classList.remove("show");
  document.querySelector(".summary").classList.add("show");

  updateStep(1);
});

/* STEP 3 : SUMMARY */
const summaryButtons = document.querySelectorAll(".summary  .buttons button");

/* GO BACK BUTTON */
summaryButtons[0].addEventListener("click", () => {
  /* RESET SUMMARY */
  resetSummary();

  document.querySelector(".add-ons").classList.add("show");
  document.querySelector(".summary").classList.remove("show");

  updateStep(-1);
});

/* NEXT STEP BUTTON */
summaryButtons[1].addEventListener("click", () => {
  document.querySelector(".thanks").classList.add("show");
  document.querySelector(".summary").classList.remove("show");
});

/* CHANGE PLAN BUTTON */
const change = document.querySelector(".summary .selected-plan p");
change.addEventListener("click", () => {
  /* RESET SUMMARY */
  resetSummary();

  document.querySelector(".plan").classList.add("show");
  document.querySelector(".summary").classList.remove("show");

  updateStep(-2);
});
