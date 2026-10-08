const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const bookingForm = document.querySelector("#booking-form");
const formResult = document.querySelector("#form-result");
const toast = document.querySelector("#toast");
const dateInput = bookingForm.elements.date;
let toastTimer;

document.querySelector("#year").textContent = new Date().getFullYear();
dateInput.min = new Date().toISOString().slice(0, 10);

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

document.querySelectorAll("[data-prefill]").forEach((link) => {
  link.addEventListener("click", () => {
    bookingForm.elements.service.value = link.dataset.prefill;
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const request = Object.fromEntries(new FormData(bookingForm).entries());
  request.createdAt = new Date().toISOString();

  try {
    const savedRequests = JSON.parse(localStorage.getItem("freshAndSharpRequests") || "[]");
    if (!Array.isArray(savedRequests)) throw new Error("Saved requests have an unexpected format.");
    savedRequests.push(request);
    localStorage.setItem("freshAndSharpRequests", JSON.stringify(savedRequests));
  } catch (error) {
    console.error("Unable to save the service request in this browser.", error);
    formResult.hidden = false;
    formResult.textContent = "We couldn't save your request in this browser. Please try again.";
    return;
  }

  formResult.hidden = false;
  formResult.textContent = `Thanks, ${request.name}. Your ${request.service.toLowerCase()} request for ${request.date} has been saved on this device. The business needs to connect its contact details to receive requests.`;
  bookingForm.reset();
  dateInput.min = new Date().toISOString().slice(0, 10);
});
