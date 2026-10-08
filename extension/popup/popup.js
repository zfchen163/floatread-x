const toggle = document.getElementById("enabled");
const autoTranslateToggle = document.getElementById("auto-translate");
const focusModeToggle = document.getElementById("focus-mode");
const scheduleEyeCareToggle = document.getElementById("schedule-eyecare");
const scheduleStartInput = document.getElementById("schedule-start");
const scheduleEndInput = document.getElementById("schedule-end");
const themeModeSelect = document.getElementById("theme-mode");
const fontScaleSelect = document.getElementById("font-scale");
const status = document.getElementById("status");

const THEME_LABELS = {
  auto: "跟随 X",
  light: "浅色",
  dim: "熄灯蓝",
  dark: "暗色",
  eyecare: "夜间护眼"
};
const FONT_LABELS = { sm: "小", md: "标准", lg: "大", xl: "更大" };

for (const placeholder of document.querySelectorAll("[data-phosphor-icon]")) {
  const name = placeholder.dataset.phosphorIcon;
  const paths = globalThis.TuzaiPhosphorIcons?.[name];
  if (!paths) continue;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 256 256");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("tuzai-icon");
  svg.innerHTML = paths;
  placeholder.replaceWith(svg);
}

function normalizeTime(value, fallback) {
  return /^\d{2}:\d{2}$/.test(value) ? value : fallback;
}

function render(settings) {
  const enabled = Boolean(settings.enabled);
  const autoTranslate = Boolean(settings.autoTranslate);
  const focusMode = Boolean(settings.focusMode);
  const scheduleEyeCare = settings.scheduleEyeCare !== false;
  const scheduleStart = normalizeTime(settings.scheduleStart, "21:00");
  const scheduleEnd = normalizeTime(settings.scheduleEnd, "07:00");
  const themeMode = THEME_LABELS[settings.themeMode] ? settings.themeMode : "auto";
  const fontScale = FONT_LABELS[settings.fontScale] ? settings.fontScale : "md";

  toggle.checked = enabled;
  autoTranslateToggle.checked = autoTranslate;
  focusModeToggle.checked = focusMode;
  scheduleEyeCareToggle.checked = scheduleEyeCare;
  scheduleStartInput.value = scheduleStart;
  scheduleEndInput.value = scheduleEnd;
  themeModeSelect.value = themeMode;
  fontScaleSelect.value = fontScale;

  if (!enabled) {
    status.textContent = "浮层已关闭";
    return;
  }
  status.textContent = [
    "浮层已开启",
    autoTranslate ? "外语自动中文" : null,
    focusMode ? "默认专注" : null,
    scheduleEyeCare ? `护眼 ${scheduleStart}-${scheduleEnd}` : null,
    `外观 ${THEME_LABELS[themeMode]}`,
    `字号 ${FONT_LABELS[fontScale]}`
  ].filter(Boolean).join(" · ");
}

async function readSettings() {
  const settings = await chrome.storage.sync.get({
    enabled: true,
    autoTranslate: true,
    focusMode: false,
    scheduleEyeCare: true,
    scheduleStart: "21:00",
    scheduleEnd: "07:00",
    themeMode: "auto",
    fontScale: "md"
  });
  render(settings);
}

readSettings();

toggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({ enabled: toggle.checked });
  await readSettings();
});

autoTranslateToggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({ autoTranslate: autoTranslateToggle.checked });
  await readSettings();
});

focusModeToggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({ focusMode: focusModeToggle.checked });
  await readSettings();
});

scheduleEyeCareToggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({ scheduleEyeCare: scheduleEyeCareToggle.checked });
  await readSettings();
});

async function saveScheduleTimes() {
  await chrome.storage.sync.set({
    scheduleStart: normalizeTime(scheduleStartInput.value, "21:00"),
    scheduleEnd: normalizeTime(scheduleEndInput.value, "07:00")
  });
  await readSettings();
}

scheduleStartInput.addEventListener("change", saveScheduleTimes);
scheduleEndInput.addEventListener("change", saveScheduleTimes);

themeModeSelect.addEventListener("change", async () => {
  await chrome.storage.sync.set({ themeMode: themeModeSelect.value });
  await readSettings();
});

fontScaleSelect.addEventListener("change", async () => {
  await chrome.storage.sync.set({ fontScale: fontScaleSelect.value });
  await readSettings();
});
