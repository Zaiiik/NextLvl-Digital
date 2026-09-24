const CONTACT_EMAIL = "";

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const projectForm = document.querySelector("[data-project-form]");
const contactForm = document.querySelector("[data-contact-form]");
const contactEmail = document.querySelector("[data-contact-email]");

document.querySelector("[data-year]").textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 18);
}

function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Ouvrir le menu");
}

menuButton.addEventListener("click", () => {
  const willOpen = !nav.classList.contains("open");
  nav.classList.toggle("open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Fermer le menu" : "Ouvrir le menu");
});

nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

document.querySelectorAll("[data-project-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const selected = button.dataset.projectFilter;
    document.querySelectorAll("[data-project-filter]").forEach(filter => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll("[data-project-status]").forEach(card => {
      const statuses = card.dataset.projectStatus.split(" ");
      card.classList.toggle("filtered-out", selected !== "all" && !statuses.includes(selected));
    });
  });
});

document.querySelectorAll("[data-quote-type]").forEach(link => {
  link.addEventListener("click", () => {
    const select = projectForm?.elements.projectType;
    if (select) select.value = link.dataset.quoteType || "";
  });
});

if (CONTACT_EMAIL) {
  contactEmail.textContent = CONTACT_EMAIL;
}

function validateForm(form, status) {
  const fields = [...form.querySelectorAll("input, textarea, select")];
  fields.forEach(field => field.classList.toggle("invalid", !field.checkValidity()));
  if (form.checkValidity()) return true;
  status.textContent = "Vérifiez les champs indiqués avant de continuer.";
  status.className = "error";
  fields.find(field => !field.checkValidity())?.focus();
  return false;
}

function prepareEmail(subject, body, status) {
  if (!CONTACT_EMAIL) {
    status.textContent = "Le formulaire est prêt. L’envoi sera activé dès que l’adresse de réception sera configurée.";
    status.className = "error";
    return;
  }
  status.textContent = "Ouverture de votre messagerie…";
  status.className = "success";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

projectForm.addEventListener("submit", event => {
  event.preventDefault();
  const status = projectForm.querySelector("[data-project-form-status]");
  if (!validateForm(projectForm, status)) return;

  const data = new FormData(projectForm);
  const details = [
    `Nom : ${data.get("name")}`,
    `E-mail : ${data.get("email")}`,
    `Société / activité : ${data.get("company") || "Non renseigné"}`,
    `Type de projet : ${data.get("projectType")}`,
    `Budget approximatif : ${data.get("budget") || "Non renseigné"}`,
    `Délai souhaité : ${data.get("timeline") || "Non renseigné"}`,
    `Contact préféré : ${data.get("preferredContact") || "E-mail"}`,
    "",
    "Description du projet :",
    data.get("description")
  ];
  prepareEmail(`[Demande de devis] ${data.get("projectType")}`, details.join("\n"), status);
});

contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const status = contactForm.querySelector("[data-contact-status]");
  if (!validateForm(contactForm, status)) return;
  const data = new FormData(contactForm);
  const body = `Nom : ${data.get("name")}\nE-mail : ${data.get("email")}\n\n${data.get("message")}`;
  prepareEmail(`[Contact NextLvl Digital] ${data.get("subject")}`, body, status);
});

document.querySelectorAll(".project-form input, .project-form textarea, .project-form select, .contact-form input, .contact-form textarea").forEach(field => {
  field.addEventListener("input", () => field.classList.remove("invalid"));
  field.addEventListener("change", () => field.classList.remove("invalid"));
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduceMotion || !("IntersectionObserver" in window)) {
  document.querySelectorAll(".reveal").forEach(element => element.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -35px" });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}
