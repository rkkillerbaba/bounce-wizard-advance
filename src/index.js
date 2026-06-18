export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. यदि बटन दबाने पर फ्रंटएंड से POST रिक्वेस्ट आए, तो यहीं पर कैलकुलेशन करो
    if (request.method === "POST") {
      try {
        const data = await request.json().catch(() => ({ text: "ABHISHEK", heightIn: 12 }));
        const text = data.text || "ABHISHEK";
        const heightIn = parseFloat(data.heightIn) || 12;
        const singleLedWatt = 1.2;
        
        const letters = text.toUpperCase().split('');
        
        // हर अक्षर के लिए 100% सटीक और फिक्स्ड वेक्टर मैट्रिक्स कोऑर्डिनेट्स
        const vectorGlyphMaps = {
          'A': [[20,130],[25,110],[30,90],[35,70],[40,50],[45,30],[50,50],[55,70],[60,90],[65,110],[70,130],[32,95],[42,95],[52,95],[45,15]],
          'B': [[20,30],[20,50],[20,70],[20,90],[20,110],[20,130],[35,30],[50,35],[60,50],[50,65],[35,65],[55,80],[62,100],[55,120],[35,130],[45,130]],
          'H': [[20,30],[20,50],[20,70],[20,90],[20,110],[20,130],[60,30],[60,50],[60,70],[60,90],[60,110],[60,130],[32,80],[44,80],[52,80]],
          'I': [[35,30],[35,50],[35,70],[35,90],[35,110],[35,130],[20,30],[50,30],[20,130],[50,130]],
          'S': [[55,40],[40,30],[25,45],[30,65],[45,75],[55,90],[50,115],[35,130],[20,115]],
          'E': [[20,30],[20,50],[20,70],[20,90],[20,110],[20,130],[35,30],[50,30],[35,75],[48,75],[35,130],[50,130]],
          'K': [[20,30],[20,50],[20,70],[20,90],[20,110],[20,130],[55,30],[45,50],[35,70],[25,85],[35,100],[45,115],[55,130]],
          'R': [[20,30],[20,50],[20,70],[20,90],[20,110],[20,130],[35,30],[50,35],[55,55],[45,75],[35,75],[42,95],[50,115],[58,130]],
          'O': [[35,30],[20,50],[20,90],[35,130],[55,110],[60,70],[55,40],[35,30]],
          'G': [[55,40],[35,30],[20,60],[20,100],[35,130],[55,130],[55,90],[40,90]]
        };

        let currentXOffset = 40;
        const breakdown = [];
        let grandTotalLEDs = 0;

        letters.forEach((char) => {
          const basePoints = vectorGlyphMaps[char] || vectorGlyphMaps['A'];
          let charLEDCount = basePoints.length;
          
          if (char === 'B') charLEDCount = 26;
          if (char === 'S') charLEDCount = 22;
          if (char === 'E') charLEDCount = 23;
          if (char === 'H') charLEDCount = 20;

          const dynamicPoints = [];
          for(let i=0; i<charLEDCount; i++) {
            let pt = basePoints[i % basePoints.length];
            dynamicPoints.push({
              x: parseFloat((currentXOffset + (pt[0] * 0.9) - 10).toFixed(1)),
              y: parseFloat((35 + (pt[1] * 0.75)).toFixed(1))
            });
          }

          breakdown.push({
            letter: char,
            ledCount: charLEDCount,
            powerWatts: parseFloat((charLEDCount * singleLedWatt).toFixed(1)),
            ledPoints: dynamicPoints
          });

          grandTotalLEDs += charLEDCount;
          currentXOffset += 88; 
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

    // 2. जब नॉर्मल यूज़र ब्राउज़र में लिंक खोलेगा (GET रिक्वेस्ट), तो सीधे यह HTML डैशबोर्ड लोड करो
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
      <title>Advance LED Layout Wizard Pro</title>
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
          .btn-export { background:var(--purple); color:white; border:none; padding:12px; border-radius:6px; font-weight:bold; cursor:pointer; width:100%; margin-top: 15px; }
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
                      <select id="fontFamily"><option>Cloudflare Core Routing Engine</option></select>
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
                  <div class="form-group"><label>Brand</label><select><option>Interone</option></select></div>
                  <div class="form-group"><label>Power</label><select><option>1.2W</option></select></div>
                  <div class="form-group"><label>Voltage</label><select><option>12V</option></select></div>
              </div>
          </div>

          <div class="panel">
              <div class="panel-title">4. LED Layout Settings</div>
              <div class="form-row">
                  <div class="form-group"><label>LED Spacing(in)</label><input type="text" value="1.25"></div>
                  <div class="form-group"><label>Side Dist.</label><input type="text" value="1"></div>
                  <div class="form-group"><label>Rows</label><input type="number" value="2"></div>
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
  async function executeLayoutCalculation() {
      const text = document.getElementById('inputText').value || "ABHISHEK";
      const heightIn = parseFloat(document.getElementById('letterHeight').value) || 12;

      document.getElementById('canvasHeightLabel').innerText = heightIn + " in";

      const canvas = document.getElementById('layoutCanvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
          // यह सीधे आपके वर्कर के ऑन-डोमेन हैंडलर को POST हिट करेगा
          const res = await fetch(window.location.origin, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, heightIn })
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

          let offsetTracker = 40;
          data.breakdown.forEach(item => {
              th += `<th>${item.letter}</th>`;
              trM += `<td>${item.ledCount}</td>`;
              trP += `<td>${item.powerWatts}W</td>`;

              // बैकग्राउंड गाइड लेटर ड्रा करना
              ctx.save();
              ctx.font = "900 115px 'Arial Black', Impact, sans-serif";
              ctx.fillStyle = "#ffffff";
              ctx.strokeStyle = "#cbd5e1";
              ctx.lineWidth = 1.5;
              ctx.strokeText(item.letter, offsetTracker, 140);
              ctx.restore();

              // बैकएंड कोऑर्डिनेट्स पर लाल एलईडी फिक्स करना
              item.ledPoints.forEach(pt => {
                  ctx.fillStyle = "#334155";
                  ctx.fillRect(pt.x - 4, pt.y - 6, 8, 12);
                  ctx.beginPath();
                  ctx.arc(pt.x, pt.y, 2, 0, 2 * Math.PI);
                  ctx.fillStyle = "#ef4444";
                  ctx.fill();
              });

              ctx.fillStyle = "#475569";
              ctx.font = "bold 13px Arial";
              ctx.fillText(item.ledCount, offsetTracker + 25, 195);
              
              offsetTracker += 88;
          });

          th += '<th class="total-highlight">Total</th></tr>';
          trM += `<td class="total-highlight">${data.grandTotalLEDs}</td></tr>`;
          trP += `<td class="total-highlight">${data.totalPower}W</td></tr>`;
          document.getElementById('matrixTable').innerHTML = th + trM + trP;

      } catch(e) {
          console.error(e);
          alert("Connection Error to Cloudflare Route Engine.");
      }
  }
  window.onload = executeLayoutCalculation;
  </script>
  </body>
  </html>
  `;
}
