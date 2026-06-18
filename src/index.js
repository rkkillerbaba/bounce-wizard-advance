export default {
async fetch(request) {
return new Response(getAppHTML(), {
headers: { "Content-Type": "text/html; charset=utf-8" }
});
}
};
function getAppHTML() {
return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SaaS LED Layout Wizard Pro - Ultimate CAD</title>
<style>
:root { --primary: #2563eb; --purple: #7c3aed; --bg: #f8fafc; --border: #cbd5e1; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background:#f1f5f9; margin:0; padding:15px; font-size:13px; color: #334155; transition: 0.4s; }
.dashboard { max-width: 1400px; margin:0 auto; background:white; padding:20px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.05); }
.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:15px; margin-bottom:20px; }
.panel { border:1px solid #e2e8f0; border-radius:6px; padding:15px; background:var(--bg); }
.panel-title { font-size:12px; font-weight:900; color:var(--purple); text-transform:uppercase; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:6px; }
.form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:10px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-size:11px; margin-bottom:4px; color:#64748b; font-weight:700; }
input, select { padding:8px; border:1px solid var(--border); border-radius:4px; font-size:12px; background: white; outline:none; }
input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }
.toolbar { display: flex; gap:12px; margin-bottom:20px; flex-wrap: wrap; padding:10px; background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; }
.btn { padding:10px 20px; border-radius:6px; border:none; cursor:pointer; font-weight:bold; font-size:13px; transition: 0.3s; display:flex; align-items:center; }
.btn-primary { background:var(--primary); color:white; }
.btn-primary:hover { background:#1d4ed8; }
.btn-glow { background:#1e293b; color:#fbbf24; box-shadow: 0 0 10px rgba(251, 191, 36, 0.2); }
.btn-glow:hover { background:#0f172a; box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); }
.btn-outline { background:white; border:1px solid var(--border); color:#334155; }
.workspace { display: grid; grid-template-columns: 3fr 1fr; gap:20px; }
.canvas-area { border:1px solid #e2e8f0; border-radius:8px; padding:25px; background:#ffffff; overflow-x:auto; }
canvas { background: transparent; }
.summary-panel { border:1px solid #e2e8f0; border-radius:8px; padding:20px; background:white; display:flex; flex-direction:column; justify-content:space-between; }
.summary-title { font-weight:900; margin-bottom:15px; font-size:15px; color: #1e293b; border-bottom:2px solid #f1f5f9; padding-bottom:10px; }
.summary-item { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px dashed #e2e8f0; font-size:13px; }
.summary-item span.val { font-weight:800; color: #0f172a; }
.data-table { width:100%; border-collapse:collapse; margin-top:20px; text-align:center; }
.data-table th, .data-table td { border:1px solid #e2e8f0; padding:10px; }
.data-table th { background:#f8fafc; font-weight:700; color:#1e293b; }
.total-highlight { color: var(--primary); font-weight: 900; background:#f0fdf4 !important; }
/* ✨ 3D GLOW REAL-LIGHTING MODE */
body.dark-mode { background: #020617; color: #cbd5e1; }
body.dark-mode .dashboard { background: #0f172a; border: 1px solid #1e293b; }
body.dark-mode .panel, body.dark-mode .toolbar { background: #1e293b; border-color: #334155; }
body.dark-mode .panel-title { color: #a78bfa; border-color: #334155; }
body.dark-mode label { color: #94a3b8; }
body.dark-mode input, body.dark-mode select { background: #020617; color: white; border-color: #334155; }
body.dark-mode .canvas-area { background: #020617; border-color: #334155; box-shadow: inset 0 0 100px rgba(0,0,0,0.9); }
body.dark-mode .summary-panel { background: #1e293b; border-color: #334155; }
body.dark-mode .summary-title { color: #fff; border-color: #334155; }
body.dark-mode .summary-item span.val { color: #fbbf24; }
body.dark-mode .summary-item { border-color: #334155; }
body.dark-mode .data-table th { background: #0f172a; color: white; border-color: #334155; }
body.dark-mode .data-table td { border-color: #334155; color: #e2e8f0; }
body.dark-mode .total-highlight { background: #064e3b !important; color: #34d399; }
@media print { .no-print { display:none!important; } .workspace { grid-template-columns:1fr; } body, .dashboard { background: white !important; box-shadow:none; padding:0; border:none; } }
</style>
</head>
<body>
<div class="dashboard">
<div class="settings-grid no-print">
<div class="panel">
<div class="panel-title">1. Sign Details</div>
<input type="text" id="inputText" value="RISHI" style="width:100%; margin-bottom:10px; font-weight:bold; letter-spacing:1px;">
<div class="form-row" style="grid-template-columns: 1fr 1fr;">
<div class="form-group"><label>Height (in)</label><input type="number" id="letterHeight" value="12"></div>
<div class="form-group"><label>Stroke Width (in)</label><input type="number" step="0.5" id="strokeWidth" value="2.0"></div>
</div>
</div>
<div class="panel">
<div class="panel-title">2. LED Layout Rules (Spacing)</div>
<div class="form-row">
<div class="form-group"><label>Rows Config</label>
<select id="rowsCount">
<option value="Auto">Auto (By Stroke)</option>
<option value="1">1 Row (Center)</option>
<option value="2">2 Rows (Edges)</option>
<option value="3">3 Rows (Center+Edges)</option>
</select>
</div>
<div class="form-group"><label>Edge Gap (in)</label><input type="number" step="0.1" id="edgeGap" value="0.75"></div>
<div class="form-group"><label>LED Space (in)</label><input type="number" step="0.1" id="ledSpacing" value="1.5"></div>
</div>
</div>
<div class="panel" style="grid-column: span 2;">
<div class="panel-title">3. LED Module Specification</div>
<div class="form-row" style="grid-template-columns: 1.5fr 1.5fr 1fr 1fr;">
<div class="form-group"><label>Brand</label><select id="ledBrand"><option value="Interone">Interone</option><option value="Samsung">Samsung</option></select></div>
<div class="form-group"><label>Model</label><select id="ledModule"><option value="1.2">Z3U-V05 (3-LED, 1.2W)</option><option value="0.4">Z1U-A03 (1-LED, 0.4W)</option></select></div>
<div class="form-group"><label>Voltage</label><input type="text" value="12V DC" readonly style="background:#f1f5f9; border:none;"></div>
<div class="form-group"><label>Physical Size</label><input type="text" value="66 x 15 mm" readonly style="background:#f1f5f9; border:none; color:#16a34a; font-weight:bold;"></div>
</div>
</div>
</div>
<div class="toolbar no-print">
<button class="btn btn-primary" onclick="calculateVectorCAD()">▶ Generate Layout Engine</button>
<button class="btn btn-glow" id="glowBtn" onclick="toggle3DGlow()">✨ Turn On 3D Glow</button>
<button class="btn btn-outline" onclick="window.print()">💾 Export Report</button>
</div>
<div class="workspace">
<div>
<div class="canvas-area">
<div style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-weight: 900; color:#94a3b8; font-size:16px;" id="canvasHeightLabel">12 in</div>
<canvas id="layoutCanvas" height="350"></canvas>
</div>
<div style="overflow-x:auto;">
<table class="data-table" id="matrixTable"></table>
</div>
</div>
<div class="summary-panel">
<div>
<div class="summary-title">BOM & ESTIMATE</div>
<div class="summary-item"><span>⚙️ Total Modules</span><span class="val" id="sumModules">0 Nos</span></div>
<div class="summary-item"><span>⚡ Total Load</span><span class="val" id="sumPower">0 W</span></div>
<div class="summary-item"><span>🔌 Circuit Current</span><span class="val" id="sumCurrent">0 A</span></div>
<div class="summary-item"><span>🔲 Target SMPS</span><span class="val" id="sumSmps" style="color:#10b981; font-weight:900;">-</span></div>
<div class="summary-item" style="margin-top:15px; border-top:2px solid #e2e8f0; padding-top:15px;"><span>🪙 LED Cost Estimate</span><span class="val" id="sumLedCost">₹ 0.00</span></div>
<div class="summary-item"><span>📊 Gross Project Cost</span><span class="val" id="sumTotalCost" style="font-size:15px; color:var(--primary);">₹ 0.00</span></div>
</div>
</div>
</div>
</div>
<script>
let isGlowMode = false;
const SKELETONS = {
'A': [[[50,0], [20,100]], [[50,0], [80,100]], [[30,60], [70,60]]],
'B': [[[20,0], [20,100]], [[20,0], [60,0], [75,10], [80,25], [75,40], [60,50], [20,50]], [[20,50], [65,50], [80,60], [85,75], [80,90], [65,100], [20,100]]],
'C': [[[80,20], [60,0], [30,0], [10,25], [10,75], [30,100], [60,100], [80,80]]],
'D': [[[20,0], [20,100]], [[20,0], [60,0], [80,25], [80,75], [60,100], [20,100]]],
'E': [[[80,0], [20,0], [20,100], [80,100]], [[20,50], [70,50]]],
'F': [[[80,0], [20,0], [20,100]], [[20,50], [70,50]]],
'G': [[[80,20], [60,0], [30,0], [10,25], [10,75], [30,100], [60,100], [80,80], [80,50], [50,50]]],
'H': [[[20,0], [20,100]], [[80,0], [80,100]], [[20,50], [80,50]]],
'I': [[[50,0], [50,100]], [[30,0], [70,0]], [[30,100], [70,100]]],
'J': [[[70,0], [70,80], [50,100], [20,80], [20,60]]],
'K': [[[20,0], [20,100]], [[80,0], [20,50]], [[35,40], [80,100]]],
'L': [[[20,0], [20,100], [80,100]]],
'M': [[[20,100], [20,0], [50,50], [80,0], [80,100]]],
'N': [[[20,100], [20,0], [80,100], [80,0]]],
'O': [[[50,0], [25,10], [10,35], [10,65], [25,90], [50,100], [75,90], [90,65], [90,35], [75,10], [50,0]]],
'P': [[[20,100], [20,0], [60,0], [80,15], [80,35], [60,50], [20,50]]],
'Q': [[[50,0], [25,10], [10,35], [10,65], [25,90], [50,100], [75,90], [90,65], [90,35], [75,10], [50,0]], [[60,70], [90,100]]],
'R': [[[20,100], [20,0], [60,0], [80,15], [80,35], [60,50], [20,50]], [[50,50], [80,100]]],
'S': [[[80,20], [65,0], [35,0], [20,20], [25,40], [40,50], [60,60], [75,80], [60,100], [35,100], [20,80]]],
'T': [[[10,0], [90,0]], [[50,0], [50,100]]],
'U': [[[20,0], [20,80], [40,100], [60,100], [80,80], [80,0]]],
'V': [[[10,0], [50,100]], [[90,0], [50,100]]],
'W': [[[10,0], [30,100], [50,60], [70,100], [90,0]]],
'X': [[[20,0], [80,100]], [[80,0], [20,100]]],
'Y': [[[10,0], [50,50]], [[90,0], [50,50]], [[50,50], [50,100]]],
'Z': [[[10,0], [90,0], [10,100], [90,100]]]
};
function toggle3DGlow() {
isGlowMode = !isGlowMode;
const btn = document.getElementById("glowBtn");
if (isGlowMode) {
document.body.classList.add("dark-mode");
btn.innerHTML = "🌙 Turn Off Glow";
} else {
document.body.classList.remove("dark-mode");
btn.innerHTML = "✨ Turn On 3D Glow";
}
calculateVectorCAD();
}
function calculateVectorCAD() {
const text = document.getElementById('inputText').value.trim().toUpperCase() || "RISHI";
const heightIn = parseFloat(document.getElementById('letterHeight').value) || 12;
const strokeIn = parseFloat(document.getElementById('strokeWidth').value) || 2.0;
const spacingIn = parseFloat(document.getElementById('ledSpacing').value) || 1.5;
const edgeGapIn = parseFloat(document.getElementById('edgeGap').value) || 0.75;
const rowsVal = document.getElementById('rowsCount').value;
const singleLedWatt = parseFloat(document.getElementById('ledModule').value) || 1.2;
document.getElementById('canvasHeightLabel').innerText = heightIn + " in";
let calcRows = 1;
if (rowsVal === 'Auto') {
let availableWidth = strokeIn - (2 * edgeGapIn);
if (availableWidth <= 0) calcRows = 1;
else calcRows = Math.max(1, Math.floor(availableWidth / spacingIn) + 1);
} else {
calcRows = parseInt(rowsVal);
}
let offsetArrIn = [];
if (calcRows === 1) offsetArrIn = [0];
else {
let span = strokeIn - (2 * edgeGapIn);
if (span < 0) span = 0;
let step = span / (calcRows - 1);
for (let r = 0; r < calcRows; r++) {
offsetArrIn.push(-span / 2 + r * step);
}
}
const PPI = 14;
const scaleBase = heightIn * PPI / 100;
const spacingPx = spacingIn * PPI;
const offsetPxArr = offsetArrIn.map(v => v * PPI);
const canvas = document.getElementById('layoutCanvas');
const ctx = canvas.getContext('2d');
canvas.height = (heightIn * PPI) + 120;
let currentX = 60;
let grandTotalLEDs = 0;
let layoutData = [];
for (let i = 0; i < text.length; i++) {
let char = text[i];
if(char === ' ') { currentX += heightIn * PPI * 0.5; continue; }
let segments = SKELETONS[char] || SKELETONS['A'];
let rawPoints = [];
let maxX = 0;
segments.forEach(seg => {
seg.forEach(p => { if (p[0] > maxX) maxX = p[0]; });
let lengths = [];
let totalLen = 0;
let pxSeg = seg.map(p => ({ x: p[0]*scaleBase, y: p[1]*scaleBase }));
for (let j = 0; j < pxSeg.length - 1; j++) {
let l = Math.hypot(pxSeg[j+1].x - pxSeg[j].x, pxSeg[j+1].y - pxSeg[j].y);
lengths.push(l);
totalLen += l;
}
if (totalLen === 0) return;
let numLEDs = Math.max(1, Math.floor(totalLen / spacingPx) + 1);
let margin = (totalLen - (numLEDs - 1) * spacingPx) / 2;
for (let k = 0; k < numLEDs; k++) {
let targetD = margin + k * spacingPx;
let curr = 0;
let segIdx = 0;
while (segIdx < lengths.length && curr + lengths[segIdx] < targetD - 0.001) {
curr += lengths[segIdx];
segIdx++;
}
if (segIdx >= lengths.length) segIdx = lengths.length - 1;
let remain = targetD - curr;
let ratio = lengths[segIdx] === 0 ? 0 : remain / lengths[segIdx];
let lx = pxSeg[segIdx].x + ratio * (pxSeg[segIdx+1].x - pxSeg[segIdx].x);
let ly = pxSeg[segIdx].y + ratio * (pxSeg[segIdx+1].y - pxSeg[segIdx].y);
let angle = Math.atan2(pxSeg[segIdx+1].y - pxSeg[segIdx].y, pxSeg[segIdx+1].x - pxSeg[segIdx].x);
offsetPxArr.forEach(offset => {
let nx = Math.cos(angle - Math.PI/2);
let ny = Math.sin(angle - Math.PI/2);
rawPoints.push({
x: currentX + lx + nx * offset,
y: 60 + ly + ny * offset,
angle: angle
});
});
}
});
let cleanPoints = [];
rawPoints.forEach(p1 => {
let isDup = cleanPoints.some(p2 => Math.hypot(p2.x - p1.x, p2.y - p1.y) < spacingPx * 0.65);
if(!isDup) cleanPoints.push(p1);
});
grandTotalLEDs += cleanPoints.length;
layoutData.push({ letter: char, count: cleanPoints.length, segments: segments, points: cleanPoints, baseX: currentX });
currentX += (maxX * scaleBase) + (heightIn * PPI * 0.3);
}
canvas.width = currentX + 60;
ctx.clearRect(0, 0, canvas.width, canvas.height);
layoutData.forEach(item => {
ctx.save();
ctx.strokeStyle = isGlowMode ? "rgba(255,255,255,0.08)" : "rgba(203, 213, 225, 0.45)";
ctx.lineWidth = strokeIn * PPI;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
item.segments.forEach(seg => {
ctx.beginPath();
seg.forEach((p, idx) => {
let px = item.baseX + p[0] * scaleBase;
let py = 60 + p[1] * scaleBase;
if(idx === 0) ctx.moveTo(px, py);
else ctx.lineTo(px, py);
});
ctx.stroke();
});
ctx.restore();
let ledW = 2.6 * PPI;
let ledH = 0.6 * PPI;
item.points.forEach(pt => {
ctx.save();
ctx.translate(pt.x, pt.y);
ctx.rotate(pt.angle);
ctx.fillStyle = isGlowMode ? "#0f172a" : "#334155";
ctx.fillRect(-ledW/2, -ledH/2, ledW, ledH);
ctx.fillStyle = isGlowMode ? "#ffffff" : "#ef4444";
if (isGlowMode) { ctx.shadowColor = "#ff0000"; ctx.shadowBlur = 12; }
ctx.beginPath(); ctx.arc(-ledW/4, 0, 1.5, 0, Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(0, 0, 1.5, 0, Math.PI*2); ctx.fill();
ctx.beginPath(); ctx.arc(ledW/4, 0, 1.5, 0, Math.PI*2); ctx.fill();
ctx.restore();
});
ctx.fillStyle = isGlowMode ? "#94a3b8" : "#475569";
ctx.font = "bold 13px Arial";
ctx.textAlign = "center";
let letterMidX = item.points.length > 0 ? (Math.min(...item.points.map(p=>p.x)) + Math.max(...item.points.map(p=>p.x))) / 2 : item.baseX;
ctx.fillText(item.count, letterMidX, canvas.height - 20);
});
const totalPower = parseFloat((grandTotalLEDs * singleLedWatt).toFixed(1));
const totalAmps = parseFloat((totalPower / 12).toFixed(2));
const smpsPower = Math.max(100, Math.ceil((totalPower * 1.25) / 100) * 100);
const smps = "12V / " + smpsPower + "W";
document.getElementById('sumModules').innerText = grandTotalLEDs + " Nos";
document.getElementById('sumPower').innerText = totalPower + " W";
document.getElementById('sumCurrent').innerText = totalAmps + " A";
document.getElementById('sumSmps').innerText = smps;
const ledCost = grandTotalLEDs * 25;
document.getElementById('sumLedCost').innerText = "₹ " + ledCost.toLocaleString('en-IN') + ".00";
document.getElementById('sumTotalCost').innerText = "₹ " + (ledCost + 4500).toLocaleString('en-IN') + ".00";
let th = '<tr><th>Metric</th>';
let trM = '<tr><td><strong>Modules</strong></td>';
let trP = '<tr><td><strong>Power (W)</strong></td>';
layoutData.forEach(item => {
th += '<th>' + item.letter + '</th>';
trM += '<td>' + item.count + '</td>';
trP += '<td>' + (item.count * singleLedWatt).toFixed(1) + 'W</td>';
});
th += '<th class="total-highlight">Total</th></tr>';
trM += '<td class="total-highlight">' + grandTotalLEDs + '</td></tr>';
trP += '<td class="total-highlight">' + totalPower + 'W</td></tr>';
document.getElementById('matrixTable').innerHTML = th + trM + trP;
}
window.onload = calculateVectorCAD;
</script>
</body>
</html>
`;
}
