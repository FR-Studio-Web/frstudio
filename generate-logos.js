const fs = require('fs');

// Generates pristine SVG vector matching the user's exact logo image
function buildOfficialLogoSVG(fgColor, bgColor = 'transparent') {
  // fgColor: e.g. '#085233' (green) or '#ffffff' (white)
  const bgRect = bgColor !== 'transparent' 
    ? `<rect width="900" height="270" fill="${bgColor}" />` 
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 270" width="100%" height="100%" aria-label="FR Studio Web Logo">
  ${bgRect}
  <!-- Outer Box Frame (Sharp corners as in original logo) -->
  <rect x="10" y="10" width="880" height="250" fill="none" stroke="${fgColor}" stroke-width="9"/>
  
  <!-- Vertical Divider Line -->
  <line x1="330" y1="10" x2="330" y2="260" stroke="${fgColor}" stroke-width="9"/>
  
  <!-- Horizontal Divider Line -->
  <line x1="330" y1="130" x2="890" y2="130" stroke="${fgColor}" stroke-width="9"/>
  
  <!-- FR Monogram Path (Left Chamber) -->
  <g fill="${fgColor}">
    <!-- Path combining F and R solid shape -->
    <path fill-rule="evenodd" d="
      M 62,40 
      H 232 
      C 278,40 298,62 298,98 
      C 298,126 278,142 248,142 
      L 298,230 
      H 240 
      L 196,152 
      H 158 
      V 230 
      H 112 
      V 152 
      H 88 
      V 230 
      H 42 
      V 68 
      C 42,48 52,40 62,40 
      Z 
      
      M 88,78 
      H 158 
      V 114 
      H 88 
      Z 
      
      M 158,72 
      H 220 
      C 238,72 248,78 248,94 
      C 248,110 238,116 220,116 
      H 158 
      Z
    "/>
  </g>

  <!-- STUDIO WEB Bold Headline -->
  <text x="360" y="98" fill="${fgColor}" font-family="system-ui, -apple-system, 'Plus Jakarta Sans', 'Arial Black', Arial, sans-serif" font-weight="900" font-size="70" letter-spacing="-0.01em">STUDIO WEB</text>

  <!-- Slogan (2 Lines) -->
  <text x="360" y="178" fill="${fgColor}" font-family="system-ui, -apple-system, 'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="25" letter-spacing="-0.01em">Meno cravatte, più codice: la freschezza</text>
  <text x="360" y="218" fill="${fgColor}" font-family="system-ui, -apple-system, 'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="25" letter-spacing="-0.01em">di due ragazzi, la certezza di un sito che funziona</text>
</svg>`;
}

// Write logo files
fs.writeFileSync('assets/img/logo.svg', buildOfficialLogoSVG('#085233', 'transparent'));
fs.writeFileSync('assets/img/logo-white.svg', buildOfficialLogoSVG('#ffffff', 'transparent'));
fs.writeFileSync('assets/img/logo-white-bg.svg', buildOfficialLogoSVG('#085233', '#ffffff'));
fs.writeFileSync('assets/img/logo-green-bg.svg', buildOfficialLogoSVG('#ffffff', '#085233'));

console.log("Generated official SVG logos.");
