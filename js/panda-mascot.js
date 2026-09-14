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
        '<circle cx="79" cy="57" r="21.5" fill="#1C2B39"/>' +
        '<circle cx="161" cy="54" r="20.5" fill="#1C2B39"/>' +
        '<ellipse cx="120" cy="113" rx="55" ry="49" fill="#F1ECE1" stroke="#1C2B39" stroke-width="4" transform="rotate(-3 120 113)"/>' +
        '<ellipse cx="77" cy="125" rx="8.5" ry="5" fill="#E8A9A0" opacity="0.55" transform="rotate(-8 77 125)"/>' +
        '<ellipse cx="164" cy="123" rx="8.5" ry="5" fill="#E8A9A0" opacity="0.55" transform="rotate(8 164 123)"/>' +
        '<ellipse cx="94" cy="105" rx="17.5" ry="23" fill="#1C2B39" transform="rotate(30 94 105)"/>' +
        '<ellipse cx="147.5" cy="103" rx="17" ry="22.5" fill="#1C2B39" transform="rotate(-27 147.5 103)"/>' +
        '<g class="pm-eyes-open">' +
          '<circle cx="95.5" cy="101" r="7" fill="#FDFCF8"/>' +
          '<circle cx="146" cy="100" r="7" fill="#FDFCF8"/>' +
          '<circle cx="96.3" cy="101.6" r="4.6" fill="#1C2B39"/>' +
          '<circle cx="146.7" cy="100.6" r="4.6" fill="#1C2B39"/>' +
          '<circle cx="94.1" cy="99.2" r="1.8" fill="#FDFCF8"/>' +
          '<circle cx="144.5" cy="98.2" r="1.8" fill="#FDFCF8"/>' +
        '</g>' +
        '<g class="pm-eyes-closed">' +
          '<path d="M89,102 Q95.5,97.5 102,102" stroke="#FDFCF8" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
          '<path d="M139.5,101 Q146,96.5 152.5,101" stroke="#FDFCF8" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<path d="M110,126 Q120,122 130,126 Q131.5,132.8 120,137.4 Q108.5,132.8 110,126 Z" fill="#1C2B39"/>' +
        '<path d="M120,137.4 L120,143" stroke="#1C2B39" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M105,142.5 Q112.6,151 120,143.6 Q127.6,151.6 135,142" fill="none" stroke="#1C2B39" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
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
      var delay = 10000 + Math.random() * 5000;
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
