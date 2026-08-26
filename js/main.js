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
