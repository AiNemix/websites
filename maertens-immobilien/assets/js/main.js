/* ═══════════════════════════════════════════════════════
   Maertens Immobilien GmbH — main.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll behaviour ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ── Mobile menu ── */
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
  document.body.style.overflow = 'hidden';
});
document.getElementById('mobileMenuClose').addEventListener('click', closeMobileMenu);
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Scroll-triggered animations ── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      animObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

/* ── Counter animation ── */
function animateCount(el, target, duration = 1600) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + (el.dataset.suffix || ''); clearInterval(timer); }
    else { el.textContent = Math.floor(start) + (el.dataset.suffix || ''); }
  }, 16);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateCount(el, parseInt(el.dataset.count));
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

/* ── Search tabs ── */
function setSearchTab(btn, mode) {
  document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const priceSelect = document.getElementById('searchPrice');
  if (mode === 'mieten') {
    priceSelect.innerHTML = '<option value="">Max. Miete/Monat</option><option>bis 500 €</option><option>bis 800 €</option><option>bis 1.200 €</option><option>bis 2.000 €</option><option>über 2.000 €</option>';
  } else if (mode === 'bewerten') {
    priceSelect.innerHTML = '<option value="">Größenkategorie</option><option>bis 80 m²</option><option>80–150 m²</option><option>150–250 m²</option><option>über 250 m²</option>';
  } else {
    priceSelect.innerHTML = '<option value="">Max. Preis</option><option>bis 150.000 €</option><option>bis 250.000 €</option><option>bis 350.000 €</option><option>bis 500.000 €</option><option>über 500.000 €</option>';
  }
}

function doSearch() {
  const loc = document.getElementById('searchLocation').value.trim();
  const type = document.getElementById('searchType').value;
  const price = document.getElementById('searchPrice').value;
  let url = 'https://www.maertens-immobilien.com/de/';
  showToast('Suche wird gestartet… 🔍');
  setTimeout(() => window.open(url, '_blank'), 600);
}

/* ── Calculator: switch tabs ── */
function switchCalc(btn, panel) {
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('calc-' + panel).classList.add('active');
}

/* ── Formatter helpers ── */
function euro(val) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
}
function pct(val) {
  return val.toFixed(2).replace('.', ',') + ' %';
}
function years(val) {
  if (!isFinite(val) || val > 100) return '> 50 Jahre';
  return Math.round(val) + ' Jahre';
}

/* ── Tilgungsrechner ── */
function calcTilgung() {
  const kaufpreis    = parseFloat(document.getElementById('t-kaufpreis').value) || 0;
  const eigenkapital = parseFloat(document.getElementById('t-eigenkapital').value) || 0;
  const zinsSatz     = parseFloat(document.getElementById('t-zins').value) / 100 || 0;
  const tilgSatz     = parseFloat(document.getElementById('t-tilgung').value) / 100 || 0;

  const darlehen = Math.max(kaufpreis - eigenkapital, 0);
  const monatRate = darlehen * (zinsSatz + tilgSatz) / 12;
  const monatZins = darlehen * zinsSatz / 12;

  // approximate payoff years: ln(rate/(rate-darlehen*zins/12)) / (12*ln(1+zins/12))
  let laufzeit = Infinity;
  if (zinsSatz > 0 && monatRate > monatZins) {
    const i = zinsSatz / 12;
    laufzeit = Math.log(monatRate / (monatRate - darlehen * i)) / (12 * Math.log(1 + i));
  } else if (zinsSatz === 0 && monatRate > 0) {
    laufzeit = darlehen / monatRate / 12;
  }

  document.getElementById('t-rate').textContent    = euro(monatRate);
  document.getElementById('t-darlehen').textContent = euro(darlehen);
  document.getElementById('t-zinslast').textContent = euro(monatZins);
  document.getElementById('t-laufzeit').textContent = years(laufzeit);
}

/* ── Mietrendite ── */
function calcMiete() {
  const kaufpreis    = parseFloat(document.getElementById('m-kaufpreis').value) || 1;
  const miete        = parseFloat(document.getElementById('m-miete').value) || 0;
  const nebenkostenP = parseFloat(document.getElementById('m-nebenkosten').value) / 100 || 0;
  const kostenP      = parseFloat(document.getElementById('m-kosten').value) / 100 || 0;

  const jahrMiete   = miete * 12;
  const nebenkosten = kaufpreis * nebenkostenP;
  const gesamtInv   = kaufpreis + nebenkosten;
  const bruttoRend  = (jahrMiete / kaufpreis) * 100;
  const nettoRend   = ((jahrMiete * (1 - kostenP)) / gesamtInv) * 100;

  document.getElementById('m-brutto').textContent  = pct(bruttoRend);
  document.getElementById('m-netto').textContent   = pct(nettoRend);
  document.getElementById('m-jahrlich').textContent = euro(jahrMiete);
  document.getElementById('m-gesamt').textContent  = euro(gesamtInv);
}

/* ── Budgetrechner ── */
function calcBudget() {
  const einkommen   = parseFloat(document.getElementById('b-einkommen').value) || 0;
  const eigenkapital = parseFloat(document.getElementById('b-eigenkapital').value) || 0;
  const quote       = parseFloat(document.getElementById('b-quote').value) / 100 || 0.35;
  const zins        = parseFloat(document.getElementById('b-zins').value) / 100 || 0.035;

  const maxRate     = einkommen * quote;
  // Monthly rate = darlehen * (zins + tilgung) / 12, assuming 2% Tilgung
  const tilgung     = 0.02;
  const maxDarlehen = maxRate * 12 / (zins + tilgung);
  const maxKaufpreis = maxDarlehen + eigenkapital;
  const ekEmpfehlung = maxKaufpreis * 0.20;

  document.getElementById('b-max').textContent      = euro(maxKaufpreis);
  document.getElementById('b-darlehen').textContent = euro(maxDarlehen);
  document.getElementById('b-rate').textContent     = euro(maxRate);
  document.getElementById('b-ekempf').textContent   = euro(ekEmpfehlung);
}

/* ── Contact form ── */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '⏳ Wird gesendet…';
  btn.disabled = true;

  // Simulate async send
  setTimeout(() => {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    showToast('✅ Anfrage erfolgreich gesendet!');
  }, 1200);
}

/* ── Toast notification ── */
function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id], div[id].stats-bar');
const navLinks  = document.querySelectorAll('.navbar__nav a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ── Init calculators on load ── */
document.addEventListener('DOMContentLoaded', () => {
  calcTilgung();
  calcMiete();
  calcBudget();
});

/* Run now in case DOMContentLoaded already fired */
if (document.readyState !== 'loading') {
  calcTilgung();
  calcMiete();
  calcBudget();
}
