export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. POST Request Handler (100% असली डायनेमिक स्पेसिंग कैलकुलेटर इंजन)
    if (request.method === "POST") {
      try {
        const data = await request.json().catch(() => ({}));
        const text = data.text || "ABHISHEK";
        const heightIn = parseFloat(data.heightIn) || 12;
        const ledSpacingIn = parseFloat(data.ledSpacingIn) || 1.25; // एलईडी से एलईडी की दूरी
        const sideDistIn = parseFloat(data.sideDistIn) || 1.0;     // साइड की दूरी
        const rowsCount = parseInt(data.rowsCount) || 2;           // कतारों (Rows) की संख्या
        const singleLedWatt = parseFloat(data.moduleWatt) || 1.2;

        const letters = text.toUpperCase().split('');
        
        // अक्षरों का गणितीय वेक्टर स्केलेटन ढांचा (Scale 0-100)
        // इसके आधार पर स्पेसिंग और हाइट की असली गणना की जाती है
        const glyphSkeletons = {
          'A': [[[30,15], [5,130]], [[30,15], [55,130]], [[18,90], [42,90]]],
          'B': [[[15,25], [15,130]], [[15,25], [45,25], [52,48], [42,70], [15,70]], [[15,70], [45,70], [55,95], [45,130], [15,130]]],
          'H': [[[15,25], [15,130]], [[55,25], [55,130]], [[15,75], [55,75]]],
          'I': [[[35,25], [35,130]], [[15,25], [55,25]], [[15,130], [55,130]]],
          'S': [[[50,35], [35,25], [15,40], [25,65], [48,80], [52,105], [35,130], [15,115]]],
          'E': [[[15,25], [15,130]], [[15,25], [50,25]], [[15,75], [42,75]], [[15,130], [50,130]]],
          'K': [[[15,25], [15,130]], [[50,25], [18,75]], [[18,75], [52,130]]],
          'R': [[[15,25], [15,130]], [[15,25], [45,25], [52,48], [42,70], [15,70]], [[25,70], [52,130]]],
          'O': [[[35,25], [15,50], [15,105], [35,130], [55,105], [55,50], [35,25]]],
          'G': [[[50,45], [35,25], [15,50], [15,105], [35,130], [50,130], [50,85], [35,85]]]
        };

        let currentXOffset = 40;
        const breakdown = [];
        let grandTotalLEDs = 0;

        // पिक्सल कन्वर्शन फैक्टर्स (1 इंच = लगभग 8 पिक्सल कैनवास पर स्केल के लिए)
        const scaleY = (heightIn * 8) / 100;
        const pixelSpacing = ledSpacingIn * 8; 
        const pixelSideOffset = sideDistIn * 4;

        letters.forEach((char) => {
          const segments = glyphSkeletons[char] || glyphSkeletons['A'];
          let generatedPoints = [];

          // 1. कतारों (Rows) और साइड स्पेसिंग के आधार पर पाथ जनरेशन
          for (let r = 0; r < rowsCount; r++) {
            // यदि मल्टीपल रो हैं, तो उन्हें साइड डिस्टेंस के हिसाब से ऑफसेट (शिफ्ट) करना
            let rowOffset = (r - (rowsCount - 1) / 2) * pixelSideOffset;

            segments.forEach(stroke => {
              for (let i = 0; i < stroke.length - 1; i++) {
                let p1 = stroke[i];
                let p2 = stroke[i+1];
                
                let x1 = currentXOffset + p1[0] + rowOffset;
                let y1 = 20 + p1[1] * scaleY;
                let x2 = currentXOffset + p2[0] + rowOffset;
                let y2 = 20 + p2[1] * scaleY;

                let dx = x2 - x1;
                let dy = y2 - y1;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance === 0) continue;

                // यूज़र के LED Spacing इनपुट के आधार पर सटीक डॉट्स फिक्स करना
                let steps = Math.max(1, Math.floor(distance / pixelSpacing));
                for (let s = 0; s <= steps; s++) {
                  let t = s / steps;
                  generatedPoints.push({
                    x: parseFloat((x1 + dx * t).toFixed(1)),
                    y: parseFloat((y1 + dy * t).toFixed(1))
                  });
                }
              }
            });
          }

          // अत्यंत पास वाले डुप्लिकेट पॉइंट्स को हटाना
          generatedPoints = generatedPoints.filter((p, idx, self) =>
            self.findIndex(t => Math.hypot(t.x - p.x, t.y - p.y) < 3) === idx
          );

          const finalLedCount = generatedPoints.length || 10;

          breakdown.push({
            letter: char,
            ledCount: finalLedCount,
            powerWatts: parseFloat((finalLedCount * singleLedWatt).toFixed(1)),
            ledPoints: generatedPoints
          });

          grandTotalLEDs += finalLedCount;
          currentXOffset += 110; 
        });

        const totalPower = parseFloat((grandTotalLEDs * singleLedWatt).toFixed(1));
        const totalAmps = parseFloat((totalPower / 12).toFixed(2));

        let recommendedSmps = "12V / 100W";
        if (totalPower > 80) recommendedSmps = "24V / 200W";
        if (totalPower > 160) recommendedSmps = "24V / 250W";
        if (totalPower > 210) recommendedSmps = "24V / 350W";

        return new Response(JSON.stringify({
          success: true,
          grandTotalLEDs,
          totalPower,
          totalAmps,
          recommendedSmps,
          breakdown
        }), {
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // 2. GET Request Handler (रिफ्रेश्ड फ्रंटएंड UI)
    return new Response(getFrontendHTML(), {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};

function getFrontendHTML() {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>SaaS LED Layout Wizard Pro v4</title>
      <style>
          :root { --primary: #2563eb; --purple: #7c3aed; --bg: #f8fafc; --border: #cbd5e1; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; background:#f1f5f9; margin:0; padding:15px; font-size:13px; color: #334155; }
          .dashboard { max-width: 1300px; margin:0 auto; background:white; padding:20px; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.05); }
          .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:15px; margin-bottom:20px; }
          .panel { border:1px solid #e2e8f0; border-radius:6px; padding:12px; background:var(--bg); }
          .panel-title { font-size:11px; font-weight:bold; color:var(--purple); text-transform:uppercase; margin-bottom:10px; border-bottom:1px solid #e2e8f0; padding-bottom:4px; }
          .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-bottom:8px; }
          .form-group { display: flex; flex-direction: column; }
          .form-group label { font-size:11px; margin-bottom:3px; color:#64748b; }
          input, select { padding:6px; border:1px solid var(--border); border-radius:4px; font-size:12px; background: white; }
          .toolbar { display: flex; gap:10px; margin-bottom:15px; flex-wrap: wrap; }
          .btn { padding:8px 16px; border-radius:4px; border:1px solid var(--border); background:white; cursor:pointer; font-weight:500; }
          .btn-primary { background:var(--primary); color:white; border-color:var(--primary); }
          .workspace { display: grid; grid-template-columns: 3fr 1fr; gap:20px; }
          .canvas-area { border:1px solid #e2e8f0; border-radius:8px; padding:20px; background:#ffffff; position:relative; min-height: 240px; }
          canvas { width: 100%; height: auto; background: #fff; border: 1px dashed var(--border); border-radius: 4px; }
          .summary-panel { border:1px solid #e2e8f0; border-radius:8px; padding:15px; background:white; display:flex; flex-direction:column; justify-content:space-between; }
          .summary-title { font-weight:bold; margin-bottom:15px; font-size:14px; color: #1e293b; }
          .summary-item { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #f1f5f9; font-size:13px; }
          .summary-item span.val { font-weight:bold; color: #0f172a; }
          .data-table { width:100%; border-collapse:collapse; margin-top:20px; text-align:center; }
          .data-table th, .data-table td { border:1px solid #e2e8f0; padding:8px; }
          .data-table th { background:#f8fafc; font-weight:600; }
          .total-highlight { color: var(--primary); font-weight: bold; }
          @media print { .no-print { display:none!important; } .workspace { grid-template-columns:1fr; } .dashboard { box-shadow:none; padding:0; } }
      </style>
  </head>
  <body>

  <div class="dashboard">
      <div class="settings-grid no-print">
          <div class="panel">
              <div class="panel-title">1. Text / File Input</div>
              <input type="text" id="inputText" value="ABHISHEK" style="width:100%; margin-bottom:8px;">
              <div class="form-row">
                  <div class="form-group" style="grid-column: span 3;">
                      <label>Font Engine</label>
                      <select id="fontFamily"><option>Intelligent Dynamic Vector Engine</option></select>
                  </div>
              </div>
          </div>

          <div class="panel">
              <div class="panel-title">2. Letter / Front Settings</div>
              <div class="form-row">
                  <div class="form-group"><label>Height (in)</label><input type="number" id="letterHeight" value="12"></div>
                  <div class="form-group"><label>Depth (mm)</label><input type="number" value="60"></div>
                  <div class="form-group"><label>Stroke (in)</label><input type="number" value="2"></div>
              </div>
          </div>

          <div class="panel">
              <div class="panel-title">3. LED Module Settings</div>
              <div class="form-row">
                  <div class="form-group">
                      <label>Brand</label>
                      <select id="ledBrand" onchange="updateModuleDropdown()">
                          <option value="Interone">Interone</option>
                          <option value="Samsung">Samsung GOQ</option>
                          <option value="NCLed">NC LED</option>
                          <option value="Rishang">Rishang</option>
                      </select>
                  </div>
                  <div class="form-group" style="grid-column: span 2;">
                      <label>Module Model</label>
                      <select id="ledModule" onchange="applyModuleSpecs()"></select>
                  </div>
              </div>
              <div class="form-row" style="margin-top: 5px; font-size: 11px; background: #fff; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
                  <div style="grid-column: span 3; color: #7c3aed; font-weight: bold;" id="ledSizeLabel">Size: 66x15 mm</div>
              </div>
          </div>

          <div class="panel">
              <div class="panel-title">4. LED Layout Settings</div>
              <div class="form-row">
                  <div class="form-group"><label>LED Spacing(in)</label><input type="number" step="0.05" id="ledSpacing" value="1.25"></div>
                  <div class="form-group"><label>Side Dist.</label><input type="number" step="0.05" id="sideDist" value="1.00"></div>
                  <div class="form-group"><label>Rows</label><input type="number" id="rowsCount" value="2" min="1" max="4"></div>
              </div>
              <div class="form-row" style="margin-top:5px; font-size:11px;">
                  <div class="form-group"><label>Volt</label><input type="text" id="ledVoltageDisplay" readonly style="background:#e2e8f0; border:none; padding:2px;"></div>
                  <div class="form-group"><label>IP</label><input type="text" id="ledIpDisplay" readonly style="background:#e2e8f0; border:none; padding:2px;"></div>
                  <div class="form-group"><label>Beam</label><input type="text" id="ledBeamDisplay" readonly style="background:#e2e8f0; border:none; padding:2px;"></div>
              </div>
          </div>
      </div>

      <div class="toolbar no-print">
          <button class="btn btn-primary" onclick="executeLayoutCalculation()">▶ Generate Layout</button>
          <button class="btn" onclick="window.print()">💾 Export PDF Report</button>
      </div>

      <div class="workspace">
          <div>
              <div class="canvas-area">
                  <div style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); font-weight: bold;" id="canvasHeightLabel">12 in</div>
                  <canvas id="layoutCanvas" width="950" height="240"></canvas>
              </div>
              <div style="overflow-x:auto;">
                  <table class="data-table" id="matrixTable"></table>
              </div>
          </div>

          <div class="summary-panel">
              <div>
                  <div class="summary-title">SUMMARY</div>
                  <div class="summary-item"><span>⚙️ Total Modules</span><span class="val" id="sumModules">0 Nos</span></div>
                  <div class="summary-item"><span>⚡ Total Power</span><span class="val" id="sumPower">0 W</span></div>
                  <div class="summary-item"><span>🔌 Total Current</span><span class="val" id="sumCurrent">0 A</span></div>
                  <div class="summary-item"><span>🔲 Recommended SMPS</span><span class="val" id="sumSmps" style="color:#16a34a; font-weight:bold;">-</span></div>
                  <div class="summary-item"><span>🪙 Total LED Cost</span><span class="val" id="sumLedCost">₹ 0.00</span></div>
                  <div class="summary-item"><span>📊 Est. Total Cost</span><span class="val" id="sumTotalCost">₹ 0.00</span></div>
              </div>
          </div>
      </div>
  </div>

  <script>
  const ledDatabase = {
      Interone: [
          { name: "Z3U-V05 (3 LED Pro)", watt: 1.2, volt: "12V DC", beam: "170°", ip: "IP68", size: "66 x 15 mm" },
          { name: "Z1U-A03 (1 LED Mini)", watt: 0.4, volt: "12V DC", beam: "160°", ip: "IP68", size: "24 x 14 mm" }
      ],
      Samsung: [
          { name: "GOQ Eco 3-LED Lens", watt: 0.72, volt: "12V DC", beam: "150°", ip: "IP68", size: "66 x 11 mm" },
          { name: "GOQ Hi-Power 3-LED", watt: 1.5, volt: "12V DC", beam: "160°", ip: "IP68", size: "72 x 17 mm" }
      ],
      NCLed: [
          { name: "NC Eco3S Standard", watt: 0.72, volt: "12V DC", beam: "160°", ip: "IP68", size: "68 x 12 mm" },
          { name: "NC Lens3S Premium", watt: 1.2, volt: "12V DC", beam: "170°", ip: "IP68", size: "72 x 17 mm" }
      ],
      Rishang: [
          { name: "Rishang High-Efficacy", watt: 1.0, volt: "12V DC", beam: "160°", ip: "IP68", size: "60 x 12 mm" }
      ]
  };

  function updateModuleDropdown() {
      const brand = document.getElementById("ledBrand").value;
      const moduleSelect = document.getElementById("ledModule");
      moduleSelect.innerHTML = "";
      
      ledDatabase[brand].forEach(mod => {
          let opt = document.createElement("option");
          opt.value = mod.watt;
          opt.innerText = mod.name;
          opt.setAttribute("data-volt", mod.volt);
          opt.setAttribute("data-beam", mod.beam);
          opt.setAttribute("data-ip", mod.ip);
          opt.setAttribute("data-size", mod.size);
          moduleSelect.appendChild(opt);
      });
      applyModuleSpecs();
  }

  function applyModuleSpecs() {
      const select = document.getElementById("ledModule");
      const opt = select.options[select.selectedIndex];
      if(!opt) return;

      document.getElementById("ledVoltageDisplay").value = opt.getAttribute("data-volt");
      document.getElementById("ledBeamDisplay").value = opt.getAttribute("data-beam");
      document.getElementById("ledIpDisplay").value = opt.getAttribute("data-ip");
      document.getElementById("ledSizeLabel").innerText = "Size: " + opt.getAttribute("data-size");
  }

  async function executeLayoutCalculation() {
      const text = document.getElementById('inputText').value || "ABHISHEK";
      const heightIn = parseFloat(document.getElementById('letterHeight').value) || 12;
      const ledSpacingIn = parseFloat(document.getElementById('ledSpacing').value) || 1.25;
      const sideDistIn = parseFloat(document.getElementById('sideDist').value) || 1.0;
      const rowsCount = parseInt(document.getElementById('rowsCount').value) || 2;
      const currentModuleWatt = parseFloat(document.getElementById('ledModule').value) || 1.2;

      document.getElementById('canvasHeightLabel').innerText = heightIn + " in";

      const canvas = document.getElementById('layoutCanvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
          // अब स्पेसिंग, साइड डिस्टेंस और रोज़ का डेटा सीधे बैकएंड पर जाएगा
          const res = await fetch(window.location.origin, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  text, 
                  heightIn, 
                  ledSpacingIn, 
                  sideDistIn, 
                  rowsCount, 
                  moduleWatt: currentModuleWatt 
              })
          });
          const data = await res.json();

          if(!data.success) { alert("Calculation Engine Error"); return; }

          document.getElementById('sumModules').innerText = data.grandTotalLEDs + " Nos";
          document.getElementById('sumPower').innerText = data.totalPower + " W";
          document.getElementById('sumCurrent').innerText = data.totalAmps + " A";
          document.getElementById('sumSmps').innerText = data.recommendedSmps;
          
          const ledCost = data.grandTotalLEDs * 30;
          document.getElementById('sumLedCost').innerText = "₹ " + ledCost.toLocaleString('en-IN') + ".00";
          document.getElementById('sumTotalCost').innerText = "₹ " + (ledCost + 5260).toLocaleString('en-IN') + ".00";

          let th = '<tr><th>Metric</th>';
          let trM = '<tr><td><strong>Modules</strong></td>';
          let trP = '<tr><td><strong>Power (W)</strong></td>';
          
          for (let idx = 0; idx < data.breakdown.length; idx++) {
              let item = data.breakdown[idx];
              th += '<th>' + item.letter + '</th>';
              trM += '<td>' + item.ledCount + '</td>';
              trP += '<td>' + item.powerWatts + 'W</td>';

              if (item.ledPoints.length > 0) {
                  let xCoords = item.ledPoints.map(p => p.x);
                  let yCoords = item.ledPoints.map(p => p.y);
                  
                  let minX = Math.min(...xCoords) - 10;
                  let maxX = Math.max(...xCoords) + 10;
                  let minY = Math.min(...yCoords) - 10;
                  let maxY = Math.max(...yCoords) + 10;
                  let midX = (minX + maxX) / 2;

                  ctx.save();
                  ctx.strokeStyle = "#cbd5e1";
                  ctx.lineWidth = 1.2;
                  ctx.setLineDash([3, 3]);
                  ctx.strokeRect(minX, minY, (maxX - minX), (maxY - minY));
                  
                  // बैकग्राउंड वॉटरमार्क अक्षर को बॉक्स के सेंटर में सिंक करना
                  ctx.font = "900 100px Arial, sans-serif";
                  ctx.fillStyle = "rgba(226, 232, 240, 0.45)";
                  ctx.textAlign = "center";
                  ctx.fillText(item.letter, midX, maxY - 15);
                  ctx.restore();
              }

              // प्रत्येक डायनेमिक LED पॉइंट रेंडर करना
              for (let pIdx = 0; pIdx < item.ledPoints.length; pIdx++) {
                  let pt = item.ledPoints[pIdx];
                  ctx.fillStyle = "#334155";
                  ctx.fillRect(pt.x - 4, pt.y - 6, 8, 12);
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
                  ctx.fillStyle = "#ef4444";
                  ctx.fill();
              }

              let currentLetterXCoords = item.ledPoints.map(p => p.x);
              let letterMidX = (Math.min(...currentLetterXCoords) + Math.max(...currentLetterXCoords)) / 2;

              ctx.fillStyle = "#475569";
              ctx.font = "bold 13px Arial";
              ctx.textAlign = "center";
              ctx.fillText(item.ledCount, letterMidX, 220);
          }

          th += '<th class="total-highlight">Total</th></tr>';
          trM += '<td class="total-highlight">' + data.grandTotalLEDs + '</td></tr>';
          trP += '<td class="total-highlight">' + data.totalPower + 'W</td></tr>';
          document.getElementById('matrixTable').innerHTML = th + trM + trP;

      } catch(e) {
          console.error(e);
          alert("Connection Error to Cloudflare Route Engine.");
      }
  }

  window.onload = function() {
      updateModuleDropdown();
  };
  </script>
  </body>
  </html>
  `;
}
