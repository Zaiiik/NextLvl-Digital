const CONTACT_EMAIL = "";

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const status = document.querySelector("[data-form-status]");
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

document.querySelectorAll("[data-subject]").forEach(link => {
  link.addEventListener("click", () => {
    const input = form?.elements.subject;
    if (input) input.value = link.dataset.subject || "";
  });
});

if (CONTACT_EMAIL) {
  contactEmail.textContent = CONTACT_EMAIL;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll("input, textarea")];
  fields.forEach(field => field.classList.toggle("invalid", !field.checkValidity()));

  if (!form.checkValidity()) {
    status.textContent = "Vérifiez les champs indiqués avant de continuer.";
    status.className = "error";
    fields.find(field => !field.checkValidity())?.focus();
    return;
  }

  if (!CONTACT_EMAIL) {
    status.textContent = "Le formulaire est prêt. Ajoutez l’e-mail de réception pour activer l’envoi.";
    status.className = "error";
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(`[NextLvl Digital] ${data.get("subject")}`);
  const body = encodeURIComponent(`Nom : ${data.get("name")}\nE-mail : ${data.get("email")}\n\n${data.get("message")}`);
  status.textContent = "Ouverture de votre messagerie…";
  status.className = "success";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});

form.querySelectorAll("input, textarea").forEach(field => {
  field.addEventListener("input", () => field.classList.remove("invalid"));
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
  }, { threshold: 0.12, rootMargin: "0px 0px -45px" });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}
