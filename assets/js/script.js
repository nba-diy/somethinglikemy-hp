document.addEventListener("DOMContentLoaded", () => {

  const multiForm = document.querySelector(".multi-step-form");

  /* ========================= */
  /* FORM-SPECIFIC LOGIC ONLY */
  /* ========================= */

  if (multiForm) {

    const steps = Array.from(multiForm.querySelectorAll(".form-step"));
    const progress = document.getElementById("progress");
    const stepLabel = document.getElementById("stepLabel");

    let currentStep = 0;
    let uploadedFiles = [];

  /* ========================= */
  /* HELPERS */
  /* ========================= */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    input.classList.add("input-error");
    const error = document.createElement("div");
    error.className = "field-error";
    error.textContent = message;
    input.after(error);
  }

  function showStepError(step, message) {
    const existing = step.querySelector(".step-error");
    if (existing) existing.remove();

    const error = document.createElement("div");
    error.className = "step-error";
    error.textContent = message;

    step.appendChild(error);
  }

  function clearErrors(step) {
    step.querySelectorAll(".input-error").forEach(el =>
      el.classList.remove("input-error")
    );
    step.querySelectorAll(".field-error").forEach(el => el.remove());
    step.querySelectorAll(".step-error").forEach(el => el.remove());
  }

  function updateSteps() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    if (progress) {
      progress.style.width =
        ((currentStep + 1) / steps.length) * 100 + "%";
    }

    if (stepLabel) {
      stepLabel.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    }
  }


  /* ========================= */
  /* FILE UPLOAD */
  /* ========================= */

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ["application/pdf", "image/jpeg"];

  const uploadStep = multiForm.querySelector("[data-step='upload']");
  const uploadArea = uploadStep.querySelector(".upload-area");
  const fileInput = uploadArea.querySelector("input[type='file']");
  const uploadError = uploadArea.querySelector(".upload-error");
  const previewList = uploadArea.querySelector(".file-preview");

  /* ---------- Drag & Drop Box (JS styled) ---------- */

  const dropBox = document.createElement("div");
  dropBox.innerHTML = `
    <strong>Drag & drop files here</strong><br>
    <span>or click to choose files</span><br>
    <small>PDF or JPG · Max 10MB</small>
  `;

  Object.assign(dropBox.style, {
    border: "2px dashed #bbb",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "15px",
    background: "#fafafa",
    transition: "all 0.2s ease"
  });

  uploadArea.prepend(dropBox);

  dropBox.addEventListener("click", () => fileInput.click());

  /* ---------- Visibility ---------- */

  uploadArea.style.display = "none";

  function showUploadArea() {
    uploadArea.style.display = "block";
  }

  function hideUploadArea() {
    uploadArea.style.display = "none";
  }


/* === Modern Upload Progress Bar === */
/* === Modern Upload Progress === */

.upload-progress-wrapper {
  max-width: 320px;
  margin: 14px auto 0;
  text-align: center;
  transition: opacity 0.4s ease;
}

.upload-progress {
  height: 8px;
  background: rgba(255,255,255,0.08);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 6px;
}

.upload-progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--page-color),
    rgba(255,255,255,0.7)
  );
  border-radius: 20px;
  transition: width 0.25s ease;
}

