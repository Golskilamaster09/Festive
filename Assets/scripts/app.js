const form = document.querySelector(".invite-form");
const preview = document.querySelector(".preview-card");
const previewImage = document.querySelector(".preview-card__image");
const previewTitle = document.querySelector("#preview-title");
const previewDescription = document.querySelector("#preview-description");
const previewTheme = document.querySelector("#preview-theme");
const previewDate = document.querySelector("#preview-date");
const previewLocation = document.querySelector("#preview-location");
const descriptionInput = document.querySelector("#event-description");
const descriptionCount = document.querySelector("#event-description-count");
const imageInput = document.querySelector("#event-image");
const imageName = document.querySelector("#event-image-name");
const themePreviewImage = "Assets/imgs/Background.png";
const themePreviewImageAlt = "Fatia de bolo colorido com uma vela acesa";
const defaultDescription =
  "Uma ocasião especial merece uma celebração inesquecível.";
let customImageUrl = "";

function formatDateTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${formattedDate} às ${formattedTime}`;
}

function updateEventDetails() {
  const start = formatDateTime(form.querySelector("#event-start").value);
  const end = formatDateTime(form.querySelector("#event-end").value);
  const dateText = [start, end].filter(Boolean).join(" — ");
  const dateContent = previewDate.querySelector("span");
  dateContent.textContent = dateText;
  previewDate.hidden = !dateText;

  const location = form.querySelector("#event-location").value.trim();
  const eventType = form.querySelector('input[name="event-type"]:checked').value;
  const locationContent = previewLocation.querySelector("span");
  const locationIcon = previewLocation.querySelector("img");
  const locationText =
    eventType === "online" ? location || "Evento online" : location;

  locationContent.textContent = locationText;
  locationIcon.src =
    eventType === "online" ? "Assets/imgs/video.png" : "Assets/imgs/building-2.png";
  previewLocation.hidden = !locationText;
}

function updateTextPreview() {
  const title = form.querySelector("#event-title").value.trim();
  const description = descriptionInput.value.trim();

  previewTitle.textContent = title || "Seu próximo grande momento";
  previewDescription.textContent = description || defaultDescription;
  descriptionCount.textContent =
    `${descriptionInput.value.length}/${descriptionInput.maxLength} caracteres`;
  updateEventDetails();
}

function updateColorPreview() {
  const selectedColor = form.querySelector('input[name="color"]:checked');
  if (!selectedColor) return;

  const color = getComputedStyle(selectedColor.nextElementSibling).backgroundColor;
  document.documentElement.style.setProperty("--invite-accent", color);
}

function updateThemePreview(themeInput) {
  previewTheme.textContent = themeInput.closest(".theme-option").querySelector(
    ".theme-card > span",
  ).textContent;
  previewImage.src = themePreviewImage;
  previewImage.alt = themePreviewImageAlt;

  if (customImageUrl) {
    URL.revokeObjectURL(customImageUrl);
    customImageUrl = "";
  }

  imageInput.value = "";
  imageName.textContent = "Nenhum arquivo selecionado";
}

form.addEventListener("input", (event) => {
  if (
    event.target.matches(
      "#event-title, #event-description, #event-start, #event-end, #event-location",
    )
  ) {
    updateTextPreview();
  }
});

form.addEventListener("change", (event) => {
  const target = event.target;

  if (target.matches('input[name="color"]')) {
    updateColorPreview();
  }

  if (target.matches('input[name="theme"]')) {
    updateThemePreview(target);
  }

  if (target.matches('input[name="event-type"]')) {
    updateEventDetails();
  }

  if (target.matches("#background-style")) {
    preview.classList.toggle("preview-card--dark", target.checked);
  }

  if (target.matches("#event-image")) {
    const [file] = target.files;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      target.value = "";
      imageName.textContent = "Selecione um arquivo de imagem";
      return;
    }

    if (customImageUrl) URL.revokeObjectURL(customImageUrl);
    customImageUrl = URL.createObjectURL(file);
    previewImage.src = customImageUrl;
    previewImage.alt = `Imagem selecionada: ${file.name}`;
    imageName.textContent = file.name;
  }
});

updateTextPreview();
updateColorPreview();
updateThemePreview(form.querySelector('input[name="theme"]:checked'));
