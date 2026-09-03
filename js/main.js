document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // 移动端点击链接后自动收起菜单
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});

// ホーム:ヒーロー画像を数秒ごとにフェード切替
document.addEventListener("DOMContentLoaded", function () {
  var stage = document.getElementById("heroStage");
  if (!stage) return;
  var images = stage.querySelectorAll("img");
  if (images.length < 2) return;

  var current = 0;
  setInterval(function () {
    var next = (current + 1) % images.length;
    images[current].classList.remove("is-active");
    images[next].classList.add("is-active");
    current = next;
  }, 8000);
});

// 記事下部のSNSシェアボタン
document.addEventListener("DOMContentLoaded", function () {
  var shareBox = document.querySelector(".share-buttons");
  if (!shareBox) return;

  var pageUrl = encodeURIComponent(window.location.href);
  var pageTitle = encodeURIComponent(document.title);

  var xBtn = shareBox.querySelector('[data-share="x"]');
  if (xBtn) xBtn.href = "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + pageTitle;

  var lineBtn = shareBox.querySelector('[data-share="line"]');
  if (lineBtn) lineBtn.href = "https://social-plugins.line.me/lineit/share?url=" + pageUrl;

  var fbBtn = shareBox.querySelector('[data-share="fb"]');
  if (fbBtn) fbBtn.href = "https://www.facebook.com/sharer/sharer.php?u=" + pageUrl;

  var copyBtn = shareBox.querySelector('[data-share="copy"]');
  if (copyBtn) {
    copyBtn.addEventListener("click", function (e) {
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = "コピーしました";
        copyBtn.classList.add("is-copied");
        setTimeout(function () {
          copyBtn.textContent = original;
          copyBtn.classList.remove("is-copied");
        }, 2000);
      });
    });
  }
});
