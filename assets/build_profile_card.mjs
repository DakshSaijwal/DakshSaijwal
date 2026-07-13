import { writeFileSync } from "node:fs";

// ---- cat silhouette (trimmed) ----
const ART_RAW = `
                        =                                -
                  %@@@@                                   @@@@#
              =@@@@@@@               @     *               @@@@@@@
            @@@@@@@@@@               @#   @@              #@@@@@@@@@@
          @@@@@@@@@@@@@@+           *@@@@@@@            -@@@@@@@@@@@@@@
        @@@@@@@@@@@@@@@@@@@@@@%-    @@@@@@@@@     .%@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                   #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*
                      @*       %@@@@@@@@@@@@@@@@=        #@
                                  :@@@@@@@@@@:
                                     @@@@@@.
                                      -@@@
                                        +
`;

function trim(raw) {
  let lines = raw.split("\n").map((l) => l.replace(/\s+$/, ""));
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const indents = lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length);
  const left = indents.length ? Math.min(...indents) : 0;
  lines = lines.map((l) => l.slice(left));
  const width = Math.max(0, ...lines.map((l) => l.length));
  return { lines, width };
}

const { lines: ART, width: ART_W } = trim(ART_RAW);

// ---- layout constants ----
const FONT = "'JetBrains Mono','Fira Code',Consolas,monospace";
const FS = 13;
const CW = FS * 0.6; // monospace advance
const LH = FS + 5.5;
const PAD = 24;
const ACCENT = "#ff2d2d";
const YELLOW = "#e6c34d";
const CYAN = "#6fd3e0";
const DIM = "#5a5a5a";
const WHITE = "#eaeaea";
const GREEN = "#7fd28c";
const BG = "#050505";

const catX = PAD + 10;
const catTop = 70;
const catBlockW = ART_W * CW;
const statsX = catX + catBlockW + 46;
const statsW = 380;
const cardW = Math.round(statsX + statsW + PAD);

const STAT_ROWS = [
  { k: "Focus", v: "Always Learning", accent: true },
  { k: "Edu", v: "Mech Engineering @ IIT Kanpur" },
  { k: "Roles", v: "SWE - CP - ML Builder" },
  { k: "Codeforces", v: "Expert - Max 1608" },
  { k: "Languages", v: "C++ - Python - JavaScript" },
  { k: "Web", v: "React - Next.js - Node - Postgres" },
  { k: "ML / CV", v: "TensorFlow - OpenCV - LightGBM" },
  { k: "Ships", v: "Velodrome - Delhi AQI - Linkage" },
];
const CONTACT_ROWS = [
  { k: "GitHub", v: "@DakshSaijwal" },
  { k: "LinkedIn", v: "in/daksh-saijwal" },
  { k: "Email", v: "dakshsaijwal06@gmail.com" },
];

// ---- timing ----
let clock = 0;
const BOOT_START = 0.15;
const BOOT_DUR = 0.9;
const BOOT_FADE = 0.25;
let t = BOOT_START + BOOT_DUR + 0.15; // when boot bar fades out
const CAT_STEP = 0.045;
const catStart = t;
t += ART.length * CAT_STEP + 0.15;
const headerAt = t;
t += 0.08;
const dividerAt = t;
t += 0.08;
const ROW_STEP = 0.055;
const statsStart = t;
t += STAT_ROWS.length * ROW_STEP + 0.1;
const contactHeaderAt = t;
t += 0.08;
const contactDividerAt = t;
t += 0.08;
const contactStart = t;
t += CONTACT_ROWS.length * ROW_STEP;
const TOTAL = t + 0.3;

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fadeText(x, y, text, opts = {}) {
  const { fill = WHITE, weight = "normal", begin = 0, dur = 0.3, size = FS } = opts;
  return `<text x="${x}" y="${y}" fill="${fill}" font-weight="${weight}" font-size="${size}" opacity="0" xml:space="preserve">${esc(
    text
  )}<animate attributeName="opacity" from="0" to="1" begin="${begin.toFixed(2)}s" dur="${dur}s" fill="freeze"/></text>`;
}

// ---- cat lines ----
let catSVG = "";
ART.forEach((line, i) => {
  const y = catTop + i * LH;
  const begin = catStart + i * CAT_STEP;
  catSVG += fadeText(catX, y, line, { fill: "#f2f2f2", begin, size: FS - 1 });
});
const catBottomY = catTop + (ART.length - 1) * LH;

