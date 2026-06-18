export default {
  async fetch(request) {
    // हम अब क्लाउडफ्लेयर वर्कर का उपयोग केवल इस शक्तिशाली SaaS टूल को सर्व करने के लिए करेंगे।
    // 100% असली कैलकुलेशन और 3D रेंडरिंग अब यूज़र के ब्राउज़र (Client-side) में बिना किसी लैग के होगी।
    return new Response(getSaaSHTML(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

function getSaaSHTML() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>SaaS LED Layout Wizard Pro - 3D Real Flow</title>
      <style>
          :root { --primary: #2563eb; --purple: #7c3aed; --bg: #f8fafc; --border: #cbd5e1; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; background:#f1f5f9; margin:0; padding:15px; font-size:13px; color: #334155; transition: background 0.5s; }
          .dashboard { max-width: 1400px; margin:0 auto; background:white; padding:20px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.05); transition: 0.5s; }
          .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:15px; margin-bottom:20px; }
          .panel { border:1px solid #e2e8f0; border-radius:6px; padding:15px; background:var(--bg); transition: 0.3s; }
          .panel-title { font-size:12px; font-weight:bold; color:var(--purple); text-transform:uppercase; margin-bottom:12px; border-bottom:1px solid #e2e8f0; padding-bottom:6px; }
          .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:10px; }
          .form-group { display: flex; flex-direction: column; }
          .form-group label { font-size:11px; margin-bottom:4px; color:#64748b; font-weight:600; }
          input, select { padding:8px; border:1px solid var(--border); border-radius:4px; font-size:12px; background: white; outline:none; transition:0.2s; }
          input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }
          .toolbar { display: flex; gap:12px; margin-bottom:20px; flex-wrap: wrap; padding:10px; background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0; }
          .btn { padding:10px 20px; border-radius:6px; border:none; cursor:pointer; font-weight:bold; font-size:13px; transition: 0.3s; display:flex; align-items:center; gap:6px; }
          .btn-primary { background:var(--primary); color:white; box-shadow: 0 2px 5px rgba(37,99,235,0.3); }
          .btn-primary:hover { background:#1d4ed8; }
          .btn-glow { background:#1e293b; color:#fbbf24; border:1px solid #0f172a; box-shadow: 0 0 10px rgba(251, 191, 36, 0.2); }
          .btn-glow:hover { background:#0f172a; box-shadow: 0 0 20px rgba(251, 191, 36, 0.6); }
          .btn-outline { background:white; border:1px solid var(--border); color:#334155; }
          
          .workspace { display: grid; grid-template-columns: 3fr 1fr; gap:20px; }
          .canvas-area { border:1px solid #e2e8f0; border-radius:8px; padding:25px; background:#ffffff; position:relative; min-height: 280px; overflow-x:auto; transition: 0.5s; display:flex; align-items:center; }
          canvas { background: transparent; transition: 0.5s; }
          
          .summary-panel { border:1px solid #e2e8f0; border-radius:8px; padding:20px; background:white; display:flex; flex-direction:column; justify-content:space-between; transition: 0.5s; }
          .summary-title { font-weight:900; margin-bottom:15px; font-size:15px; color: #1e293b; border-bottom:2px solid #f1f5f9; padding-bottom:10px; }
          .summary-item { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px dashed #e2e8f0; font-size:13px; }
          .summary-item span.val { font-weight:800; color: #0f172a; }
          .data-table { width:100%; border-collapse:collapse; margin-top:20px; text-align:center; transition: 0.5s; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
          .data-table th, .data-table td { border:1px solid #e2e8f0; padding:10px; }
          .data-table th { background:#f8fafc; font-weight:700; color:#1e293b; }
          .total-highlight { color: var(--primary); font-weight: 900; background:#f0fdf4 !important; }
          
          /* ✨ 3D GLOW REAL-LIGHTING MODE */
          body.dark-mode { background: #020617; color: #cbd5e1; }
          body.dark-mode .dashboard { background: #0f172a; box-shadow: 0 10px 40px rgba(0,0,0,0.8); border: 1px solid #1e293b; }
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
              <div class="panel-title">1. Text Input</div>
              <input type="text" id="inputText" value="ABHISHEK" style="width:100%; margin-bottom:8px; font-weight:bold; letter-spacing:1px;">
              <div class="form-group"><label>Engine Mode</label><select><option>Real Flow Pixel Scanner</option></select></div>
          </div>
          <div class="panel">
              <div class="panel-title">2. Sign Settings</div>
              <div class="form-row">
                  <div class="form-group"><label>Height (in)</label><input type="number" id="letterHeight" value="12"></div>
                  <div class="form-group"><label>Depth (mm)</label><input type="number" value="60"></div>
              </div>
          </div>
          <div class="panel">
              <div class="panel-title">3. LED Specifications</div>
              <div class="form-row">
                  <div class="form-group"><label>Brand</label><select id="ledBrand" onchange="updateModuleDropdown()"><option value="Interone">Interone</option><option value="Samsung">Samsung</option></select></div>
                  <div class="form-group"><label>Model</label><select id="ledModule"></select></div>
              </div>
          </div>
          <div class="panel">
              <div class="panel-title">4. Real Spacing Control</div>
              <div class="form-row">
                  <div class="form-group"><label>Spacing (in)</label><input type="number" step="0.05" id="ledSpacing" value="1.25"></div>
                  <div class="form-group"><label>Rows (Density)</label><input type="number" id="rowsCount" value="2" min="1"></div>
              </div>
          </div>
      </div>

      <div class="toolbar no-print">
          <button class="btn btn-primary" onclick="calculateRealFlow()">▶ Generate Layout</button>
          <button class="btn btn-glow" id="glowBtn" onclick="toggle3DGlow()">✨ Turn On 3D Glow</button>
          <button class="btn btn-outline" onclick="window.print()">💾 Export PDF Report</button>
      </div>

      <div class="workspace">
          <div>
              <div class="canvas-area">
                  <div style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-weight: 900; color:#94a3b8; font-size:16px;" id="canvasHeightLabel">12 in</div>
                  <canvas id="layoutCanvas" height="280"></canvas>
              </div>
              <div style="overflow-x:auto;">
                  <table class="data-table" id="matrixTable"></table>
              </div>
          </div>

          <div class="summary-panel">
              <div>
                  <div class="summary-title">ESTIMATE SUMMARY</div>
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
  let currentLayoutData = [];

  const ledDatabase = {
      Interone: [{ name: "Z3U-V05 (1.2W)", watt: 1.2 }, { name: "Z1U-A03 (0.4W)", watt: 0.4 }],
      Samsung: [{ name: "GOQ Eco (0.72W)", watt: 0.72 }, { name: "GOQ Pro (1.5W)", watt: 1.5 }]
  };

  function updateModuleDropdown() {
      const brand = document.getElementById("ledBrand").value;
      const moduleSelect = document.getElementById("ledModule");
      moduleSelect.innerHTML = "";
      ledDatabase[brand].forEach(mod => {
          let opt = document.createElement("option");
          opt.value = mod.watt;
          opt.innerText = mod.name;
          moduleSelect.appendChild(opt);
      });
  }

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
      if (currentLayoutData.length > 0) renderCanvas();
  }

  // 100% असली पिक्सल-स्कैनिंग इंजन (यह अक्षरों का आकार कभी बिगड़ने नहीं देगा)
  function calculateRealFlow() {
      const text = document.getElementById('inputText').value.trim() || "ABHISHEK";
      const heightIn = parseFloat(document.getElementById('letterHeight').value) || 12;
      const spacingIn = parseFloat(document.getElementById('ledSpacing').value) || 1.25;
      const rowsCount = parseInt(document.getElementById('rowsCount').value) || 2;
      const singleLedWatt = parseFloat(document.getElementById('ledModule').value) || 1.2;

      document.getElementById('canvasHeightLabel').innerText = heightIn + " in";

      // 1 inch = 12 pixels (स्केलिंग अनुपात)
      const pxHeight = heightIn * 12; 
      const pxSpacingX = spacingIn * 12;
      const pxSpacingY = spacingIn * 12 * (2 / rowsCount); // Rows के आधार पर लंबवत घनत्व

      const canvas = document.getElementById('layoutCanvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // कैनवास की चौड़ाई को टेक्स्ट के अनुसार डायनेमिक सेट करें
      ctx.font = \`900 \${pxHeight}px 'Arial Black', Impact, sans-serif\`;
      const textWidth = ctx.measureText(text).width;
      canvas.width = textWidth + 100;
      canvas.height = pxHeight + 80;

      currentLayoutData = [];
      let grandTotalLEDs = 0;
      let currentX = 30;

      // प्रत्येक कैरेक्टर को अलग-अलग स्कैन करना
      for (let i = 0; i < text.length; i++) {
          let char = text[i];
          let charWidth = ctx.measureText(char).width;
          
          // 1. एक अदृश्य बैकग्राउंड कैनवास बनाएँ जहाँ हम अक्षर का खाका खींचेंगे
          let offCanvas = document.createElement('canvas');
          offCanvas.width = charWidth + 40;
          offCanvas.height = canvas.height;
          let offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
          
          offCtx.font = \`900 \${pxHeight}px 'Arial Black', Impact, sans-serif\`;
          offCtx.fillStyle = "#000000";
          offCtx.textBaseline = "middle";
          // अक्षर को थोड़ा मोटा करने के लिए Stroke भी मारेंगे
          offCtx.lineWidth = rowsCount * 4; 
          offCtx.strokeText(char, 20, offCanvas.height / 2);
          offCtx.fillText(char, 20, offCanvas.height / 2);

          let ledPoints = [];
          let imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;

          // 2. पिक्सल-ग्रिड स्कैनिंग (Real Spacing Logic)
          for (let y = 0; y < offCanvas.height; y += pxSpacingY) {
              for (let x = 0; x < offCanvas.width; x += pxSpacingX) {
                  // थोड़ा सा रैंडम शिफ्ट हनीकॉम्ब पैटर्न (असली लेआउट जैसा) बनाने के लिए
                  let rowOffset = (Math.floor(y / pxSpacingY) % 2 === 0) ? (pxSpacingX / 2) : 0;
                  let scanX = Math.floor(x + rowOffset);
                  
                  if(scanX >= offCanvas.width) continue;

                  let alphaIndex = ((Math.floor(y) * offCanvas.width) + scanX) * 4 + 3;
                  
                  // यदि पिक्सल अक्षर के आकार (Body) के अंदर है
                  if (imgData[alphaIndex] > 128) {
                      ledPoints.push({
                          x: currentX + scanX - 20,
                          y: y
                      });
                  }
              }
          }

          // फॉलबैक अगर अक्षर बहुत पतला है
          if (ledPoints.length === 0 && char !== ' ') {
             ledPoints.push({ x: currentX + charWidth/2, y: canvas.height/2 });
          }

          let charLEDCount = ledPoints.length;
          grandTotalLEDs += charLEDCount;

          currentLayoutData.push({
              letter: char,
              count: charLEDCount,
              power: parseFloat((charLEDCount * singleLedWatt).toFixed(1)),
              points: ledPoints,
              baseX: currentX,
              width: charWidth
          });

          currentX += charWidth + 15; // अगले अक्षर के लिए दूरी
      }

      // अपडेट डैशबोर्ड
      const totalPower = parseFloat((grandTotalLEDs * singleLedWatt).toFixed(1));
      const totalAmps = parseFloat((totalPower / 12).toFixed(2));
      
      let smps = "12V / 100W";
      if (totalPower > 80) smps = "24V / 200W";
      if (totalPower > 160) smps = "24V / 250W";
      if (totalPower > 250) smps = "24V / 400W";
      if (totalPower > 400) smps = "24V / 600W";

      document.getElementById('sumModules').innerText = grandTotalLEDs + " Nos";
      document.getElementById('sumPower').innerText = totalPower + " W";
      document.getElementById('sumCurrent').innerText = totalAmps + " A";
      document.getElementById('sumSmps').innerText = smps;
      
      const ledCost = grandTotalLEDs * 25; // ₹25 per module
      document.getElementById('sumLedCost').innerText = "₹ " + ledCost.toLocaleString('en-IN') + ".00";
      document.getElementById('sumTotalCost').innerText = "₹ " + (ledCost + 4500).toLocaleString('en-IN') + ".00";

      // डेटा टेबल बनाएँ
      let th = '<tr><th>Metric</th>';
      let trM = '<tr><td><strong>Modules</strong></td>';
      let trP = '<tr><td><strong>Power (W)</strong></td>';
      
      currentLayoutData.forEach(item => {
          if(item.letter === ' ') return;
          th += \`<th>\${item.letter}</th>\`;
          trM += \`<td>\${item.count}</td>\`;
          trP += \`<td>\${item.power}W</td>\`;
      });
      
      th += '<th class="total-highlight">Total</th></tr>';
      trM += \`<td class="total-highlight">\${grandTotalLEDs}</td></tr>\`;
      trP += \`<td class="total-highlight">\${totalPower}W</td></tr>\`;
      document.getElementById('matrixTable').innerHTML = th + trM + trP;

      renderCanvas();
  }

  function renderCanvas() {
      const canvas = document.getElementById('layoutCanvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const heightIn = parseFloat(document.getElementById('letterHeight').value) || 12;
      const pxHeight = heightIn * 12;

      // कलर्स मोड के अनुसार
      const strokeCol = isGlowMode ? "rgba(255,255,255,0.15)" : "#cbd5e1";
      const fontFill = isGlowMode ? "rgba(255,255,255,0.05)" : "rgba(226, 232, 240, 0.6)";
      const modBody = isGlowMode ? "#0f172a" : "#334155";
      const textColor = isGlowMode ? "#94a3b8" : "#475569";

      ctx.font = \`900 \${pxHeight}px 'Arial Black', Impact, sans-serif\`;
      ctx.textBaseline = "middle";

      currentLayoutData.forEach(item => {
          if(item.letter === ' ') return;

          // 1. अक्षर की बैकग्राउंड आउटलाइन (परफेक्ट शेप)
          ctx.save();
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeText(item.letter, item.baseX, canvas.height / 2);
          ctx.fillStyle = fontFill;
          ctx.fillText(item.letter, item.baseX, canvas.height / 2);
          ctx.restore();

          // 2. 3D LEDs रेंडर करना
          item.points.forEach(pt => {
              // LED Base
              ctx.fillStyle = modBody;
              ctx.fillRect(pt.x - 3, pt.y - 5, 6, 10);
              
              // LED Light Core & Glow
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
              
              if (isGlowMode) {
                  ctx.fillStyle = "#ffffff";
                  ctx.shadowColor = "#ff0000"; // असली 3D रेड नियॉन ग्लो
                  ctx.shadowBlur = 12;
              } else {
                  ctx.fillStyle = "#ef4444";
                  ctx.shadowBlur = 0;
              }
              ctx.fill();
              ctx.shadowBlur = 0; // Reset
          });

          // 3. काउंट लेबल
          ctx.fillStyle = textColor;
          ctx.font = "bold 13px Arial";
          ctx.textAlign = "center";
          ctx.fillText(item.count, item.baseX + (item.width/2), (canvas.height / 2) + (pxHeight/2) + 20);
      });
  }

  window.onload = function() {
      updateModuleDropdown();
      calculateRealFlow(); // डिफ़ॉल्ट लेआउट तुरंत दिखाएं
  };
  </script>
  </body>
  </html>
  `;
}
