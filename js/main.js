(function () {
  "use strict";
  var WA = "https://wa.me/213776205950";
  var MAIL = "contact@mbelaid.com";
  var KEY = "mbc-lang";
  var D = window.I18N;
  var lang = "en";

  function t(k) { return (D[lang] && D[lang][k]) || D.en[k] || k; }

  function stored() {
    try { var v = localStorage.getItem(KEY); return D[v] ? v : null; } catch (e) { return null; }
  }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* ignore */ } }

  function waUrl(text) { return WA + "?text=" + encodeURIComponent(text); }

  function apply(l, persist) {
    lang = D[l] ? l : "en";
    var root = document.documentElement;
    root.lang = lang;
    root.dir = (window.RTL_LANGS || []).indexOf(lang) > -1 ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) { el.alt = t(el.getAttribute("data-i18n-alt")); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    document.querySelectorAll(".wa-link").forEach(function (a) { a.href = waUrl(t("wa.default")); });
    document.querySelectorAll(".lang-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    document.title = lang === "fr"
      ? "mbelaid consulting | L'automatisation intelligente pour les entreprises modernes"
      : "mbelaid consulting | Intelligent Automation for Modern Businesses";
    var md = document.querySelector('meta[name="description"]');
    if (md) md.content = lang === "fr"
      ? "mbelaid consulting : automatisation par l'IA, business analytics et formation par Mohamed BELAID, consultant freelance."
      : "mbelaid consulting: AI automation, business analytics and training by Mohamed BELAID, freelance consultant. Reduce repetitive work and unlock sustainable growth.";
    clearErrors();
    if (persist) store(lang);
  }

  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { apply(b.dataset.lang, true); });
  });

  /* Menu mobile */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");
  function closeMenu() { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("open") && !nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) { closeMenu(); toggle.focus(); }
  });

  /* Photo : placeholder si absente */
  var photo = document.getElementById("photo"), ph = document.getElementById("photo-ph");
  function noPhoto() { photo.hidden = true; ph.hidden = false; ph.removeAttribute("aria-hidden"); ph.setAttribute("role", "img"); ph.setAttribute("aria-label", "Mohamed BELAID"); }
  if (photo.complete && photo.naturalWidth === 0) noPhoto();
  photo.addEventListener("error", noPhoto);

  /* Formulaire */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var fields = [
    { id: "f-name", err: "e-name", msg: "err.name", ok: function (v) { return v.trim().length > 0; } },
    { id: "f-email", err: "e-email", msg: "err.email", ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
    { id: "f-msg", err: "e-msg", msg: "err.msg", ok: function (v) { return v.trim().length > 0; } }
  ];
  function clearErrors() {
    fields.forEach(function (f) {
      var i = document.getElementById(f.id);
      document.getElementById(f.err).textContent = "";
      i.removeAttribute("aria-invalid");
    });
    status.textContent = "";
  }
  function check(f) {
    var i = document.getElementById(f.id), e = document.getElementById(f.err), good = f.ok(i.value);
    e.textContent = good ? "" : t(f.msg);
    if (good) i.removeAttribute("aria-invalid"); else i.setAttribute("aria-invalid", "true");
    return good;
  }
  fields.forEach(function (f) {
    var i = document.getElementById(f.id);
    i.addEventListener("blur", function () { if (i.value) check(f); });
    i.addEventListener("input", function () { if (i.getAttribute("aria-invalid")) check(f); });
  });
  function body() {
    var v = {
      name: document.getElementById("f-name").value.trim(),
      email: document.getElementById("f-email").value.trim(),
      msg: document.getElementById("f-msg").value.trim()
    };
    return t("wa.form").replace(/\{(name|email|msg)\}/g, function (m, k) { return v[k]; });
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var first = null;
    fields.forEach(function (f) { if (!check(f) && !first) first = f; });
    if (first) { status.textContent = ""; document.getElementById(first.id).focus(); return; }
    status.textContent = t("ok");
    window.open(waUrl(body()), "_blank", "noopener");
  });
  document.getElementById("mailto-link").addEventListener("click", function () {
    var n = document.getElementById("f-name").value.trim(), m = document.getElementById("f-msg").value.trim();
    var subj = lang === "fr" ? "Demande de contact" : "Contact request";
    if (n || m) this.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(m + (n ? "\n\n" + n : ""));
  });

  document.getElementById("year").textContent = new Date().getFullYear();
  apply(stored() || "en", false);
})();