// ---- header block (daksh@github) ----
const headerW = 190;
let headerSVG = `<rect x="${statsX}" y="${40}" width="${headerW}" height="20" rx="3" fill="${ACCENT}" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${headerAt.toFixed(
  2
)}s" dur="0.3s" fill="freeze"/></rect>`;
headerSVG += fadeText(statsX + 8, 40 + 14, "daksh@github", { fill: "#0a0a0a", weight: "bold", begin: headerAt });
const dividerLine = "-".repeat(Math.round(statsW / CW));
headerSVG += fadeText(statsX, 40 + 20 + 16, dividerLine, { fill: DIM, begin: dividerAt });

// ---- stats rows ----
let statsSVG = "";
let rowY = 40 + 20 + 16 + 22;
STAT_ROWS.forEach((row, i) => {
  const begin = statsStart + i * ROW_STEP;
  const label = (row.k + ":").padEnd(12, " ");
  statsSVG += fadeText(statsX, rowY, label, { fill: YELLOW, weight: "bold", begin });
  statsSVG += fadeText(statsX + label.length * CW, rowY, row.v, {
    fill: row.accent ? ACCENT : CYAN,
    weight: row.accent ? "bold" : "normal",
    begin,
  });
  rowY += LH + 3;
});

// ---- contact block ----
rowY += 10;
let contactSVG = `<rect x="${statsX}" y="${rowY - 14}" width="98" height="20" rx="3" fill="${ACCENT}" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${contactHeaderAt.toFixed(
  2
)}s" dur="0.3s" fill="freeze"/></rect>`;
contactSVG += fadeText(statsX + 8, rowY, "Contact", { fill: "#0a0a0a", weight: "bold", begin: contactHeaderAt });
rowY += 20 + 16;
contactSVG += fadeText(statsX, rowY, dividerLine, { fill: DIM, begin: contactDividerAt });
rowY += 22;
CONTACT_ROWS.forEach((row, i) => {
  const begin = contactStart + i * ROW_STEP;
  const label = (row.k + ":").padEnd(12, " ");
  contactSVG += fadeText(statsX, rowY, label, { fill: YELLOW, weight: "bold", begin });
  contactSVG += fadeText(statsX + label.length * CW, rowY, row.v, { fill: WHITE, begin });
  rowY += LH + 3;
});

const cardH = Math.max(catBottomY + PAD + 20, rowY + PAD);

// ---- boot bar ----
const barW = 280;
const barX = Math.round((cardW - barW) / 2);
const barY = Math.round(cardH / 2) - 8;
const bootSVG = `<g>
  <rect x="${barX}" y="${barY}" width="${barW}" height="12" rx="4" fill="none" stroke="#333"/>
  <rect x="${barX}" y="${barY}" width="0" height="12" rx="4" fill="${GREEN}">
    <animate attributeName="width" from="0" to="${barW}" begin="${BOOT_START}s" dur="${BOOT_DUR}s" fill="freeze"/>
  </rect>
  <text x="${cardW / 2}" y="${barY + 34}" fill="${GREEN}" font-weight="bold" text-anchor="middle" xml:space="preserve">&gt; booting daksh_profile...</text>
  <animate attributeName="opacity" from="1" to="0" begin="${(BOOT_START + BOOT_DUR).toFixed(2)}s" dur="${BOOT_FADE}s" fill="freeze"/>
</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardW}" height="${Math.round(
  cardH
)}" viewBox="0 0 ${cardW} ${Math.round(cardH)}" font-family="${FONT}" font-size="${FS}px">
<rect x="0" y="0" width="${cardW}" height="${Math.round(cardH)}" rx="12" fill="${BG}"/>
<rect x="1" y="1" width="${cardW - 2}" height="${Math.round(cardH) - 2}" rx="11" fill="none" stroke="${ACCENT}" stroke-width="1.5" stroke-opacity="0.4"/>
<circle cx="22" cy="18" r="6" fill="#ff5f56"/>
<circle cx="42" cy="18" r="6" fill="#ffbd2e"/>
<circle cx="62" cy="18" r="6" fill="#27c93f"/>
${bootSVG}
${catSVG}
${headerSVG}
${statsSVG}
${contactSVG}
</svg>
`;

const outPath = process.argv[2] || "profile_card.svg";
writeFileSync(outPath, svg);
console.log(`wrote ${outPath}  ${cardW}x${Math.round(cardH)}  total anim ~${TOTAL.toFixed(2)}s`);
