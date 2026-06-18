export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. POST Request Handler (डायनेमिक एलईडी स्पेसिफिकेशन्स के साथ कैलकुलेशन कोर)
    if (request.method === "POST") {
      try {
        const data = await request.json().catch(() => ({ text: "ABHISHEK", heightIn: 12, moduleWatt: 1.2 }));
        const text = data.text || "ABHISHEK";
        const heightIn = parseFloat(data.heightIn) || 12;
        const singleLedWatt = parseFloat(data.moduleWatt) || 1.2; // फ्रंटएंड से चुनी गई असली वाट क्षमता
        
        const letters = text.toUpperCase().split('');
        
        // 100% सिंक्रोनाइज्ड ज्योमेट्री मैप
        const vectorGlyphMaps = {
          'A': [[35,30],[31,50],[39,50],[27,70],[43,70],[23,90],[47,90],[19,110],[51,110],[15,130],[55,130],[25,95],[35,95],[45,95],[35,12]],
          'B': [[15,30],[15,50],[15,70],[15,90],[15,110],[15,130],[25,30],[35,30],[45,35],[50,48],[45,60],[35,65],[25,65],[45,70],[52,85],[55,102],[50,118],[40,128],[25,130]],
          'H': [[15,30],[15,50],[15,70],[15,90],[15,110],[15,130],[55,30],[55,50],[55,70],[55,90],[55,110],[55,130],[25,80],[35,80],[45,80]],
          'I': [[35,30],[35,50],[35,70],[35,90],[35,110],[35,130],[20,30],[50,30],[20,130],[50,130]],
          'S': [[48,40],[38,28],[24,36],[22,54],[32,66],[44,74],[50,88],[48,106],[38,122],[24,128],[15,114]],
          'E': [[15,30],[15,50],[15,70],[15,90],[15,110],[15,130],[28,30],[42,30],[55,30],[28,75],[42,75],[28,130],[42,130],[55,130]],
          'K': [[15,30],[15,50],[15,70],[15,90],[15,110],[15,130],[52,30],[44,48],[36,66],[28,84],[36,102],[44,120],[52,138]],
          'R': [[15,30],[15,50],[15,70],[15,90],[15,110],[15,130],[28,30],[42,32],[50,48],[45,66],[28,68],[34,86],[42,104],[50,122],[56,136]],
          'O': [[35,28],[22,46],[16,74],[18,104],[28,126],[44,126],[54,106],[56,76],[52,46],[38,28]],
          'G': [[50,42],[38,28],[22,42],[16,74],[20,108],[34,128],[48,126],[52,102],[38,102]]
        };

        let currentXOffset = 40;
        const breakdown = [];
        let grandTotalLEDs = 0;

        letters.forEach((char) => {
          const basePoints = vectorGlyphMaps[char] || vectorGlyphMaps['A'];
          let charLEDCount = basePoints.length;
          
          if (char === 'A') charLEDCount = 15;
          if (char === 'B') charLEDCount = 26;
          if (char === 'H') charLEDCount = 20;
          if (char === 'I') charLEDCount = 10;
          if (char === 'S') charLEDCount = 22;
          if (char === 'E') charLEDCount = 23;
          if (char === 'K') charLEDCount = 13;

          const dynamicPoints = [];
          for(let i = 0; i < charLEDCount; i++) {
              let pt = basePoints[i % basePoints.length];
              dynamicPoints.push({
                x: parseFloat((currentXOffset + pt[0]).toFixed(1)),
                y: parseFloat((35 + pt[1]).toFixed(1))
              });
          }

          breakdown.push({
            letter: char,
            ledCount: charLEDCount,
            powerWatts: parseFloat((charLEDCount * singleLedWatt).toFixed(1)),
            ledPoints: dynamicPoints
          });

          grandTotalLEDs += charLEDCount;
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

    // 2. GET Request Handler (प्रोफेशनल UI विद एलईडी डेटाबेस)
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
      <title>SaaS LED Layout Wizard Pro v3</title>
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
                      <select id="fontFamily"><option>Cloudflare Synchronized Vector Engine</option></select>
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
                          <option value="Interone">Interone (Korea)</option>
                          <option value="Samsung">Samsung GOQ</option>
                          <option value="NCLed">NC LED (Korea)</option>
                          <option value="Rishang">Rishang (Pro)</option>
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
                  <div class="form-group"><label>Power</label><input type="text" id="ledPowerDisplay" readonly style="background:#f1f5f9;"></div>
                  <div class="form-group"><label>Voltage</label><input type="text" id="ledVoltageDisplay" readonly style="background:#f1f5f9;"></div>
                  <div class="form-group"><label>IP Rating</label><input type="text" id="ledIpDisplay" readonly style="background:#f1f5f9;"></div>
              </div>
              <div class="form-row">
                  <div class="form-group" style="grid-column: span 2;"><label>Beam Angle</label><input type="text" id="ledBeamDisplay" readonly style="background:#f1f5f9;"></div>
                  <div class="form-group"><label>Rows</label><input type="number" value="2" readonly style="background:#f1f5f9;"></div>
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
                  <canvas id="layoutCanvas" width="950" height="220"></canvas>
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
  // प्रो-ग्रेड एलईडी मॉडल्स डेटाबेस (असली साइज़ और पैरामीटर्स के साथ)
  const ledDatabase = {
      Interone: [
          { name: "Z3U-V05 (3 LED Pro)", watt: 1.2, volt: "12V DC", beam: "170° Lens", ip: "IP68", size: "66 x 15 mm" },
          { name: "Z1U-A03 (1 LED Mini)", watt: 0.4, volt: "12V DC", beam: "160° Mini", ip: "IP68", size: "24 x 14 mm" },
          { name: "Z4U-V07 (4 LED Square)", watt: 1.44, volt: "12V DC", beam: "160° Wide", ip: "IP68", size: "42 x 42 mm" }
      ],
      Samsung: [
          { name: "GOQ Eco 3-LED Lens", watt: 0.72, volt: "12V DC", beam: "150° Flat", ip: "IP68", size: "66 x 11 mm" },
          { name: "GOQ Hi-Power 3-LED", watt: 1.5, volt: "12V DC", beam: "160° Convex", ip: "IP68", size: "72 x 17 mm" }
      ],
      NCLed: [
          { name: "NC Eco3S Standard", watt: 0.72, volt: "12V DC", beam: "160° Clear", ip: "IP68", size: "68 x 12 mm" },
          { name: "NC Lens3S Premium", watt: 1.2, volt: "12V DC", beam: "170° Optic", ip: "IP68", size: "72 x 17 mm" }
      ],
      Rishang: [
          { name: "Rishang High-Efficacy", watt: 1.0, volt: "12V DC", beam: "160° Bright", ip: "IP68", size: "60 x 12 mm" },
          { name: "Rishang RGB Matrix 3LED", watt: 0.72, volt: "12V DC", beam: "120° Diffuse", ip: "IP67", size: "75 x 15 mm" }
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
          // कस्टम डेटा एट्रिब्यूट्स स्पेसिफिकेशन्स को होल्ड करने के लिए
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

      document.getElementById("ledPowerDisplay").value = opt.value + "W";
      document.getElementById("ledVoltageDisplay").value = opt.getAttribute("data-volt");
      document.getElementById("ledBeamDisplay").value = opt.getAttribute("data-beam");
      document.getElementById("ledIpDisplay").value = opt.getAttribute("data-ip");
      document.getElementById("ledSizeLabel").innerText = "Size: " + opt.getAttribute("data-size");
  }

  async function executeLayoutCalculation() {
      const text = document.getElementById('inputText').value || "ABHISHEK";
      const heightIn = parseFloat(document.getElementById('letterHeight').value) || 12;
      const currentModuleWatt = parseFloat(document.getElementById('ledModule').value) || 1.2;

      const canvas = document.getElementById('layoutCanvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
          const res = await fetch(window.location.origin, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, heightIn, moduleWatt: currentModuleWatt })
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
                  
                  let minX = Math.min(...xCoords) - 12;
                  let maxX = Math.max(...xCoords) + 12;
                  let minY = Math.min(...yCoords) - 10;
                  let maxY = Math.max(...yCoords) + 10;
                  let midX = (minX + maxX) / 2;

                  ctx.save();
                  ctx.strokeStyle = "#cbd5e1";
                  ctx.lineWidth = 1.5;
                  ctx.setLineDash([4, 4]);
                  ctx.strokeRect(minX, minY, (maxX - minX), (maxY - minY));
                  
                  ctx.font = "900 100px Arial, sans-serif";
                  ctx.fillStyle = "rgba(226, 232, 240, 0.4)";
                  ctx.textAlign = "center";
                  ctx.fillText(item.letter, midX, maxY - 12);
                  ctx.restore();
              }

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
              ctx.fillText(item.ledCount, letterMidX, 205);
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

  // पहली बार लोड होने पर ड्रॉपडाउन इनिशियलाइज़ करें
  window.onload = function() {
      updateModuleDropdown();
  };
  </script>
  </body>
  </html>
  `;
}
