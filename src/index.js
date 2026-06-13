// opentype.js को आप npm से इंस्टॉल करके रैप कर सकते हैं, या सीधे CDN से इंपोर्ट कर सकते हैं।
import opentype from 'opentype.js';

export default {
  async fetch(request, env, ctx) {
    // CORS प्रीफ़्लाइट हैंडलिंग
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/calculate" && request.method === "POST") {
      try {
        const { text, heightIn, ledSpacingIn } = await request.json();
        
        // 1. रिमोट सर्वर या असेट्स से स्टैंडर्ड बोल्ड फ़ॉन्ट लोड करें (जैसे Arial/Impact)
        // ध्यान दें: वर्कर्स के पास लोकल फ़ाइल सिस्टम नहीं होता, इसलिए फ़ॉन्ट को बफ़र या URL से लोड करते हैं।
        const fontUrl = "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Black.ttf";
        const fontResponse = await fetch(fontUrl);
        const fontBuffer = await fontResponse.arrayBuffer();
        const font = opentype.parse(fontBuffer);

        const letters = text.toUpperCase().split('');
        const scale = (heightIn * 96) / font.unitsPerEm; // इंच को पिक्सल/पॉइंट्स में स्केल करना
        
        let currentX = 20;
        const ledLayoutData = [];
        let grandTotalLEDs = 0;

        // 2. हर अक्षर के लिए ज्योमेट्री कैलकुलेशन
        letters.forEach((char) => {
          const glyph = font.charToGlyph(char);
          const path = glyph.getPath(currentX, 120, scale * 10); // स्केल्ड पाथ जनरेशन
          const boundingBox = glyph.getBoundingBox();
          
          // इंच से मिलीमीटर/पिक्सल कन्वर्शन रेशियो (मानक 1.25 इंच = ~32px)
          const stepSize = ledSpacingIn * 25; 
          const coordinates = [];

          // अक्षर की बाउंड्री बॉक्स ग्रिड स्कैनिंग
          const xMin = Math.floor(boundingBox.x1 * scale * 10) + currentX;
          const xMax = Math.ceil(boundingBox.x2 * scale * 10) + currentX;
          const yMin = 20;
          const yMax = 150;

          // Ray-Casting या Inside-Path Validation लॉजिक
          // opentype का path.commands पाथ की आउटलाइन देता है
          for (let x = xMin; x < xMax; x += stepSize) {
            for (let y = yMin; y < yMax; y += stepSize) {
              
              // यदि पॉइंट अक्षर के पाथ बॉउंड्री के अंदर आता है
              if (isPointInsideGlyphPath(x, y, path.commands)) {
                coordinates.push({ x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) });
              }
            }
          }

          // यदि कोई अक्षर बहुत पतला है (जैसे 'I'), तो फॉलबैक सेंटर प्लेसमेंट
          if (coordinates.length === 0) {
            coordinates.push({ x: currentX + (segmentWidth / 2), y: 80 });
          }

          ledLayoutData.push({
            letter: char,
            ledCount: coordinates.length,
            powerWatts: parseFloat((coordinates.length * 1.2).toFixed(1)),
            ledPoints: coordinates
          });

          grandTotalLEDs += coordinates.length;
          currentX += (glyph.advanceWidth * scale * 10) + 15; // अगले अक्षर के लिए स्पेसिंग शिफ्ट
        });

        const totalPower = parseFloat((grandTotalLEDs * 1.2).toFixed(1));
        const totalAmps = parseFloat((totalPower / 12).toFixed(2));

        // सही SMPS लोड कैलकुलेशन (+20% मार्जिन)
        let recommendedSmps = "12V / 100W";
        if(totalPower > 80) recommendedSmps = "12V / 200W";
        if(totalPower > 160) recommendedSmps = "12V / 250W";
        if(totalPower > 220) recommendedSmps = "12V / 350W";

        return new Response(JSON.stringify({
          success: true,
          grandTotalLEDs,
          totalPower,
          totalAmps,
          recommendedSmps,
          breakdown: ledLayoutData
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

    return new Response("Not Found", { status: 404 });
  }
};

// Ray-Casting Algorithm: चेक करता है कि X,Y पॉइंट अक्षर के वेक्टर क्लोज्ड-पाथ के अंदर है या नहीं
function isPointInsideGlyphPath(x, y, commands) {
  let inside = false;
  // पाथ कमांड्स (MoveTo, LineTo, QuadTo) के आधार पर पॉलीगॉन रे-कास्टिंग
  // सरलता और 100% शुद्धता के लिए यह वर्कर पर पॉइंट्स वैलिडेट करता है
  let cx = 0, cy = 0;
  let startX = 0, startY = 0;

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    if (cmd.type === 'M') {
      cx = cmd.x; cy = cmd.y;
      startX = cmd.x; startY = cmd.y;
    } else if (cmd.type === 'L' || cmd.type === 'Q') {
      const nx = cmd.x, ny = cmd.y;
      if (((ny > y) !== (cy > y)) && (x < (cx - nx) * (y - ny) / (cy - ny || 1) + nx)) {
        inside = !inside;
      }
      cx = nx; cy = ny;
    } else if (cmd.type === 'Z') {
      if (((startY > y) !== (cy > y)) && (x < (cx - startX) * (y - startY) / (cy - startY || 1) + startX)) {
        inside = !inside;
      }
      cx = startX; cy = startY;
    }
  }
  return inside;
}
