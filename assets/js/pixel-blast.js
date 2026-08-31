/* ============================================================================
   PIXEL BLAST — Sfondo animato WebGL
   Port vanilla JS del componente PixelBlast di React Bits (MIT + Commons Clause).
   Richiede Three.js caricato come globale (window.THREE).

   Parametri configurati:
     variant: square · pixelSize: 3 · color: #14261C (Verde Bosco scuro)
     patternScale: 2 · patternDensity: 1.5 · enableRipples: sì
     rippleSpeed: 0.3 · rippleThickness: 0.1 · speed: 0.5
     transparent: sì · edgeFade: 0.5
   ========================================================================== */

(function () {
  'use strict';

  /* ---- configurazione ---------------------------------------------------- */

  var CONFIG = {
    variant:              'square',
    pixelSize:            3,
    color:                '#14261C',
    patternScale:         2,
    patternDensity:       1.35,
    enableRipples:        true,
    rippleSpeed:          0.3,
    rippleThickness:      0.1,
    rippleIntensityScale: 0.8,
    speed:                0.4,
    transparent:          true,
    edgeFade:             0.5
  };

  var SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 };
  var MAX_CLICKS = 10;

  /* ---- shader -------------------------------------------------------------- */

  var VERTEX_SRC = [
    'void main() {',
    '  gl_Position = vec4(position, 1.0);',
    '}'
  ].join('\n');

  var FRAGMENT_SRC = [
    'precision highp float;',
    '',
    'uniform vec3  uColor;',
    'uniform vec2  uResolution;',
    'uniform float uTime;',
    'uniform float uPixelSize;',
    'uniform float uScale;',
    'uniform float uDensity;',
    'uniform float uPixelJitter;',
    'uniform int   uEnableRipples;',
    'uniform float uRippleSpeed;',
    'uniform float uRippleThickness;',
    'uniform float uRippleIntensity;',
    'uniform float uEdgeFade;',
    '',
    'uniform int   uShapeType;',
    'const int SHAPE_SQUARE   = 0;',
    'const int SHAPE_CIRCLE   = 1;',
    'const int SHAPE_TRIANGLE = 2;',
    'const int SHAPE_DIAMOND  = 3;',
    '',
    'const int   MAX_CLICKS = 10;',
    '',
    'uniform vec2  uClickPos  [MAX_CLICKS];',
    'uniform float uClickTimes[MAX_CLICKS];',
    '',
    'float Bayer2(vec2 a) {',
    '  a = floor(a);',
    '  return fract(a.x / 2. + a.y * a.y * .75);',
    '}',
    '#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))',
    '#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))',
    '',
    '#define FBM_OCTAVES     5',
    '#define FBM_LACUNARITY  1.25',
    '#define FBM_GAIN        1.0',
    '',
    'float hash11(float n){ return fract(sin(n)*43758.5453); }',
    '',
    'float vnoise(vec3 p){',
    '  vec3 ip = floor(p);',
    '  vec3 fp = fract(p);',
    '  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));',
    '  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));',
    '  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));',
    '  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));',
    '  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));',
    '  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));',
    '  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));',
    '  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));',
    '  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);',
    '  float x00 = mix(n000, n100, w.x);',
    '  float x10 = mix(n010, n110, w.x);',
    '  float x01 = mix(n001, n101, w.x);',
    '  float x11 = mix(n011, n111, w.x);',
    '  float y0  = mix(x00, x10, w.y);',
    '  float y1  = mix(x01, x11, w.y);',
    '  return mix(y0, y1, w.z) * 2.0 - 1.0;',
    '}',
    '',
    'float fbm2(vec2 uv, float t){',
    '  vec3 p = vec3(uv * uScale, t);',
    '  float amp = 1.0;',
    '  float freq = 1.0;',
    '  float sum = 1.0;',
    '  for (int i = 0; i < FBM_OCTAVES; ++i){',
    '    sum  += amp * vnoise(p * freq);',
    '    freq *= FBM_LACUNARITY;',
    '    amp  *= FBM_GAIN;',
    '  }',
    '  return sum * 0.5 + 0.5;',
    '}',
    '',
    'float maskCircle(vec2 p, float cov){',
    '  float r = sqrt(cov) * .25;',
    '  float d = length(p - 0.5) - r;',
    '  float aa = 0.5 * fwidth(d);',
    '  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));',
    '}',
    '',
    'float maskTriangle(vec2 p, vec2 id, float cov){',
    '  bool flip = mod(id.x + id.y, 2.0) > 0.5;',
    '  if (flip) p.x = 1.0 - p.x;',
    '  float r = sqrt(cov);',
    '  float d  = p.y - r*(1.0 - p.x);',
    '  float aa = fwidth(d);',
    '  return cov * clamp(0.5 - d/aa, 0.0, 1.0);',
    '}',
    '',
    'float maskDiamond(vec2 p, float cov){',
    '  float r = sqrt(cov) * 0.564;',
    '  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);',
    '}',
    '',
    'void main(){',
    '  float pixelSize = uPixelSize;',
    '  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;',
    '  float aspectRatio = uResolution.x / uResolution.y;',
    '',
    '  vec2 pixelId = floor(fragCoord / pixelSize);',
    '  vec2 pixelUV = fract(fragCoord / pixelSize);',
    '',
    '  float cellPixelSize = 8.0 * pixelSize;',
    '  vec2 cellId = floor(fragCoord / cellPixelSize);',
    '  vec2 cellCoord = cellId * cellPixelSize;',
    '  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);',
    '',
    '  float base = fbm2(uv, uTime * 0.05);',
    '  base = base * 0.5 - 0.35;',
    '',
    '  float feed = base + (uDensity - 0.5) * 0.3;',
    '',
    '  float speed     = uRippleSpeed;',
    '  float thickness = uRippleThickness;',
    '  const float dampT     = 1.0;',
    '  const float dampR     = 10.0;',
    '',
    '  if (uEnableRipples == 1) {',
    '    for (int i = 0; i < MAX_CLICKS; ++i){',
    '      vec2 pos = uClickPos[i];',
    '      if (pos.x < 0.0) continue;',
    '      float cellPixelSize = 8.0 * pixelSize;',
    '      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);',
    '      float t = max(uTime - uClickTimes[i], 0.0);',
    '      float r = distance(uv, cuv);',
    '      float waveR = speed * t;',
    '      float ring  = exp(-pow((r - waveR) / thickness, 2.0));',
    '      float atten = exp(-dampT * t) * exp(-dampR * r);',
    '      feed = max(feed, ring * atten * uRippleIntensity);',
    '    }',
    '  }',
    '',
    '  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;',
    '  float bw = step(0.5, feed + bayer);',
    '',
    '  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);',
    '  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;',
    '  float coverage = bw * jitterScale;',
    '  float M;',
    '  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);',
    '  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);',
    '  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);',
    '  else                                   M = coverage;',
    '',
    '  if (uEdgeFade > 0.0) {',
    '    vec2 norm = gl_FragCoord.xy / uResolution;',
    '    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));',
    '    float fade = smoothstep(0.0, uEdgeFade, edge);',
    '    M *= fade;',
    '  }',
    '',
    '  vec3 color = uColor;',
    '',
    '  vec3 srgbColor = mix(',
    '    color * 12.92,',
    '    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,',
    '    step(0.0031308, color)',
    '  );',
    '',
    '  gl_FragColor = vec4(srgbColor, M);',
    '}'
  ].join('\n');

  /* ---- inizializzazione --------------------------------------------------- */

  function init() {
    if (typeof THREE === 'undefined') return;

    var hero = document.querySelector('.hero');
    if (!hero) return;

    /* Rispetta prefers-reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Crea il contenitore e lo inserisce come primo figlio della hero */
    var container = document.createElement('div');
    container.id = 'pixel-blast-bg';
    container.setAttribute('aria-hidden', 'true');
    hero.insertBefore(container, hero.firstChild);

    /* WebGL renderer */
    var renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.domElement.style.width  = '100%';
    renderer.domElement.style.height = '100%';
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    if (CONFIG.transparent) renderer.setClearAlpha(0);
    else renderer.setClearColor(0x000000, 1);

    /* Uniforms */
    var clickIx = 0;
    var uniforms = {
      uResolution:      { value: new THREE.Vector2(0, 0) },
      uTime:            { value: 0 },
      uColor:           { value: new THREE.Color(CONFIG.color) },
      uClickPos:        { value: Array.from({ length: MAX_CLICKS }, function () { return new THREE.Vector2(-1, -1); }) },
      uClickTimes:      { value: new Float32Array(MAX_CLICKS) },
      uShapeType:       { value: SHAPE_MAP[CONFIG.variant] || 0 },
      uPixelSize:       { value: CONFIG.pixelSize * renderer.getPixelRatio() },
      uScale:           { value: CONFIG.patternScale },
      uDensity:         { value: CONFIG.patternDensity },
      uPixelJitter:     { value: 0 },
      uEnableRipples:   { value: CONFIG.enableRipples ? 1 : 0 },
      uRippleSpeed:     { value: CONFIG.rippleSpeed },
      uRippleThickness: { value: CONFIG.rippleThickness },
      uRippleIntensity: { value: CONFIG.rippleIntensityScale },
      uEdgeFade:        { value: CONFIG.edgeFade }
    };

    /* Scena */
    var scene    = new THREE.Scene();
    var camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var material = new THREE.ShaderMaterial({
      vertexShader:   VERTEX_SRC,
      fragmentShader: FRAGMENT_SRC,
      uniforms:       uniforms,
      transparent:    true,
      depthTest:      false,
      depthWrite:     false
    });
    var quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    var clock = new THREE.Clock();

    /* Offset temporale casuale per evitare pattern identici tra visite */
    var u32 = new Uint32Array(1);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(u32);
    } else {
      u32[0] = Math.random() * 0xFFFFFFFF;
    }
    var timeOffset = (u32[0] / 0xFFFFFFFF) * 1000;

    /* Ridimensionamento */
    function setSize() {
      var w = container.clientWidth  || 1;
      var h = container.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height
      );
      uniforms.uPixelSize.value = CONFIG.pixelSize * renderer.getPixelRatio();
    }
    setSize();

    var ro = new ResizeObserver(setSize);
    ro.observe(container);

    /* Click → ripple (ascoltiamo sulla hero così funziona anche sopra il testo) */
    hero.addEventListener('pointerdown', function (e) {
      var rect = renderer.domElement.getBoundingClientRect();
      var scaleX = renderer.domElement.width  / rect.width;
      var scaleY = renderer.domElement.height / rect.height;
      var fx = (e.clientX - rect.left) * scaleX;
      var fy = (rect.height - (e.clientY - rect.top)) * scaleY;

      uniforms.uClickPos.value[clickIx].set(fx, fy);
      uniforms.uClickTimes.value[clickIx] = uniforms.uTime.value;
      clickIx = (clickIx + 1) % MAX_CLICKS;
    }, { passive: true });

    /* Auto‑pausa quando la hero è fuori dallo schermo */
    var visible = true;
    var io = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
    }, { threshold: 0 });
    io.observe(container);

    /* Loop di animazione */
    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      uniforms.uTime.value = timeOffset + clock.getElapsedTime() * CONFIG.speed;
      renderer.render(scene, camera);
    }
    requestAnimationFrame(animate);
  }

  /* Avvia dopo il parsing del DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