.upload-progress-text {
  font-size: 13px;
  color: #ffffff;
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

/* Animated dots */

.upload-dots span {
  animation: blink 1.4s infinite;
  opacity: 0;
}

.upload-dots span:nth-child(1) { animation-delay: 0s; }
.upload-dots span:nth-child(2) { animation-delay: 0.2s; }
.upload-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

/* Success styling */

.upload-success {
  color: var(--page-color);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ✓ pop animation */

.checkmark {
  display: inline-block;
  animation: popIn 0.35s ease forwards;
  transform: scale(0);
}

@keyframes popIn {
  0%   { transform: scale(0); }
  70%  { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Disabled remove button while uploading */

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}


  /* ========================= */
  /* UPLOAD CHOICE */
  /* ========================= */

  const uploadChoices = uploadStep.querySelectorAll(
    "input[name='uploadChoice']"
  );

  function syncUploadChoice() {
    const selected = uploadStep.querySelector(
      "input[name='uploadChoice']:checked"
    );

    uploadError.textContent = "";

    if (selected?.value === "yes") {
      showUploadArea();
    } else {
      hideUploadArea();
    }
  }

  uploadChoices.forEach(choice =>
    choice.addEventListener("change", syncUploadChoice)
  );

  syncUploadChoice();

  /* ========================= */
  /* VALIDATION */
  /* ========================= */

function validateStep(step) {
  clearErrors(step);
  let valid = true;

  const type = step.dataset.step;

  /* STEP 1 – PERSONAL */
  if (type === "personal") {
    const name = step.querySelector("input[name='fullName']");
    const email = step.querySelector("input[name='email']");

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError(name, "Full name must be at least 2 characters");
      valid = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value)) {
      showError(email, "Valid email required");
      valid = false;
    }
  }

  /* ✅ CAREER – STEP 2: SERVICES */
  if (type === "services") {
    const checkboxes = step.querySelectorAll(
      "input[type='checkbox'][name='careerService']"
    );

    const otherService = step.querySelector(
      "input[name='otherCareerService']"
    )?.value.trim();

    const hasChecked = Array.from(checkboxes).some(cb => cb.checked);

    if (!hasChecked && !otherService) {
      showStepError(
        step,
        "Please select at least one service or specify another option."
      );
      valid = false;
    }
  }

  /* ✅ CAREER – STEP 3: EXPERIENCE */
  if (type === "experience") {
    const experience = step.querySelector(
      "select[name='experience']"
    );

    if (!experience.value) {
      showError(experience, "Please select your experience level.");
      valid = false;
    }
  }


  /* ✅ STEP 2 – STUDY (added, page-specific) */
  if (type === "study") {
    const studyLevel = step.querySelector(
      "select[name='studyLevel']"
    );

    if (!studyLevel.value) {
      showError(studyLevel, "Please select a study level.");
      valid = false;
    }
  }

  /* ✅ STEP 3 – FACULTY (added, page-specific) */
  if (type === "faculty") {
    const checkboxes = step.querySelectorAll(
      "input[type='checkbox'][name='faculty']"
    );

    const otherFaculty = step.querySelector(
      "input[name='otherFaculty']"
    )?.value.trim();

    const hasChecked = Array.from(checkboxes).some(cb => cb.checked);

    if (!hasChecked && !otherFaculty) {
      showStepError(
        step,
        "Please select at least one faculty or enter another option."
      );
      valid = false;
    }
  }

  /* STEP 2 – DESTINATION (other page) */
  if (type === "destination") {
    const destination = step.querySelector(
      "select[name='destination']"
    ).value;

    const other = step.querySelector(
      "input[name='otherDestination']"
    ).value.trim();

    if (!destination && !other) {
      showStepError(step, "Please select or specify a destination.");
      valid = false;
    }
  }

  /* STEP 3 – PERMIT (other page) */
  if (type === "permit") {
    const permit = step.querySelector(
      "select[name='permitType']"
    ).value;

    const other = step.querySelector(
      "input[name='otherPermit']"
    ).value.trim();

    if (!permit && !other) {
      showStepError(step, "Please select or specify a permit type.");
      valid = false;
    }
  }

  /* STEP 4 – CITIZENSHIP (other page) */
  if (type === "citizenship") {
    const citizenship = step.querySelector(
      "input[name='citizenship']"
    );

    if (!citizenship.value.trim()) {
      showError(citizenship, "Citizenship is required");
      valid = false;
    }
  }

  /* STEP 5 – UPLOAD */
  if (type === "upload") {
    const choice = step.querySelector(
      "input[name='uploadChoice']:checked"
    );

    if (choice?.value === "yes" && uploadedFiles.length === 0) {
      uploadError.textContent = "Please upload at least one file.";
      valid = false;
    }
  }

  return valid;
}


  /* ========================= */
  /* NAVIGATION */
  /* ========================= */

  multiForm.addEventListener("click", e => {
    const nextBtn = e.target.closest(".next");
    const prevBtn = e.target.closest(".prev");

    if (nextBtn) {
      const step = steps[currentStep];
      if (!validateStep(step)) return;

      let nextIndex = currentStep + 1;

      if (step.dataset.step === "upload") {
        const choice = step.querySelector(
          "input[name='uploadChoice']:checked"
        );
        if (choice?.value === "later") nextIndex++;
      }

      currentStep = Math.min(nextIndex, steps.length - 1);
      updateSteps();
    }

    if (prevBtn) {
      currentStep = Math.max(currentStep - 1, 0);
      updateSteps();
    }
  });

  /* ========================= */
  /* SUBMIT */
  /* ========================= */

  multiForm.addEventListener("submit", e => {
    e.preventDefault();
    multiForm.innerHTML = `
      <div class="form-success-screen">
        <h2>Application Submitted</h2>
        <p>Thank you. We’ll be in touch shortly.</p>
      </div>
    `;
  });

  updateSteps(); }

  /* ===================================================== */
  /* PROCESS CARD FLOAT-IN ANIMATION (GLOBAL)              */
  /* ===================================================== */

  const processCards = document.querySelectorAll(".process-step");

  if (processCards.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active", "visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    processCards.forEach(card => observer.observe(card));
  }

});
