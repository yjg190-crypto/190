(function () {
  var STORAGE_KEY = 'pandaMascotDismissed';
  try {
    if (window.localStorage && localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {}

  var GREETINGS = ['やっほー!', 'こんにちは!', 'いらっしゃい!'];
  var AMBIENT = [
    { action: 'wave', text: 'やっほー' },
    { action: 'stretch', text: 'ふぅ〜、伸びるー' }
  ];

  var svgMarkup = '' +
    '<svg class="panda-mascot-svg" viewBox="0 0 240 240" role="img" aria-label="パンダのマスコット">' +
    '<ellipse cx="120" cy="230" rx="56" ry="8" fill="#000" opacity="0.08"/>' +
    '<g class="pm-bob">' +
      '<g class="pm-leg-l"><rect x="88" y="196" width="34" height="40" rx="17" fill="var(--pm-ink)"/></g>' +
      '<g class="pm-leg-r"><rect x="118" y="196" width="34" height="40" rx="17" fill="var(--pm-ink)"/></g>' +
      '<ellipse cx="120" cy="170" rx="50" ry="44" fill="var(--pm-white)" stroke="var(--pm-ink)" stroke-width="2"/>' +
      '<ellipse cx="80" cy="150" rx="17" ry="21" fill="var(--pm-ink)"/>' +
      '<ellipse cx="160" cy="150" rx="17" ry="21" fill="var(--pm-ink)"/>' +
      '<g class="pm-arm-l"><rect x="62" y="146" width="32" height="52" rx="16" fill="var(--pm-ink)"/></g>' +
      '<g class="pm-arm-r"><rect x="146" y="146" width="32" height="52" rx="16" fill="var(--pm-ink)"/></g>' +
      '<g>' +
        '<circle cx="105" cy="134" r="7" fill="var(--pm-accent)"/>' +
        '<circle cx="135" cy="134" r="7" fill="var(--pm-accent)"/>' +
        '<circle cx="120" cy="134" r="5" fill="#7d281f"/>' +
      '</g>' +
      '<g>' +
        '<circle cx="86" cy="50" r="20" fill="var(--pm-ink)"/>' +
        '<circle cx="154" cy="50" r="20" fill="var(--pm-ink)"/>' +
        '<circle cx="120" cy="98" r="62" fill="var(--pm-white)" stroke="var(--pm-ink)" stroke-width="2"/>' +
        '<ellipse cx="95" cy="100" rx="23" ry="27" fill="var(--pm-ink)" transform="rotate(-10 95 100)"/>' +
        '<circle cx="110" cy="122" r="13" fill="var(--pm-ink)"/>' +
        '<ellipse cx="145" cy="100" rx="23" ry="27" fill="var(--pm-ink)" transform="rotate(10 145 100)"/>' +
        '<circle cx="130" cy="122" r="13" fill="var(--pm-ink)"/>' +
        '<ellipse cx="120" cy="138" rx="36" ry="26" fill="var(--pm-white)" stroke="var(--pm-ink)" stroke-width="2"/>' +
        '<g class="pm-eyes-open">' +
          '<circle cx="98" cy="97" r="8" fill="var(--pm-white)"/>' +
          '<circle cx="142" cy="97" r="8" fill="var(--pm-white)"/>' +
          '<circle cx="99" cy="98" r="4.4" fill="var(--pm-ink)"/>' +
          '<circle cx="143" cy="98" r="4.4" fill="var(--pm-ink)"/>' +
          '<circle cx="101" cy="96" r="1.4" fill="var(--pm-white)"/>' +
          '<circle cx="145" cy="96" r="1.4" fill="var(--pm-white)"/>' +
        '</g>' +
        '<g class="pm-eyes-closed">' +
          '<path d="M89,97 Q98,90 107,97" stroke="var(--pm-ink)" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
          '<path d="M133,97 Q142,90 151,97" stroke="var(--pm-ink)" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<circle cx="82" cy="128" r="9" fill="var(--pm-accent)" opacity="0.24"/>' +
        '<circle cx="158" cy="128" r="9" fill="var(--pm-accent)" opacity="0.24"/>' +
        '<ellipse cx="120" cy="126" rx="9" ry="7" fill="var(--pm-ink)"/>' +
        '<path d="M120,133 L120,139" stroke="var(--pm-ink)" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M104,144 Q120,154 136,144" stroke="var(--pm-ink)" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
      '</g>' +
    '</g>' +
    '</svg>';

  function init() {
    var wrap = document.createElement('div');
    wrap.className = 'panda-mascot';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', 'パンダのマスコット。クリックで挨拶します');
    wrap.innerHTML =
      '<button type="button" class="panda-mascot-close" aria-label="マスコットを非表示にする">&times;</button>' +
      '<div class="panda-mascot-speech"></div>' +
      svgMarkup;
    document.body.appendChild(wrap);

    var speech = wrap.querySelector('.panda-mascot-speech');
    var closeBtn = wrap.querySelector('.panda-mascot-close');
    var busyUntil = 0;

    function say(text, ms) {
      speech.textContent = text;
      wrap.classList.add('show-speech');
      window.clearTimeout(say._t);
      say._t = window.setTimeout(function () {
        wrap.classList.remove('show-speech');
      }, ms || 1500);
    }

    function play(action, text, duration) {
      if (Date.now() < busyUntil) return;
      busyUntil = Date.now() + duration;
      wrap.classList.remove('is-waving', 'is-stretching');
      wrap.classList.add(action === 'wave' ? 'is-waving' : 'is-stretching');
      say(text, duration - 100);
      window.setTimeout(function () {
        wrap.classList.remove('is-waving', 'is-stretching');
      }, duration);
    }

    function greet() {
      var text = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      play('wave', text, 1700);
    }

    wrap.addEventListener('click', function (e) {
      if (e.target === closeBtn) return;
      greet();
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); greet(); }
    });
    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.add('is-leaving');
      window.setTimeout(function () { wrap.hidden = true; }, 350);
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (err) {}
    });

    function scheduleAmbient() {
      var delay = 40000 + Math.random() * 30000;
      window.setTimeout(function () {
        var pick = AMBIENT[Math.floor(Math.random() * AMBIENT.length)];
        play(pick.action, pick.text, 1700);
        scheduleAmbient();
      }, delay);
    }
    if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scheduleAmbient();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
