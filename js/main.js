const topBar = document.querySelector("#top-bar");
const exteriorColorSection = document.querySelector("#exterior-buttons");
const interiorColorSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const performanceBtn = document.querySelector("#performance-btn");
const totalPriceElement = document.querySelector("#total-price");
const fullSelfDrivingCheckbox = document.querySelector(
  "#full-self-driving-checkbox"
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
);
const downPaymentElement = document.querySelector("#down-payment");
const monthlyPaymentElement = document.querySelector("#monthly-payment");

const modalSubmit = document.querySelector("#modal-submit");
const priceModal = document.querySelector("#price");
const modalTitle = document.querySelector("#modal-title");
const modalMessage = document.querySelector("#modal-message");
const modalActions = document.querySelector("#modal-actions");
const modalOuterDiv = document.querySelector("#modal-background");
const modalContentDiv = document.querySelector(
  "#modal-submit #modal-items-div"
);

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = "Stealth Grey";
const selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  "Full Self-Driving": false,
};

const pricing = {
  "Performance Wheels": 2500,
  "Performance Package": 5000,
  "Full Self-Driving": 8500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Liners": 225,
  },
};

// Update total price in the UI
const updateTotalPrice = () => {
  // Reset the current price to base price
  currentPrice = basePrice;

  // Performance Wheel Option
  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }

  // Performance Package Option
  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }

  // Full Self Driving Option
  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }

  // Accessory Checkboxes
  accessoryCheckboxes.forEach((checkbox) => {
    // Extract the accessory label
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();
    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    // Add to current price if accessory is selected
    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  // Update the total price in UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;
  updatePaymentBreakdown();
};

// Update payment breakdown based on current price
const updatePaymentBreakdown = () => {
  // Calculate down payment
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  // Calculate loan details (assuming 60-month loan and 3% interest rate)
  const loanTermMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  monthlyPaymentElement.textContent = `$${monthlyPayment
    .toFixed(2) // remove fractional numbers without first two values
    .toLocaleString()}`;
};

// Handle Top Bar On Scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

// Image Mapping
const exteriorImages = {
  "Stealth Grey": "./images/model-y-stealth-grey.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  Quicksilver: "./images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};

// Handle Color Selection
const handleColorButtonClick = (event) => {
  let button;

  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }

  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));
    button.classList.add("btn-selected");

    // Change exterior image
    if (event.currentTarget === exteriorColorSection) {
      selectedColor = button.querySelector("img").alt;
      updateExteriorImage();
    }

    // Change interior image
    if (event.currentTarget === interiorColorSection) {
      const color = button.querySelector("img").alt;
      interiorImage.src = interiorImages[color];
    }
  }
};

// Update exterior image based on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance Wheels"]
    ? "-performance"
    : "";
  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Grey";
  exteriorImage.src = exteriorImages[colorKey].replace(
    ".jpg",
    `${performanceSuffix}.jpg`
  );
};

// Wheel Selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll("#wheel-buttons button");
    buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));

    // Add selected styles to clicked button
    event.target.classList.add("bg-gray-700", "text-white");
    selectedOptions["Performance Wheels"] =
      event.target.textContent.includes("Performance");

    updateExteriorImage();
    updateTotalPrice();
  }
};

// Performance Package Selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");

  // Update selected options
  selectedOptions["Performance Package"] = isSelected;

  updateTotalPrice();
};

// Full Self Driving Selection
const fullSelfDrivingChange = () => {
  selectedOptions["Full Self-Driving"] = fullSelfDrivingCheckbox.checked;
  updateTotalPrice();
};

// Handle Accessory Checkbox Listeners
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => updateTotalPrice());
});

// Initial Update Total Price
updateTotalPrice();

// Handle submit
const handleSubmit = () => {
  priceModal.innerHTML = ` $${currentPrice}`;

  // Add classes for entering transition
  modalSubmit.classList.remove("invisible", "opacity-0", "scale-95");
  modalSubmit.classList.add(
    "opacity-100",
    "scale-100",
    "ease-out",
    "duration-300"
  );
};

// Handle modal cancel
const cancelModal = (event) => {
  // Add classes for leaving transition
  modalSubmit.classList.add("opacity-0", "scale-95", "ease-in", "duration-100");
  modalSubmit.classList.remove("opacity-100", "scale-100");
  setTimeout(() => {
    modalSubmit.classList.add("invisible");
  }, 300);
};

const modalSaveHandler = () => {
  // Update the modal content
  modalTitle.innerText = "Order Confirmed";
  modalMessage.innerHTML =
    "<p>Your Tesla Model Y order has been confirmed!</p>";
  priceModal.innerHTML = ` $${currentPrice}`;

  // Update the buttons to show "OK" instead of "Yes" and "No"
  modalActions.innerHTML = `
  <button
    onclick="closeModal()"
    type="button"
    class="inline-flex w-full justify-center rounded-md px-3 py-2 text-xl hover:text-white shadow-sm bg-gray-400 hover:bg-gray-600 hover:text-white rounded-lg transition-colors duration-300 sm:ml-3 sm:w-auto"
  >
    OK
  </button>
`;
};

// Close modal after confirmation
const closeModal = () => {
  cancelModal();
};

// Event Listeners
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener("change", fullSelfDrivingChange);
modalContentDiv.addEventListener("click", (e) => {
  e.stopPropagation();
});
modalOuterDiv.addEventListener("click", cancelModal);
