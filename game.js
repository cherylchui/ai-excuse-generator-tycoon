const GOAL_HYPE = 1000;

const EXCUSES = [
  { tag: "Late Homework", text: "\"The AI ate my chart and then asked me for a raise.\"" },
  { tag: "Slow Wi-Fi", text: "\"Our data packets stopped to take a coffee break in the cloud.\"" },
  { tag: "Missed Meeting", text: "\"I was busy teaching the calendar bot how to tell time.\"" },
  { tag: "Buggy App", text: "\"It's not a bug—it's a surprise feature waiting for the right prompt.\"" },
  { tag: "Late Delivery", text: "\"The shipping robot took a scenic detour to look at nice trees.\"" },
  { tag: "Empty Slide", text: "\"This slide uses invisible ink to save company screen energy.\"" }
];

const UPGRADES = [
  {
    id: "buzzwords",
    name: "Fancy Buzzword Pack",
    desc: "+10 Hype per click",
    cost: 40,
    level: 0,
    clickBonus: 10,
    autoBonus: 0
  },
  {
    id: "intern_bot",
    name: "Helper Excuse Bot",
    desc: "+8 Hype every second",
    cost: 80,
    level: 0,
    clickBonus: 0,
    autoBonus: 8
  },
  {
    id: "spin_doctor",
    name: "Smooth Talker Upgrade",
    desc: "+25 Hype per click & +15/sec",
    cost: 220,
    level: 0,
    clickBonus: 25,
    autoBonus: 15
  }
];

let hype = 0;
let baseClick = 10;
let wonShown = false;

const hypeText = document.getElementById("hype-text");
const perClickText = document.getElementById("per-click-text");
const autoText = document.getElementById("auto-text");
const progressText = document.getElementById("progress-text");
const btnGenerate = document.getElementById("btn-generate");
const excuseBox = document.getElementById("excuse-box");
const excuseTag = document.getElementById("excuse-tag");
const excuseText = document.getElementById("excuse-text");
const excuseGain = document.getElementById("excuse-gain");
const upgradesList = document.getElementById("upgrades-list");
const winBanner = document.getElementById("win-banner");
const btnReset = document.getElementById("btn-reset");

function getClickPower() {
  const bonus = UPGRADES.reduce((sum, u) => sum + u.level * u.clickBonus, 0);
  return baseClick + bonus;
}

function getAutoPower() {
  return UPGRADES.reduce((sum, u) => sum + u.level * u.autoBonus, 0);
}

function updateUI() {
  const clickPower = getClickPower();
  const autoPower = getAutoPower();
  const pct = Math.min(100, Math.floor((hype / GOAL_HYPE) * 100));

  hypeText.textContent = hype;
  perClickText.textContent = `+${clickPower}`;
  autoText.textContent = `+${autoPower}/s`;
  progressText.textContent = `${pct}%`;

  if (hype >= GOAL_HYPE && !wonShown) {
    wonShown = true;
    winBanner.classList.remove("hidden");
  }

  renderUpgrades();
}

function renderUpgrades() {
  upgradesList.innerHTML = UPGRADES.map((u) => {
    const canAfford = hype >= u.cost;
    return `
      <div class="upgrade-item">
        <div>
          <div class="upgrade-title">${u.name} (Lv. ${u.level})</div>
          <div class="upgrade-desc">${u.desc}</div>
        </div>
        <button
          class="upgrade-btn"
          data-id="${u.id}"
          ${canAfford ? "" : "disabled"}
        >
          Buy (${u.cost})
        </button>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".upgrade-btn").forEach((btn) => {
    btn.addEventListener("click", () => buyUpgrade(btn.dataset.id));
  });
}

function buyUpgrade(id) {
  const upgrade = UPGRADES.find((u) => u.id === id);
  if (!upgrade || hype < upgrade.cost) return;

  hype -= upgrade.cost;
  upgrade.level += 1;
  upgrade.cost = Math.round(upgrade.cost * 1.5);
  updateUI();
}

function generateExcuse() {
  const gain = getClickPower();
  const pick = EXCUSES[Math.floor(Math.random() * EXCUSES.length)];

  hype += gain;
  excuseBox.classList.remove("hidden");
  excuseTag.textContent = pick.tag;
  excuseText.textContent = pick.text;
  excuseGain.textContent = `+${gain} Hype earned!`;

  updateUI();
}

setInterval(() => {
  const autoGain = getAutoPower();
  if (autoGain > 0) {
    hype += autoGain;
    updateUI();
  }
}, 1000);

btnGenerate.addEventListener("click", generateExcuse);

btnReset.addEventListener("click", () => {
  hype = 0;
  wonShown = false;
  UPGRADES[0].level = 0;
  UPGRADES[0].cost = 40;
  UPGRADES[1].level = 0;
  UPGRADES[1].cost = 80;
  UPGRADES[2].level = 0;
  UPGRADES[2].cost = 220;
  excuseBox.classList.add("hidden");
  winBanner.classList.add("hidden");
  updateUI();
});

updateUI();
