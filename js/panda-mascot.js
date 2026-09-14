(function () {
  var STORAGE_KEY = 'pandaMascotDismissed';
  try {
    if (window.localStorage && localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {}

  var CONTACT_EMAIL = 'info@panndano.com';
  var CONSULT_TEXT = '編集部に質問する?';
  var CONSULT_HINT = 'もう一度タップでメール作成';
  var CONSULT_TIMEOUT = 6000;
  var AMBIENT = [
    { action: 'wave', text: 'やっほー' },
    { action: 'stretch', text: 'ふぅ〜、伸びるー' }
  ];

  /* 耳の形(基準座標: 付け根が原点、上向き)。頭より先に描き、付け根は頭で隠す */
  var EAR_PATH = 'M-15,6 C-19,-10 -15.5,-28 -4,-36 ' +
                 'C8,-44.5 24,-35 24,-20 ' +
                 'C24,-9 19.5,0 14,6 Z';

  function ear(side) {
    /* side: 1 = 向かって右耳, -1 = 左耳(反転配置) */
    var cx = side > 0 ? 157 : 83;
    var t = 'translate(' + cx + ',68) rotate(' + (side > 0 ? 27 : -27) + ')' +
            (side > 0 ? '' : ' scale(-1,1)');
    return '<g class="' + (side > 0 ? 'pm-ear-r' : 'pm-ear-l') + '">' +
             '<g transform="' + t + '">' +
               '<path d="' + EAR_PATH + '" fill="#1C2B39"/>' +
             '</g>' +
           '</g>';
  }

  function paw(cx, cy, tilt) {
    return '<g transform="rotate(' + tilt + ' ' + cx + ' ' + cy + ')">' +
             '<ellipse cx="' + cx + '" cy="' + cy + '" rx="14.5" ry="10.5" fill="var(--pm-ink)"/>' +
             '<circle cx="' + (cx - 9.4) + '" cy="' + (cy + 5.4) + '" r="4.7" fill="var(--pm-ink)"/>' +
             '<circle cx="' + cx + '" cy="' + (cy + 7.6) + '" r="4.9" fill="var(--pm-ink)"/>' +
             '<circle cx="' + (cx + 9.4) + '" cy="' + (cy + 5.4) + '" r="4.7" fill="var(--pm-ink)"/>' +
           '</g>';
  }

  function foot(cx, tilt) {
    return '<g transform="rotate(' + tilt + ' ' + cx + ' 220)">' +
             '<ellipse cx="' + cx + '" cy="220" rx="15.5" ry="10.5" fill="var(--pm-ink)"/>' +
             '<circle cx="' + (cx - 9.6) + '" cy="225" r="4.6" fill="var(--pm-ink)"/>' +
             '<circle cx="' + cx + '" cy="227" r="4.9" fill="var(--pm-ink)"/>' +
             '<circle cx="' + (cx + 9.6) + '" cy="225" r="4.6" fill="var(--pm-ink)"/>' +
           '</g>';
  }

  var svgMarkup = '' +
    '<svg class="panda-mascot-svg" viewBox="0 0 240 240" role="img" aria-label="パンダのマスコット">' +
    '<ellipse cx="120" cy="232" rx="50" ry="7" fill="#000" opacity="0.08"/>' +
    '<g class="pm-bob">' +
      '<g class="pm-leg-l">' +
        '<rect x="88" y="192" width="27" height="30" rx="13.5" fill="var(--pm-ink)"/>' +
        foot(101.5, -8) +
      '</g>' +
      '<g class="pm-leg-r">' +
        '<rect x="125" y="192" width="27" height="30" rx="13.5" fill="var(--pm-ink)"/>' +
        foot(138.5, 8) +
      '</g>' +
      '<ellipse cx="120" cy="180" rx="46" ry="39" fill="var(--pm-white)" stroke="var(--pm-ink)" stroke-width="2"/>' +
      '<ellipse cx="81" cy="156" rx="14.5" ry="21" fill="var(--pm-ink)"/>' +
      '<ellipse cx="159" cy="156" rx="14.5" ry="21" fill="var(--pm-ink)"/>' +
      '<g class="pm-arm-l">' +
        '<path d="M63,141 Q63,130 76,130 Q89,130 89,141 L87,175 L64.5,175 Z" fill="var(--pm-ink)"/>' +
        paw(76, 181, 8) +
      '</g>' +
      '<g class="pm-arm-r">' +
        '<path d="M151,141 Q151,130 164,130 Q177,130 177,141 L175.5,175 L153,175 Z" fill="var(--pm-ink)"/>' +
        paw(164, 181, -8) +
      '</g>' +
      '<g class="pm-head" transform="rotate(-3.5 120 150)">' +
        ear(-1) +
        ear(1) +
        '<ellipse cx="120" cy="96" rx="61" ry="55" fill="#F1ECE1" stroke="#1C2B39" stroke-width="4"/>' +
        '<ellipse cx="87" cy="127" rx="10" ry="5.6" fill="#E8A19A" opacity="0.58" transform="rotate(-10 87 127)"/>' +
        '<ellipse cx="153" cy="126" rx="10" ry="5.6" fill="#E8A19A" opacity="0.58" transform="rotate(10 153 126)"/>' +
        '<ellipse cx="94" cy="101" rx="19.5" ry="25" fill="#1C2B39" transform="rotate(26 94 101)"/>' +
        '<ellipse cx="146" cy="100" rx="19" ry="24.5" fill="#1C2B39" transform="rotate(-25 146 100)"/>' +
        '<g class="pm-eyes-open">' +
          '<g class="pm-eye-l">' +
            '<circle cx="97.5" cy="98" r="9.4" fill="#FDFCF8"/>' +
            '<circle cx="98.4" cy="99.2" r="6.3" fill="#1C2B39"/>' +
            '<circle cx="95" cy="95.3" r="2.7" fill="#FDFCF8"/>' +
            '<circle cx="101" cy="102.6" r="1.5" fill="#FDFCF8"/>' +
          '</g>' +
          '<g class="pm-eye-r">' +
            '<circle cx="142.8" cy="97" r="9.2" fill="#FDFCF8"/>' +
            '<circle cx="143.7" cy="98.2" r="6.2" fill="#1C2B39"/>' +
            '<circle cx="140.3" cy="94.3" r="2.7" fill="#FDFCF8"/>' +
            '<circle cx="146.3" cy="101.6" r="1.5" fill="#FDFCF8"/>' +
          '</g>' +
        '</g>' +
        '<g class="pm-eyes-closed">' +
          '<path d="M88.5,99 Q97.5,92.5 106.5,99" stroke="#FDFCF8" stroke-width="3" fill="none" stroke-linecap="round"/>' +
          '<path d="M134,98 Q142.8,91.6 151.6,98" stroke="#FDFCF8" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<g class="pm-wink">' +
          '<path d="M88.2,101.6 Q97.6,91.6 106.8,99.4" stroke="#FDFCF8" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        '<path d="M107.5,114 Q120,108.8 132.5,114 Q134,122 120,127.5 Q106,122 107.5,114 Z" fill="#1C2B39"/>' +
        '<path d="M120,127.5 L120,133" stroke="#1C2B39" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
        '<path class="pm-mouth-closed" d="M101.5,129.5 C105.7,142 116.5,143.6 120,134.2 C123.5,143.6 134.3,142 138.5,129.5" fill="none" stroke="#1C2B39" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g class="pm-mouth-open">' +
          '<path d="M103.5,130 Q120,137.2 136.5,130 Q136,146 120,148 Q104,146 103.5,130 Z" fill="#1C2B39"/>' +
          '<ellipse cx="120" cy="144" rx="7.5" ry="3.6" fill="var(--pm-accent)"/>' +
        '</g>' +
      '</g>' +
    '</g>' +
    '</svg>';

  function init() {
    var wrap = document.createElement('div');
    wrap.className = 'panda-mascot';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', 'パンダのマスコット。クリックで編集部に質問できます');
    wrap.innerHTML =
      '<button type="button" class="panda-mascot-close" aria-label="マスコットを非表示にする">&times;</button>' +
      '<div class="panda-mascot-speech"></div>' +
      svgMarkup;
    document.body.appendChild(wrap);

    var speech = wrap.querySelector('.panda-mascot-speech');
    var closeBtn = wrap.querySelector('.panda-mascot-close');
    var busyUntil = 0;
    var awaitingConfirm = false;
    var confirmTimer = null;

    function say(text, ms) {
      speech.textContent = text;
      wrap.classList.add('show-speech');
      window.clearTimeout(say._t);
      say._t = window.setTimeout(function () {
        wrap.classList.remove('show-speech');
      }, ms || 1500);
    }

    function play(action, text, duration) {
      if (awaitingConfirm) return;
      if (Date.now() < busyUntil) return;
      busyUntil = Date.now() + duration;
      wrap.classList.remove('is-waving', 'is-stretching');
      wrap.classList.add(action === 'wave' ? 'is-waving' : 'is-stretching');
      say(text, duration - 100);
      window.setTimeout(function () {
        wrap.classList.remove('is-waving', 'is-stretching');
      }, duration);
    }

    function cancelConsult() {
      awaitingConfirm = false;
      window.clearTimeout(confirmTimer);
      wrap.classList.remove('is-asking', 'show-speech');
    }

    function showConsultPrompt() {
      window.clearTimeout(say._t);
      window.clearTimeout(confirmTimer);
      wrap.classList.remove('is-stretching');
      wrap.classList.add('is-waving');
      window.setTimeout(function () {
        wrap.classList.remove('is-waving');
      }, 700);

      speech.innerHTML = CONSULT_TEXT + '<span class="pm-hint">' + CONSULT_HINT + '</span>';
      wrap.classList.add('show-speech', 'is-asking');
      awaitingConfirm = true;
      confirmTimer = window.setTimeout(cancelConsult, CONSULT_TIMEOUT);
    }

    function confirmAndOpenMail() {
      cancelConsult();
      window.location.href = 'mailto:' + CONTACT_EMAIL;
    }

    wrap.addEventListener('click', function (e) {
      if (e.target === closeBtn) return;
      if (awaitingConfirm) {
        confirmAndOpenMail();
        return;
      }
      showConsultPrompt();
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (awaitingConfirm) { confirmAndOpenMail(); } else { showConsultPrompt(); }
      }
    });
    document.addEventListener('click', function (e) {
      if (awaitingConfirm && !wrap.contains(e.target)) { cancelConsult(); }
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
