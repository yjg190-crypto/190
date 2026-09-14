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
        '<circle cx="78.7" cy="58.7" r="21.4" fill="#1C2B39" transform="rotate(-12 78.7 58.7)"/>' +
        '<circle cx="161.3" cy="52.6" r="21.4" fill="#1C2B39" transform="rotate(18 161.3 52.6)"/>' +
        '<ellipse cx="120" cy="113.8" rx="55.1" ry="49" fill="#F1ECE1" stroke="#1C2B39" stroke-width="4" transform="rotate(-4 120 113.8)"/>' +
        '<ellipse cx="89" cy="105" rx="19" ry="22" fill="#1C2B39" transform="rotate(-15 89 105)"/>' +
        '<ellipse cx="151" cy="105" rx="19" ry="22" fill="#1C2B39" transform="rotate(15 151 105)"/>' +
        '<g class="pm-eyes-open">' +
          '<circle cx="89" cy="104" r="11" fill="#FFFFFF"/>' +
          '<circle cx="151" cy="104" r="11" fill="#FFFFFF"/>' +
          '<circle cx="89" cy="105" r="6.3" fill="#57934A"/>' +
          '<circle cx="151" cy="105" r="6.3" fill="#57934A"/>' +
          '<circle cx="89" cy="105" r="2.8" fill="#1C2B39"/>' +
          '<circle cx="151" cy="105" r="2.8" fill="#1C2B39"/>' +
          '<circle cx="86.5" cy="101.5" r="1.4" fill="#FFFFFF"/>' +
          '<circle cx="148.5" cy="101.5" r="1.4" fill="#FFFFFF"/>' +
        '</g>' +
        '<g class="pm-eyes-closed">' +
          '<path d="M79,105 Q89,98 99,105" stroke="#1C2B39" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          '<path d="M141,105 Q151,98 161,105" stroke="#1C2B39" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<ellipse cx="121.6" cy="129.1" rx="9.2" ry="6.9" fill="#1C2B39"/>' +
        '<path d="M110.9,147.4 Q121.6,159.7 135.3,145.9" fill="none" stroke="#1C2B39" stroke-width="3.5" stroke-linecap="round"/>' +
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
