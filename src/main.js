import { languages, translate, translations } from './i18n.js';
import { categories, eventTypes, seedProducts, getDefaultDate, getToday } from './data.js';
import './styles.css';

const STORE = {
  language: 'festivo-language', cart: 'festivo-cart', bookings: 'festivo-bookings',
  profile: 'festivo-profile', listings: 'festivo-vendor-listings', listingStatus: 'festivo-listing-status',
  services: 'festivo-service-options', plan: 'festivo-event-plan', newsletter: 'festivo-newsletter',
};

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be disabled in private browsing. */ }
}
const storedLanguage = readStore(STORE.language, 'uz');
const state = {
  language: languages.some(({ code }) => code === storedLanguage) ? storedLanguage : 'uz',
  cart: readStore(STORE.cart, []),
  bookings: readStore(STORE.bookings, []),
  profile: readStore(STORE.profile, null),
  listings: readStore(STORE.listings, []),
  listingStatus: readStore(STORE.listingStatus, {}),
  services: { delivery: true, installation: false, ...readStore(STORE.services, {}) },
  plan: { date: getDefaultDate(), guests: 50, eventType: '', venue: '', ...readStore(STORE.plan, {}) },
  eventDate: readStore(STORE.plan, {})?.date || getDefaultDate(),
  accountMode: 'signin',
  menuOpen: false,
  toast: '',
};

const root = document.querySelector('#app');
const localeNames = { uz: 'uz-UZ', ru: 'ru-RU', en: 'en-US' };
const t = (key, values) => translate(state.language, key, values);
const e = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const localText = (value, fallbackKey = '') => {
  if (typeof value === 'string') return value;
  return value?.[state.language] || value?.uz || (fallbackKey ? t(fallbackKey) : '');
};
const formatMoney = (amount) => `${new Intl.NumberFormat(localeNames[state.language], { maximumFractionDigits: 0 }).format(Math.max(0, Number(amount) || 0))} ${t('common.currency')}`;
const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(localeNames[state.language], { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};
const getProducts = () => [...seedProducts, ...state.listings];
const getProduct = (id) => getProducts().find((product) => product.id === id);
const isActive = (product) => state.listingStatus[product.id] ?? product.active ?? true;
const getActiveProducts = () => getProducts().filter(isActive);
const getCartCount = () => state.cart.reduce((total, line) => total + (Number(line.quantity) || 0), 0);
const categoryName = (id) => t(`category.${id}`);
const getCategory = (id) => categories.find((category) => category.id === id) || categories[0];

const iconPaths = {
  search: '<circle cx="11" cy="11" r="7.2"/><path d="m16.5 16.5 4 4"/>',
  bag: '<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 10h17"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  truck: '<path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z"/><circle cx="7.5" cy="18.5" r="1.5"/><circle cx="17.5" cy="18.5" r="1.5"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  spark: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  phone: '<path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M10 18h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"/>',
  heart: '<path d="M20.8 8.8c0 5.5-8.8 10.7-8.8 10.7S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z"/>',
};
function icon(name, className = '') {
  return `<svg class="icon ${e(className)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.spark}</svg>`;
}
function routeLink(path, label, className = '', attrs = '') {
  return `<a href="${e(path)}" data-link class="${e(className)}" ${attrs}>${label}</a>`;
}
function productArt(product, className = '') {
  const title = e(localText(product.title, 'vendor.userTitle'));
  return `<div class="product-art ${e(product.art || 'art-blue')} ${e(className)}" role="img" aria-label="${title}">
    <span class="art-orbit orbit-one"></span><span class="art-orbit orbit-two"></span>
    <span class="art-icon" aria-hidden="true">${e(product.icon || '✦')}</span>
    <span class="art-floor"></span>
  </div>`;
}
function productBadge(product) {
  if (!product.badge) return '';
  return `<span class="product-badge ${product.badge === 'new' ? 'badge-green' : ''}">${e(t(product.badge === 'new' ? 'product.tagNew' : 'product.tagPopular'))}</span>`;
}
function productCard(product) {
  const title = localText(product.title, 'vendor.userTitle');
  const rating = Number(product.rating || 0).toFixed(1);
  return `<article class="product-card">
    <div class="product-card-visual">
      ${routeLink(`/equipment/${encodeURIComponent(product.id)}`, `${productArt(product)}${productBadge(product)}`, 'product-art-link', `aria-label="${e(title)}"`)}
      <button class="quick-add" type="button" data-action="quick-add" data-id="${e(product.id)}" aria-label="${e(t('product.addCart'))}" title="${e(t('product.addCart'))}">${icon('plus')}</button>
    </div>
    <div class="product-card-body">
      <div class="product-card-meta"><span class="product-category">${e(categoryName(product.category))}</span><span class="product-rating">${icon('star')} ${rating} <small>(${Number(product.reviews || 0)})</small></span></div>
      ${routeLink(`/equipment/${encodeURIComponent(product.id)}`, e(title), 'product-card-title')}
      <div class="product-card-bottom"><div class="product-price"><strong>${formatMoney(product.price)}</strong><span>${e(t('common.perDay'))}</span></div>${routeLink(`/equipment/${encodeURIComponent(product.id)}`, `${e(t('product.view'))} ${icon('arrow')}`, 'text-link')}</div>
    </div>
  </article>`;
}
function languageSelector() {
  return `<div class="language-selector" role="group" aria-label="${e(t('header.language'))}">
    ${languages.map(({ code, label }, index) => `${index ? '<span class="language-separator" aria-hidden="true">|</span>' : ''}<button class="language-option ${state.language === code ? 'is-active' : ''}" type="button" data-lang="${code}" aria-pressed="${state.language === code}" title="${e(languages.find((item) => item.code === code)?.name || label)}">${label}</button>`).join('')}
  </div>`;
}
function navItem(path, labelKey, current, extra = '') {
  const href = path;
  const isCurrent = current === path || (path !== '/' && current.startsWith(`${path}/`));
  return routeLink(href, e(t(labelKey)), `nav-link ${isCurrent ? 'is-current' : ''}`, isCurrent ? 'aria-current="page"' : extra);
}
function renderHeader(path) {
  const homeLink = navItem('/', 'nav.home', path);
  const equipmentLink = navItem('/equipment', 'nav.equipment', path);
  const servicesLink = navItem('/services', 'nav.services', path);
  const bookingsLink = navItem('/bookings', 'nav.bookings', path);
  return `<div class="utility-bar"><div class="container utility-inner"><span>${icon('pin')} ${e(t('header.delivery'))}</span><span class="utility-trust">${icon('shield')} ${e(t('header.member'))}</span></div></div>
    <header class="site-header"><div class="container header-inner">
      ${routeLink('/', `<span class="brand-mark"><span></span><span></span><span></span></span><span class="brand-name">FESTIVO<span class="brand-dot">.</span></span>`, 'brand', 'aria-label="FESTIVO — home"')}
      <nav class="main-nav ${state.menuOpen ? 'is-open' : ''}" aria-label="${e(t('common.menu'))}">${homeLink}${equipmentLink}${servicesLink}${bookingsLink}</nav>
      <div class="header-actions">${languageSelector()}
        ${routeLink('/cart', `${icon('bag')}<span class="cart-action-label">${e(t('nav.cart'))}</span><span class="cart-count">${getCartCount()}</span>`, `header-cart ${path === '/cart' ? 'is-current' : ''}`, `aria-label="${e(t('nav.cart'))}"`)}
        ${routeLink('/account', `${icon('user')}<span>${e(t('nav.account'))}</span>`, `header-account ${path === '/account' ? 'is-current' : ''}`, `aria-label="${e(t('nav.account'))}"`)}
        <button type="button" class="menu-toggle" data-action="menu-toggle" aria-label="${e(t('nav.menu'))}" aria-expanded="${state.menuOpen}">${icon(state.menuOpen ? 'close' : 'menu')}</button>
      </div>
    </div></header>`;
}
function renderFooter() {
  return `<footer class="site-footer"><div class="container footer-main">
    <div class="footer-brand-column">${routeLink('/', `<span class="brand-mark"><span></span><span></span><span></span></span><span class="brand-name">FESTIVO<span class="brand-dot">.</span></span>`, 'brand footer-brand', 'aria-label="FESTIVO — home"')}<p>${e(t('footer.tagline'))}</p><div class="footer-contact">${icon('mail')} <a href="mailto:hello@festivo.uz">${e(t('legal.contactEmail'))}</a></div></div>
    <div class="footer-link-column"><h3>${e(t('footer.explore'))}</h3>${routeLink('/equipment', e(t('nav.equipment')), '')}${routeLink('/services', e(t('nav.services')), '')}${routeLink('/planner', e(t('nav.planner')), '')}${routeLink('/bookings', e(t('nav.bookings')), '')}</div>
    <div class="footer-link-column"><h3>${e(t('footer.support'))}</h3>${routeLink('/help', e(t('footer.helpCenter')), '')}${routeLink('/#how-it-works', e(t('footer.howWorks')), '')}${routeLink('/about', e(t('footer.about')), '')}${routeLink('/terms', e(t('footer.terms')), '')}${routeLink('/privacy', e(t('footer.privacy')), '')}</div>
    <div class="footer-newsletter"><h3>${e(t('footer.newsletter'))}</h3><p>${e(t('footer.newsletterText'))}</p><form class="newsletter-form" data-form="newsletter" novalidate><label class="sr-only" for="newsletter-email">${e(t('footer.emailPlaceholder'))}</label><input id="newsletter-email" type="email" name="email" placeholder="${e(t('footer.emailPlaceholder'))}" required><button type="submit" aria-label="${e(t('footer.subscribe'))}">${icon('arrow')}</button></form><small class="newsletter-hint">${e(t('footer.newsletterSuccess'))}</small></div>
  </div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} FESTIVO. ${e(t('footer.copyright'))}</span><span>${e(t('footer.madeWith'))} <b>♥</b></span><div class="footer-dashboard-links">${routeLink('/vendor', e(t('nav.vendor')), '')}<span>·</span>${routeLink('/admin', e(t('nav.admin')), '')}</div></div></footer>`;
}

function renderHero() {
  return `<section class="hero-section"><div class="container hero-main">
    <div class="hero-copy"><div class="eyebrow hero-eyebrow"><span class="eyebrow-dot"></span>${e(t('hero.eyebrow'))}</div>
      <h1>${e(t('hero.title'))}</h1><p class="hero-lead">${e(t('hero.subtitle'))}</p>
      <div class="hero-ctas">${routeLink('/equipment', `${e(t('hero.primaryCta'))} ${icon('arrow')}`, 'button button-primary hero-primary')}${routeLink('/planner', `${icon('spark')} ${e(t('hero.secondaryCta'))}`, 'button button-glass')}</div>
      <div class="hero-social-proof"><span class="avatar-stack"><b>MA</b><b>DK</b><b>+2k</b></span><span><strong>${icon('star')} 4.9</strong><small>${e(t('hero.rating'))}</small></span></div>
    </div>
    <div class="hero-visual" aria-hidden="true"><div class="hero-scene-grid"></div><div class="hero-scene-glow"></div>
      <div class="scene-top-note"><span class="scene-status-dot"></span>${e(t('hero.badgeOne'))}<span class="scene-check">${icon('check')}</span></div>
      <div class="scene-light scene-light-left"></div><div class="scene-light scene-light-right"></div>
      <div class="scene-string-lights"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="scene-stage"><div class="scene-curtain"></div><div class="scene-table"><span class="scene-vase">✿</span></div><div class="scene-chair scene-chair-one"></div><div class="scene-chair scene-chair-two"></div><div class="scene-speaker"><i></i><i></i></div><div class="scene-plants scene-plant-left">✿</div><div class="scene-plants scene-plant-right">✿</div></div>
      <div class="hero-floating-card floating-rating"><span class="floating-star">${icon('star')}</span><span><b>${e(t('hero.badgeTwo'))}</b><small>4.9 · 36 ${e(t('common.reviews'))}</small></span></div>
      <div class="hero-floating-card floating-date"><span class="floating-calendar">${icon('calendar')}</span><span><b>${e(t('hero.trust'))}</b><small>${e(t('hero.trustNote').split('·')[0].trim())}</small></span></div>
      <span class="scene-confetti confetti-one">✦</span><span class="scene-confetti confetti-two">✦</span>
    </div>
  </div>
  <div class="container hero-search-wrap"><form class="hero-search-card" data-form="home-search" novalidate>
    <label class="hero-search-field search-term-field"><span class="field-icon">${icon('search')}</span><span class="field-copy"><small>${e(t('common.search'))}</small><input type="search" name="q" placeholder="${e(t('hero.searchPlaceholder'))}" value=""></span></label>
    <label class="hero-search-field"><span class="field-icon field-icon-blue">${icon('calendar')}</span><span class="field-copy"><small>${e(t('hero.date'))}</small><input type="date" name="date" min="${getToday()}" value="${e(state.eventDate)}"></span></label>
    <label class="hero-search-field"><span class="field-icon field-icon-green">${icon('user')}</span><span class="field-copy"><small>${e(t('hero.guests'))}</small><input type="number" name="guests" min="1" max="10000" value="${e(state.plan.guests || 50)}"></span></label>
    <button class="button button-primary search-submit" type="submit">${icon('search')}<span>${e(t('hero.searchButton'))}</span></button>
  </form></div></section>`;
}
function renderCategoryCards() {
  return categories.map((category) => {
    const count = getActiveProducts().filter((product) => product.category === category.id).length;
    return routeLink(`/equipment?category=${category.id}`, `<span class="category-icon category-${category.tone}">${e(category.icon)}</span><span class="category-card-text"><strong>${e(categoryName(category.id))}</strong><small>${count} ${e(t('common.items'))}</small></span>${icon('arrow')}`, 'category-card');
  }).join('');
}
function renderHome() {
  const popular = getActiveProducts().filter((product) => product.featured).slice(0, 4);
  return `<main class="page-home">${renderHero()}
    <section class="section-block categories-section"><div class="container"><div class="section-heading section-heading-row"><div><span class="eyebrow eyebrow-light">${e(t('home.categoriesEyebrow'))}</span><h2>${e(t('home.categoriesTitle'))}</h2><p>${e(t('home.categoriesText'))}</p></div>${routeLink('/equipment', `${e(t('common.seeAll'))} ${icon('arrow')}`, 'text-link heading-link')}</div><div class="category-grid">${renderCategoryCards()}</div></div></section>
    <section class="section-block popular-section"><div class="container"><div class="section-heading section-heading-row"><div><span class="eyebrow eyebrow-light">${e(t('home.popularEyebrow'))}</span><h2>${e(t('home.popularTitle'))}</h2><p>${e(t('home.popularText'))}</p></div>${routeLink('/equipment', `${e(t('home.viewAll'))} ${icon('arrow')}`, 'text-link heading-link')}</div><div class="product-grid">${popular.map(productCard).join('')}</div></div></section>
    <section class="how-section" id="how-it-works"><div class="container"><div class="section-heading centered"><span class="eyebrow eyebrow-light">${e(t('home.stepsEyebrow'))}</span><h2>${e(t('home.stepsTitle'))}</h2></div><div class="steps-grid"><article class="step-card"><span class="step-number number-red">01</span><span class="step-icon">${icon('search')}</span><h3>${e(t('home.stepOneTitle'))}</h3><p>${e(t('home.stepOneText'))}</p></article><article class="step-card"><span class="step-number number-blue">02</span><span class="step-icon">${icon('calendar')}</span><h3>${e(t('home.stepTwoTitle'))}</h3><p>${e(t('home.stepTwoText'))}</p></article><article class="step-card"><span class="step-number number-green">03</span><span class="step-icon">${icon('spark')}</span><h3>${e(t('home.stepThreeTitle'))}</h3><p>${e(t('home.stepThreeText'))}</p></article></div></div></section>
    <section class="section-block closing-section"><div class="container closing-grid"><div class="testimonial-card"><div class="testimonial-stars">${icon('star')}${icon('star')}${icon('star')}${icon('star')}${icon('star')}</div><p>“${e(t('home.reviewText'))}”</p><div class="review-author"><span class="review-avatar">${e(t('home.reviewBy').split(' ').map((part) => part[0]).join('').slice(0, 2))}</span><span><strong>${e(t('home.reviewBy'))}</strong><small>${e(t('home.reviewRole'))}</small></span></div></div><div class="closing-banner"><span class="closing-spark">${icon('spark')}</span><span class="eyebrow">FESTIVO</span><h2>${e(t('home.bannerTitle'))}</h2><p>${e(t('home.bannerText'))}</p>${routeLink('/planner', `${e(t('home.bannerCta'))} ${icon('arrow')}`, 'button button-white')}</div></div></section>
  </main>`;
}

function getCatalogProducts() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category') || 'all';
  const query = (params.get('q') || '').trim().toLowerCase();
  const sort = params.get('sort') || 'popular';
  const maxPrice = Math.max(0, Number(params.get('maxPrice')) || 0);
  let products = getActiveProducts();
  if (category !== 'all') products = products.filter((product) => product.category === category);
  if (maxPrice) products = products.filter((product) => product.price <= maxPrice);
  if (query) products = products.filter((product) => {
    const searchable = [localText(product.title, 'vendor.userTitle'), localText(product.description, 'vendor.userDescription'), categoryName(product.category)].join(' ').toLowerCase();
    return searchable.includes(query);
  });
  if (sort === 'low') products.sort((a, b) => a.price - b.price);
  else if (sort === 'high') products.sort((a, b) => b.price - a.price);
  else products.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  return { products, category, query: params.get('q') || '', sort, maxPrice };
}
function renderEquipment() {
  const { products, category, query, sort, maxPrice } = getCatalogProducts();
  const categoryOptions = [`<option value="all" ${category === 'all' ? 'selected' : ''}>${e(t('category.all'))}</option>`, ...categories.map((item) => `<option value="${e(item.id)}" ${category === item.id ? 'selected' : ''}>${e(categoryName(item.id))}</option>`)].join('');
  return `<main class="container page-content catalog-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">${e(t('catalog.eyebrow'))}</span><h1>${e(t('catalog.title'))}</h1><p>${e(t('catalog.subtitle'))}</p></div><div class="heading-side-note">${icon('shield')}<span>${e(t('product.guarantee'))}</span></div></div>
    <form class="catalog-search-bar" data-form="catalog-search" novalidate><span>${icon('search')}</span><input type="search" name="q" placeholder="${e(t('catalog.searchPlaceholder'))}" value="${e(query)}"><button class="button button-primary" type="submit">${e(t('catalog.searchButton'))}</button></form>
    <div class="catalog-layout"><aside class="catalog-sidebar"><div class="sidebar-title"><span>${icon('spark')}</span><strong>${e(t('catalog.filters'))}</strong></div><label class="select-label">${e(t('catalog.category'))}<span class="select-wrap"><select data-filter="category">${categoryOptions}</select>${icon('chevron')}</span></label><label class="select-label">${e(t('catalog.maxPrice'))}<span class="price-filter-wrap"><input type="number" min="0" step="50000" data-filter="priceMax" value="${maxPrice || ''}" placeholder="${e(t('catalog.priceAny'))}" aria-label="${e(t('catalog.maxPrice'))}"><small>${e(t('common.currency'))}</small></span></label><label class="select-label">${e(t('catalog.sort'))}<span class="select-wrap"><select data-filter="sort"><option value="popular" ${sort === 'popular' ? 'selected' : ''}>${e(t('catalog.sortPopular'))}</option><option value="low" ${sort === 'low' ? 'selected' : ''}>${e(t('catalog.sortLow'))}</option><option value="high" ${sort === 'high' ? 'selected' : ''}>${e(t('catalog.sortHigh'))}</option></select>${icon('chevron')}</span></label><button type="button" class="filter-reset" data-action="clear-filters">${icon('close')} ${e(t('catalog.clearFilters'))}</button><div class="sidebar-help"><span class="sidebar-help-icon">${icon('phone')}</span><strong>${e(t('services.supportTitle'))}</strong><p>${e(t('services.supportText'))}</p>${routeLink('/help', `${e(t('footer.helpCenter'))} ${icon('arrow')}`, 'text-link')}</div></aside>
      <section class="catalog-results"><div class="catalog-results-header"><span>${e(t('catalog.showing'))} <strong>${products.length}</strong> ${e(t('catalog.results'))}</span><span class="results-trust">${icon('check')} ${e(t('product.deliveryAvailable'))}</span></div>${products.length ? `<div class="product-grid catalog-product-grid">${products.map(productCard).join('')}</div>` : `<div class="empty-state catalog-empty"><span class="empty-illustration">${icon('search')}</span><h2>${e(t('catalog.emptyTitle'))}</h2><p>${e(t('catalog.emptyText'))}</p><button type="button" class="button button-secondary" data-action="clear-filters">${e(t('catalog.clearFilters'))}</button></div>`}</section>
    </div></main>`;
}
function renderProductDetail(id) {
  const product = getProduct(decodeURIComponent(id));
  if (!product || !isActive(product)) return `<main class="container page-content"><div class="empty-state not-found-state"><span class="empty-illustration">${icon('search')}</span><h1>${e(t('catalog.emptyTitle'))}</h1><p>${e(t('catalog.emptyText'))}</p>${routeLink('/equipment', e(t('product.backCatalog')), 'button button-primary')}</div></main>`;
  const title = localText(product.title, 'vendor.userTitle');
  const description = localText(product.description, 'vendor.userDescription');
  const includes = localText(product.includes, '') || t('product.noDescription');
  return `<main class="container page-content product-detail-page"><div class="breadcrumb">${routeLink('/', e(t('nav.home')), '')}<span>/</span>${routeLink('/equipment', e(t('nav.equipment')), '')}<span>/</span><strong>${e(title)}</strong></div>
    <div class="detail-layout"><section class="detail-visual-column"><div class="detail-art-frame">${productArt(product, 'product-art-large')}${productBadge(product)}<span class="detail-art-spark spark-red">✦</span><span class="detail-art-spark spark-blue">✦</span></div><div class="detail-perks"><div>${icon('shield')}<span>${e(t('product.guarantee'))}</span></div><div>${icon('truck')}<span>${e(t('product.deliveryAvailable'))}</span></div><div>${icon('clock')}<span>${e(t('product.chooseDateHint'))}</span></div></div></section>
      <section class="detail-info"><div class="detail-category-row"><span class="product-category">${e(categoryName(product.category))}</span><span class="product-rating detail-rating">${icon('star')} ${Number(product.rating || 0).toFixed(1)} <small>${Number(product.reviews || 0)} ${e(t('product.reviews'))}</small></span></div><h1>${e(title)}</h1><p class="detail-description">${e(description)}</p><div class="detail-vendor-row"><span class="vendor-avatar">${e((product.vendorName || 'F').slice(0, 1))}</span><span><small>${e(t('product.vendor'))}</small><strong>${e(product.vendorName || 'FESTIVO')}</strong></span><span class="vendor-verified">${icon('check')} ${e(t('vendor.verified'))}</span></div>
      <div class="detail-price"><span>${e(t('product.startingAt'))}</span><strong>${formatMoney(product.price)}<small>${e(t('common.perDay'))}</small></strong></div>
      <form class="booking-widget" data-form="product-booking" data-id="${e(product.id)}" novalidate><div class="booking-widget-header"><strong>${e(t('product.chooseDate'))}</strong><span>${icon('calendar')}</span></div>
        <label class="form-field">${e(t('common.date'))}<input type="date" name="date" min="${getToday()}" value="${e(state.eventDate || getDefaultDate())}" required><small class="field-error" data-error="date"></small></label>
        <div class="booking-widget-fields"><label class="form-field">${e(t('product.quantity'))}<span class="number-input"><button type="button" data-action="detail-qty" data-delta="-1" aria-label="−">${icon('minus')}</button><input type="number" name="quantity" min="1" max="${Math.max(1, Number(product.stock) || 12)}" value="1" required><button type="button" data-action="detail-qty" data-delta="1" aria-label="+">${icon('plus')}</button></span><small class="field-error" data-error="quantity"></small></label><label class="form-field">${e(t('product.rentalDays'))}<span class="select-wrap"><select name="days"><option value="1">1 ${e(t('common.day'))}</option>${[2, 3, 4, 5].map((days) => `<option value="${days}">${days} ${e(t('common.days'))}</option>`).join('')}</select>${icon('chevron')}</span></label></div>
        <p class="booking-widget-note">${icon('check')} ${Number(product.stock) || 0} ${e(t('product.stock'))}</p><button type="submit" class="button button-primary button-full">${icon('bag')} ${e(t('product.addCart'))}</button><p class="booking-widget-footnote">${e(t('product.deliveryNote'))}</p>
      </form></section></div>
    <section class="detail-lower-grid"><div class="detail-content-card"><span class="eyebrow eyebrow-light">${e(t('product.details'))}</span><h2>${e(t('product.includes'))}</h2><p>${e(description)}</p><ul class="included-list">${(Array.isArray(includes) ? includes : []).map((item) => `<li>${icon('check')}<span>${e(item)}</span></li>`).join('')}</ul></div><aside class="detail-content-card detail-spec-card"><span class="eyebrow eyebrow-light">${e(t('product.specs'))}</span><h2>${e(t('product.details'))}</h2><div class="spec-row"><span>${e(t('product.location'))}</span><strong>${icon('pin')} ${e(t('product.location'))}</strong></div><div class="spec-row"><span>${e(t('product.stock'))}</span><strong>${Number(product.stock) || 0}</strong></div><div class="spec-row"><span>${e(t('product.pickup'))}</span><strong>${icon('check')}</strong></div></aside></section>
    <section class="related-section"><div class="section-heading section-heading-row"><div><span class="eyebrow eyebrow-light">${e(t('catalog.eyebrow'))}</span><h2>${e(t('home.popularTitle'))}</h2></div>${routeLink('/equipment', `${e(t('common.seeAll'))} ${icon('arrow')}`, 'text-link heading-link')}</div><div class="product-grid">${getActiveProducts().filter((item) => item.id !== product.id).slice(0, 4).map(productCard).join('')}</div></section></main>`;
}

function renderServices() {
  const serviceCards = [
    { key: 'delivery', icon: 'truck', tone: 'red', fee: formatMoney(75000) },
    { key: 'install', icon: 'spark', tone: 'blue', fee: formatMoney(140000) },
    { key: 'support', icon: 'phone', tone: 'green', fee: t('common.free') },
  ];
  return `<main class="container page-content services-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">${e(t('services.eyebrow'))}</span><h1>${e(t('services.title'))}</h1><p>${e(t('services.subtitle'))}</p></div><div class="heading-side-note">${icon('shield')}<span>${e(t('cart.secure'))}</span></div></div>
    <div class="services-grid">${serviceCards.map(({ key, icon: iconName, tone, fee }) => `<article class="service-card service-${tone}"><span class="service-icon">${icon(iconName)}</span><div class="service-card-meta"><span>${e(t(`services.${key}Title`))}</span><b>${e(fee)}</b></div><h2>${e(t(`services.${key}Title`))}</h2><p>${e(t(`services.${key}Text`))}</p><span class="service-arrow">${icon('arrow')}</span></article>`).join('')}</div>
    <p class="service-price-note">${icon('clock')} ${e(t('services.priceNote'))}</p>
    <div class="service-action-banner"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h2>${e(t('home.bannerTitle'))}</h2><p>${e(t('home.bannerText'))}</p></div><div class="service-action-buttons">${routeLink('/equipment', e(t('services.browseCta')), 'button button-primary')}${routeLink('/planner', e(t('hero.secondaryCta')), 'button button-secondary')}</div></div>
  </main>`;
}

function renderPlanner() {
  const eventOptions = eventTypes.map(({ id }) => `<option value="${e(id)}" ${state.plan.eventType === id ? 'selected' : ''}>${e(t(`planner.${id}`))}</option>`).join('');
  return `<main class="container page-content planner-page"><div class="planner-layout"><div class="planner-intro"><span class="eyebrow eyebrow-light">${e(t('planner.step'))}</span><h1>${e(t('planner.title'))}</h1><p>${e(t('planner.subtitle'))}</p><div class="planner-checklist"><div>${icon('check')}<span>${e(t('home.stepOneText'))}</span></div><div>${icon('check')}<span>${e(t('home.stepTwoText'))}</span></div><div>${icon('check')}<span>${e(t('home.stepThreeText'))}</span></div></div><div class="planner-illustration"><span class="planner-illustration-icon">🎉</span><span class="planner-illustration-spark">✦</span><span class="planner-illustration-star">✦</span><div class="planner-illustration-label">FESTIVO <b>✦</b></div></div></div>
      <form class="planner-form-card" data-form="planner" novalidate><div class="planner-form-top"><span class="planner-step-circle">01</span><span>${e(t('planner.step'))}</span></div><h2>${e(t('planner.eventType'))}</h2>
        <label class="form-field">${e(t('planner.selectEvent'))}<span class="select-wrap"><select name="eventType" required><option value="">${e(t('planner.selectEvent'))}</option>${eventOptions}</select>${icon('chevron')}</span><small class="field-error" data-error="eventType"></small></label>
        <div class="form-row"><label class="form-field">${e(t('planner.date'))}<input type="date" name="date" min="${getToday()}" value="${e(state.plan.date || getDefaultDate())}" required><small class="field-error" data-error="date"></small></label><label class="form-field">${e(t('planner.guests'))}<input type="number" name="guests" min="1" max="10000" value="${e(state.plan.guests || 50)}" required><small class="field-error" data-error="guests"></small></label></div>
        <label class="form-field">${e(t('planner.venue'))} <span class="optional-label">(${e(t('common.optional'))})</span><input type="text" name="venue" placeholder="${e(t('planner.venuePlaceholder'))}" value="${e(state.plan.venue || '')}"></label>
        <p class="planner-form-note">${icon('shield')} ${e(t('planner.note'))}</p><button type="submit" class="button button-primary button-full">${e(t('planner.cta'))} ${icon('arrow')}</button>
      </form></div></main>`;
}

function cartLineCost(line) {
  const product = getProduct(line.productId);
  return (Number(product?.price) || 0) * (Number(line.quantity) || 0) * (Number(line.days) || 1);
}
function calculateTotals({ delivery = state.services.delivery, installation = state.services.installation } = {}) {
  const subtotal = state.cart.reduce((sum, line) => sum + cartLineCost(line), 0);
  const deliveryFee = state.cart.length && delivery ? 75000 : 0;
  const installationFee = state.cart.length && installation ? 140000 : 0;
  return { subtotal, deliveryFee, installationFee, total: subtotal + deliveryFee + installationFee };
}
function renderTotalsBox({ delivery = state.services.delivery, installation = state.services.installation, compact = false } = {}) {
  const totals = calculateTotals({ delivery, installation });
  return `<div class="summary-row"><span>${e(t('cart.itemsTotal'))}</span><strong>${formatMoney(totals.subtotal)}</strong></div><div class="summary-row"><span>${e(t('cart.deliveryFee'))}</span><strong>${totals.deliveryFee ? formatMoney(totals.deliveryFee) : e(t('common.free'))}</strong></div>${installation ? `<div class="summary-row"><span>${e(t('cart.installFee'))}</span><strong>${formatMoney(totals.installationFee)}</strong></div>` : ''}<div class="summary-total"><span>${e(t('common.total'))}</span><strong>${formatMoney(totals.total)}</strong></div>${compact ? '' : `<div class="summary-secure">${icon('shield')} ${e(t('cart.secure'))}</div>`}`;
}
function renderCartServiceOptions() {
  return `<div class="service-options"><h3>${e(t('cart.services'))}</h3><label class="service-option"><span class="service-option-icon service-icon-blue">${icon('truck')}</span><span class="service-option-copy"><strong>${e(t('cart.deliveryLabel'))}</strong><small>${e(t('cart.deliveryHint'))}</small></span><input type="checkbox" data-service="delivery" ${state.services.delivery ? 'checked' : ''} aria-label="${e(t('cart.deliveryLabel'))}"><span class="custom-check"></span></label><label class="service-option"><span class="service-option-icon service-icon-green">${icon('spark')}</span><span class="service-option-copy"><strong>${e(t('cart.installLabel'))}</strong><small>${e(t('cart.installHint'))}</small></span><input type="checkbox" data-service="installation" ${state.services.installation ? 'checked' : ''} aria-label="${e(t('cart.installLabel'))}"><span class="custom-check"></span></label></div>`;
}
function renderCart() {
  if (!state.cart.length) return `<main class="container page-content cart-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h1>${e(t('cart.title'))}</h1><p>${e(t('cart.subtitle'))}</p></div></div><div class="empty-state cart-empty"><span class="empty-illustration empty-bag">${icon('bag')}</span><h2>${e(t('cart.emptyTitle'))}</h2><p>${e(t('cart.emptyText'))}</p>${routeLink('/equipment', `${e(t('cart.browse'))} ${icon('arrow')}`, 'button button-primary')}</div></main>`;
  const lines = state.cart.map((line) => {
    const product = getProduct(line.productId);
    if (!product) return '';
    const lineKey = cartLineKey(line);
    return `<article class="cart-line"><div class="cart-line-art">${routeLink(`/equipment/${encodeURIComponent(product.id)}`, productArt(product, 'product-art-mini'), 'cart-art-link')}</div><div class="cart-line-info"><div class="cart-line-title-row">${routeLink(`/equipment/${encodeURIComponent(product.id)}`, e(localText(product.title, 'vendor.userTitle')), 'cart-line-title')}<button type="button" class="remove-line" data-action="remove-line" data-line-key="${e(lineKey)}" aria-label="${e(t('cart.remove'))}" title="${e(t('cart.remove'))}">${icon('trash')}</button></div><span class="product-category">${e(categoryName(product.category))}</span><div class="cart-line-controls"><label class="cart-date-field"><span>${e(t('cart.eventDate'))}</span><input type="date" min="${getToday()}" value="${e(line.date || getDefaultDate())}" data-cart-date="${e(product.id)}" data-line-key="${e(lineKey)}" data-current-date="${e(line.date || getDefaultDate())}" aria-label="${e(t('cart.editDate'))}"></label><label class="cart-duration-field"><span>${e(t('cart.rentalDays'))}</span><select data-cart-days="${e(product.id)}" data-line-key="${e(lineKey)}" data-current-days="${Number(line.days) || 1}" aria-label="${e(t('cart.rentalDays'))}">${[1, 2, 3, 4, 5].map((days) => `<option value="${days}" ${Number(line.days) === days ? 'selected' : ''}>${days} ${e(days === 1 ? t('common.day') : t('common.days'))}</option>`).join('')}</select></label></div></div><div class="cart-line-qty-price"><div class="cart-qty-control"><button type="button" data-action="cart-quantity" data-delta="-1" data-line-key="${e(lineKey)}" aria-label="−">${icon('minus')}</button><span>${Number(line.quantity) || 1}</span><button type="button" data-action="cart-quantity" data-delta="1" data-line-key="${e(lineKey)}" aria-label="+">${icon('plus')}</button></div><strong>${formatMoney(cartLineCost(line))}</strong><small>${formatMoney(product.price)} ${e(t('common.perDay'))}</small></div></article>`;
  }).join('');
  return `<main class="container page-content cart-page"><div class="page-heading page-heading-cart"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h1>${e(t('cart.title'))} <span class="heading-count">${getCartCount()}</span></h1><p>${e(t('cart.subtitle'))}</p></div>${routeLink('/equipment', `${icon('arrow')} ${e(t('product.backCatalog'))}`, 'text-link')}</div>
    <div class="cart-layout"><section class="cart-lines">${lines}<div class="cart-lines-foot">${icon('shield')}<span>${e(t('cart.secure'))}</span></div></section><aside class="order-summary-card"><h2>${e(t('cart.summary'))}</h2>${renderCartServiceOptions()}<div class="summary-divider"></div>${renderTotalsBox()}<button type="button" class="button button-primary button-full" data-action="go-checkout">${e(t('cart.checkout'))} ${icon('arrow')}</button><p class="summary-delivery-note">${e(t('cart.freeDelivery'))}</p></aside></div></main>`;
}

function renderCheckout() {
  if (!state.cart.length) return `<main class="container page-content checkout-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h1>${e(t('checkout.title'))}</h1></div></div><div class="empty-state"><span class="empty-illustration">${icon('bag')}</span><h2>${e(t('cart.emptyTitle'))}</h2><p>${e(t('cart.emptyText'))}</p>${routeLink('/equipment', e(t('cart.browse')), 'button button-primary')}</div></main>`;
  const profile = state.profile || {};
  return `<main class="container page-content checkout-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h1>${e(t('checkout.title'))}</h1><p>${e(t('checkout.subtitle'))}</p></div><div class="checkout-steps"><span class="checkout-step is-done">${icon('check')}</span><i></i><span class="checkout-step is-current">2</span><i></i><span class="checkout-step">3</span></div></div>
    <form class="checkout-layout" data-form="checkout" novalidate><div class="checkout-form-column"><section class="checkout-card"><div class="checkout-card-heading"><span class="checkout-icon">${icon('user')}</span><div><h2>${e(t('checkout.contactTitle'))}</h2><p>${e(t('checkout.subtitle'))}</p></div></div>
        <div class="form-row"><label class="form-field">${e(t('checkout.fullName'))}<input name="name" type="text" autocomplete="name" value="${e(profile.name || '')}" required><small class="field-error" data-error="name"></small></label><label class="form-field">${e(t('checkout.phone'))}<input name="phone" type="tel" autocomplete="tel" placeholder="+998 90 123 45 67" value="${e(profile.phone || '')}" required><small class="field-error" data-error="phone"></small></label></div>
        <label class="form-field">${e(t('checkout.email'))}<input name="email" type="email" autocomplete="email" value="${e(profile.email || '')}" required><small class="field-error" data-error="email"></small></label>
      </section>
      <section class="checkout-card"><div class="checkout-card-heading"><span class="checkout-icon checkout-icon-blue">${icon('truck')}</span><div><h2>${e(t('checkout.deliveryMethod'))}</h2><p>${e(t('cart.deliveryHint'))}</p></div></div>
        <div class="delivery-choice-grid"><label class="delivery-choice ${state.services.delivery ? 'is-selected' : ''}"><input type="radio" name="deliveryMethod" value="deliver" data-service="delivery-method" ${state.services.delivery ? 'checked' : ''}><span class="delivery-choice-check"></span><span class="delivery-choice-icon">${icon('truck')}</span><strong>${e(t('checkout.deliveryAddress'))}</strong><small>${e(t('cart.deliveryFee'))}: ${formatMoney(75000)}</small></label><label class="delivery-choice ${!state.services.delivery ? 'is-selected' : ''}"><input type="radio" name="deliveryMethod" value="pickup" data-service="delivery-method" ${!state.services.delivery ? 'checked' : ''}><span class="delivery-choice-check"></span><span class="delivery-choice-icon">${icon('pin')}</span><strong>${e(t('checkout.pickup'))}</strong><small>${e(t('common.free'))}</small></label></div>
        <label class="form-field delivery-address-field ${state.services.delivery ? '' : 'is-hidden'}">${e(t('checkout.address'))}<input name="address" type="text" autocomplete="street-address" value="${e(profile.address || state.plan.venue || '')}" ${state.services.delivery ? 'required' : ''}><small class="field-error" data-error="address"></small></label>
        <label class="checkout-check-option"><input type="checkbox" name="installation" data-service="installation" ${state.services.installation ? 'checked' : ''}><span class="custom-check"></span><span>${e(t('checkout.installation'))}<small>${formatMoney(140000)}</small></span></label>
      </section>
      <section class="checkout-card"><div class="checkout-card-heading"><span class="checkout-icon checkout-icon-green">${icon('calendar')}</span><div><h2>${e(t('checkout.eventDate'))}</h2><p>${e(t('product.chooseDateHint'))}</p></div></div><div class="checkout-event-dates">${state.cart.map((line) => { const product = getProduct(line.productId); return `<div><span>${e(localText(product?.title, 'vendor.userTitle'))}</span><strong>${e(formatDate(line.date))}</strong></div>`; }).join('')}</div><label class="form-field">${e(t('checkout.notes'))} <span class="optional-label">(${e(t('common.optional'))})</span><textarea name="notes" rows="3" placeholder="${e(t('checkout.notesPlaceholder'))}"></textarea></label></section>
      <label class="checkout-consent"><input type="checkbox" name="consent" required><span class="custom-check"></span><span>${e(t('checkout.consent'))}</span></label><small class="field-error consent-error" data-error="consent"></small>
      <button type="submit" class="button button-primary button-full checkout-submit">${e(t('checkout.placeOrder'))} ${icon('arrow')}</button>
    </div><aside class="order-summary-card checkout-summary"><h2>${e(t('checkout.summary'))}</h2><div class="checkout-summary-lines">${state.cart.map((line) => { const product = getProduct(line.productId); return `<div class="checkout-summary-item"><span class="checkout-summary-thumb">${e(product?.icon || '✦')}</span><span class="checkout-summary-product"><strong>${e(localText(product?.title, 'vendor.userTitle'))}</strong><small>${Number(line.quantity) || 1} × ${Number(line.days) || 1} ${e(t('common.days'))}</small></span><b>${formatMoney(cartLineCost(line))}</b></div>`; }).join('')}</div><div class="summary-divider"></div>${renderTotalsBox({ compact: true })}<div class="checkout-security-note">${icon('shield')}<span>${e(t('cart.secure'))}</span></div></aside></form></main>`;
}

function renderSuccess() {
  const bookingId = new URLSearchParams(window.location.search).get('id') || state.bookings[0]?.id || '';
  const booking = state.bookings.find((item) => item.id === bookingId);
  return `<main class="container page-content success-page"><section class="success-card"><div class="success-checkmark">${icon('check')}</div><span class="eyebrow eyebrow-light">FESTIVO</span><h1>${e(t('checkout.successTitle'))}</h1><p>${e(t('checkout.successText'))}</p>${booking ? `<div class="success-order-id"><span>${e(t('checkout.orderNumber'))}</span><strong>${e(booking.id)}</strong></div>` : ''}<div class="success-actions">${routeLink('/bookings', e(t('checkout.viewBookings')), 'button button-primary')}${routeLink('/equipment', e(t('checkout.continueShopping')), 'button button-secondary')}</div></section><div class="success-decoration success-decoration-one">✦</div><div class="success-decoration success-decoration-two">✧</div></main>`;
}

function statusLabel(status) {
  return t(`status.${status}`) || t('status.pending');
}
function renderBookingCard(booking, compact = false) {
  const itemNames = (booking.items || []).map((item) => localText(item.title, '') || localText(getProduct(item.productId)?.title, 'vendor.userTitle')).join(', ');
  return `<article class="booking-card ${compact ? 'booking-card-compact' : ''}"><div class="booking-card-top"><div><span class="booking-order-label">${e(t('bookings.order'))} <strong>${e(booking.id)}</strong></span><small>${e(t('bookings.created'))} · ${e(formatDate((booking.createdAt || '').slice(0, 10)))}</small></div><span class="status-pill status-${e(booking.status || 'pending')}"><i></i>${e(statusLabel(booking.status || 'pending'))}</span></div><div class="booking-card-middle"><div class="booking-items-preview">${(booking.items || []).slice(0, 3).map((item) => `<span>${e(item.icon || '✦')}</span>`).join('')}</div><div class="booking-card-info"><strong>${e(itemNames || t('common.noData'))}</strong><small>${e(t('bookings.eventDate'))}: ${e(formatDate(booking.eventDate || booking.items?.[0]?.date))}</small></div><div class="booking-card-price"><span>${e(t('common.total'))}</span><strong>${formatMoney(booking.total || 0)}</strong></div></div>${compact ? '' : `<div class="booking-card-footer"><span>${icon('pin')} ${e(booking.address || t('product.location'))}</span><span>${(booking.items || []).length} ${e(t('bookings.items'))}</span></div>`}</article>`;
}
function renderBookings() {
  const bookings = [...state.bookings].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return `<main class="container page-content bookings-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h1>${e(t('bookings.title'))}</h1><p>${e(t('bookings.subtitle'))}</p></div>${routeLink('/account', `${icon('user')} ${e(t('nav.account'))}`, 'button button-secondary')}</div>${bookings.length ? `<div class="booking-list">${bookings.map((booking) => renderBookingCard(booking)).join('')}</div>` : `<div class="empty-state"><span class="empty-illustration">${icon('calendar')}</span><h2>${e(t('bookings.emptyTitle'))}</h2><p>${e(t('bookings.emptyText'))}</p>${routeLink('/equipment', `${e(t('bookings.browse'))} ${icon('arrow')}`, 'button button-primary')}</div>`}</main>`;
}

function renderAccount() {
  const profile = state.profile || {};
  const bookings = [...state.bookings].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const form = `<form class="account-form" data-form="account" novalidate><label class="form-field">${e(t('account.fullName'))}<input type="text" name="name" autocomplete="name" value="${e(profile.name || '')}" required><small class="field-error" data-error="name"></small></label><label class="form-field">${e(t('account.email'))}<input type="email" name="email" autocomplete="email" value="${e(profile.email || '')}" required><small class="field-error" data-error="email"></small></label><label class="form-field">${e(t('account.phone'))}<input type="tel" name="phone" autocomplete="tel" value="${e(profile.phone || '')}" placeholder="+998 90 123 45 67" required><small class="field-error" data-error="phone"></small></label><label class="form-field">${e(t('account.address'))} <span class="optional-label">(${e(t('common.optional'))})</span><input type="text" name="address" autocomplete="street-address" value="${e(profile.address || '')}"></label><button type="submit" class="button button-primary button-full">${e(profile.name ? t('common.save') : t('account.signInButton'))} ${icon('arrow')}</button></form>`;
  return `<main class="container page-content account-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h1>${e(t('account.title'))}</h1><p>${e(t('account.subtitle'))}</p></div><span class="verified-badge">${icon('shield')} ${e(t('vendor.verified'))}</span></div>
    <div class="account-layout"><section class="account-main-card"><div class="account-card-heading"><div class="account-avatar">${profile.name ? e(profile.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()) : icon('user')}</div><div><span class="eyebrow eyebrow-light">${e(t('account.profile'))}</span><h2>${profile.name ? e(t('account.welcome', { name: profile.name.split(' ')[0] })) : e(state.accountMode === 'signup' ? t('account.createAccount') : t('account.signIn'))}</h2>${profile.email ? `<small>${e(profile.email)}</small>` : `<small>${e(t('account.note'))}</small>`}</div>${profile.name ? `<button type="button" class="button button-secondary account-logout" data-action="logout">${e(t('account.logout'))}</button>` : ''}</div>
      ${!profile.name ? `<div class="account-mode-tabs"><button type="button" class="${state.accountMode === 'signin' ? 'is-selected' : ''}" data-action="account-mode" data-mode="signin">${e(t('account.signIn'))}</button><button type="button" class="${state.accountMode === 'signup' ? 'is-selected' : ''}" data-action="account-mode" data-mode="signup">${e(t('account.createAccount'))}</button></div>` : ''}${form}
      <div class="account-local-note">${icon('shield')} ${e(t('account.note'))}</div></section>
      <aside class="account-side-column"><section class="account-side-card account-orders-card"><div class="account-side-heading"><span class="account-side-icon icon-red">${icon('bag')}</span><span><small>${e(t('account.orders'))}</small><strong>${bookings.length}</strong></span></div><p>${e(t('account.subtitle'))}</p>${routeLink('/bookings', `${e(t('bookings.title'))} ${icon('arrow')}`, 'text-link')}</section>
      <section class="account-side-card notification-card"><div class="notification-heading"><span class="account-side-icon icon-blue">${icon('spark')}</span><div><h3>${e(t('account.notifications'))}</h3><small>${e(t('account.notificationsText'))}</small></div></div>${bookings.length ? `<div class="account-notification-list">${bookings.slice(0, 2).map((booking) => `<div class="account-notification-row"><span class="notification-dot"></span><span><strong>${e(t('bookings.order'))} ${e(booking.id)}</strong><small>${e(statusLabel(booking.status || 'pending'))} · ${e(formatDate(booking.eventDate || booking.items?.[0]?.date))}</small></span></div>`).join('')}</div>` : `<div class="account-notification-empty">${icon('clock')} ${e(t('account.notificationsText'))}</div>`}</section>
      <section class="account-side-card account-partner-card"><div class="account-side-icon icon-green">${icon('spark')}</div><h3>${e(t('vendor.title'))}</h3><p>${e(t('vendor.help'))}</p>${routeLink('/vendor', `${e(t('nav.vendor'))} ${icon('arrow')}`, 'text-link')}</section></aside></div>
  </main>`;
}

const vendorSeedIds = new Set(['sound-pro', 'festoon-lights', 'banquet-set']);
function getVendorProducts() {
  return getProducts().filter((product) => vendorSeedIds.has(product.id) || product.owner === 'current-vendor');
}
function renderVendor() {
  const products = getVendorProducts();
  const activeCount = products.filter(isActive).length;
  const vendorBookings = state.bookings.filter((booking) => (booking.items || []).some((item) => products.some((product) => product.id === item.productId)));
  const revenue = vendorBookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
  return `<main class="container page-content dashboard-page vendor-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">FESTIVO · ${e(t('vendor.dashboard'))}</span><h1>${e(t('vendor.title'))}</h1><p>${e(t('vendor.subtitle'))}</p></div><span class="verified-badge">${icon('shield')} ${e(t('vendor.verified'))}</span></div>
    <div class="dashboard-stats-grid"><article class="dashboard-stat"><span class="stat-icon stat-red">${icon('bag')}</span><small>${e(t('vendor.available'))}</small><strong>${activeCount}</strong><span class="stat-caption">${e(t('vendor.myListings'))}</span></article><article class="dashboard-stat"><span class="stat-icon stat-blue">${icon('calendar')}</span><small>${e(t('vendor.rented'))}</small><strong>${vendorBookings.length}</strong><span class="stat-caption">${e(t('vendor.orders'))}</span></article><article class="dashboard-stat"><span class="stat-icon stat-green">${icon('spark')}</span><small>${e(t('vendor.revenue'))}</small><strong class="stat-revenue">${formatMoney(revenue)}</strong><span class="stat-caption">${e(t('admin.grossVolume'))}</span></article></div>
    <div class="vendor-workspace"><section class="dashboard-panel vendor-listings-panel"><div class="dashboard-panel-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h2>${e(t('vendor.myListings'))}</h2></div><span class="panel-count">${products.length}</span></div>${products.length ? `<div class="vendor-listing-list">${products.map((product) => `<article class="vendor-listing-row"><span class="vendor-listing-art">${e(product.icon || '✦')}</span><div class="vendor-listing-info"><strong>${e(localText(product.title, 'vendor.userTitle'))}</strong><small>${e(categoryName(product.category))} · ${formatMoney(product.price)} ${e(t('common.perDay'))}</small></div><span class="listing-status ${isActive(product) ? 'listing-status-active' : 'listing-status-paused'}"><i></i>${e(isActive(product) ? t('common.active') : t('common.paused'))}</span><button type="button" class="listing-toggle ${isActive(product) ? '' : 'is-paused'}" data-action="listing-toggle" data-id="${e(product.id)}">${e(isActive(product) ? t('vendor.pause') : t('vendor.activate'))}</button></article>`).join('')}</div>` : `<div class="inline-empty">${e(t('vendor.noListings'))}</div>`}</section>
      <section class="dashboard-panel vendor-add-panel"><div class="dashboard-panel-heading"><div><span class="eyebrow eyebrow-light">${e(t('vendor.verification'))}</span><h2>${e(t('vendor.addListing'))}</h2></div><span class="vendor-add-icon">${icon('plus')}</span></div><p class="dashboard-panel-description">${e(t('vendor.addListingText'))}</p>
        <form class="vendor-listing-form" data-form="vendor-listing" novalidate><label class="form-field">${e(t('vendor.listingName'))}<input type="text" name="title" required><small class="field-error" data-error="title"></small></label><label class="form-field">${e(t('vendor.listingCategory'))}<span class="select-wrap"><select name="category" required><option value="">${e(t('catalog.category'))}</option>${categories.map((category) => `<option value="${e(category.id)}">${e(categoryName(category.id))}</option>`).join('')}</select>${icon('chevron')}</span><small class="field-error" data-error="category"></small></label><label class="form-field">${e(t('vendor.listingPrice'))}<div class="price-input-wrap"><input type="number" name="price" min="1" step="1000" required><span>${e(t('common.currency'))}</span></div><small class="field-error" data-error="price"></small></label><label class="form-field">${e(t('vendor.listingDescription'))}<textarea name="description" rows="3" placeholder="${e(t('vendor.descriptionPlaceholder'))}" required></textarea><small class="field-error" data-error="description"></small></label><button type="submit" class="button button-primary button-full">${e(t('vendor.addListingButton'))} ${icon('arrow')}</button></form><p class="vendor-help-note">${icon('phone')} ${e(t('vendor.help'))}</p>
      </section></div>
    <section class="dashboard-panel vendor-orders-panel"><div class="dashboard-panel-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h2>${e(t('vendor.orders'))}</h2></div>${routeLink('/bookings', `${e(t('common.seeAll'))} ${icon('arrow')}`, 'text-link')}</div>${vendorBookings.length ? `<div class="booking-list booking-list-compact">${vendorBookings.slice(0, 3).map((booking) => renderBookingCard(booking, true)).join('')}</div>` : `<div class="inline-empty">${e(t('vendor.noOrders'))}</div>`}</section></main>`;
}

function renderAdmin() {
  const products = getProducts();
  const activeProducts = products.filter(isActive);
  const vendors = new Set(products.map((product) => product.vendorName || 'FESTIVO')).size;
  const bookingValue = state.bookings.reduce((sum, booking) => sum + (booking.total || 0), 0);
  const bookingAction = (booking) => {
    if (booking.status === 'pending') return ['confirmed', t('admin.confirm')];
    if (booking.status === 'confirmed' || booking.status === 'preparing') return ['delivered', t('admin.markDelivered')];
    if (booking.status === 'delivered') return ['completed', t('admin.completeBooking')];
    return null;
  };
  return `<main class="container page-content dashboard-page admin-page"><div class="page-heading"><div><span class="eyebrow eyebrow-light">FESTIVO · ${e(t('admin.overview'))}</span><h1>${e(t('admin.title'))}</h1><p>${e(t('admin.subtitle'))}</p></div><span class="admin-mode-badge">${icon('shield')} ${e(t('nav.admin'))}</span></div>
    <div class="dashboard-stats-grid admin-stats-grid"><article class="dashboard-stat"><span class="stat-icon stat-red">${icon('bag')}</span><small>${e(t('admin.totalOrders'))}</small><strong>${state.bookings.length}</strong><span class="stat-caption">${e(t('status.pending'))}</span></article><article class="dashboard-stat"><span class="stat-icon stat-blue">${icon('user')}</span><small>${e(t('admin.totalVendors'))}</small><strong>${vendors}</strong><span class="stat-caption">${e(t('vendor.verified'))}</span></article><article class="dashboard-stat"><span class="stat-icon stat-green">${icon('spark')}</span><small>${e(t('admin.totalListings'))}</small><strong>${activeProducts.length}</strong><span class="stat-caption">${e(t('admin.manageListings'))}</span></article><article class="dashboard-stat"><span class="stat-icon stat-navy">${icon('arrow')}</span><small>${e(t('admin.grossVolume'))}</small><strong class="stat-revenue">${formatMoney(bookingValue)}</strong><span class="stat-caption">FESTIVO</span></article></div>
    <div class="admin-content-grid"><section class="dashboard-panel admin-orders-panel"><div class="dashboard-panel-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h2>${e(t('admin.recentOrders'))}</h2></div><span class="panel-count">${state.bookings.length}</span></div>${state.bookings.length ? `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>${e(t('admin.orderId'))}</th><th>${e(t('admin.customer'))}</th><th>${e(t('admin.event'))}</th><th>${e(t('admin.payment'))}</th><th>${e(t('common.status'))}</th><th>${e(t('admin.action'))}</th></tr></thead><tbody>${[...state.bookings].reverse().map((booking) => { const next = bookingAction(booking); return `<tr><td><strong>${e(booking.id)}</strong></td><td>${e(booking.name || t('account.guest'))}</td><td>${e(formatDate(booking.eventDate))}</td><td>${formatMoney(booking.total)}</td><td><span class="status-pill status-${e(booking.status || 'pending')}"><i></i>${e(statusLabel(booking.status || 'pending'))}</span></td><td>${next ? `<button type="button" class="table-action-button" data-action="booking-status" data-id="${e(booking.id)}" data-status="${e(next[0])}">${e(next[1])}</button>` : `<span class="table-done">${icon('check')}</span>`}</td></tr>`; }).join('')}</tbody></table></div>` : `<div class="inline-empty">${e(t('admin.noOrders'))}</div>`}</section>
    <section class="dashboard-panel admin-listings-panel"><div class="dashboard-panel-heading"><div><span class="eyebrow eyebrow-light">FESTIVO</span><h2>${e(t('admin.manageListings'))}</h2></div>${routeLink('/vendor', `${e(t('nav.vendor'))} ${icon('arrow')}`, 'text-link')}</div><div class="admin-listing-list">${products.map((product) => `<article class="admin-listing-row"><span class="admin-product-emoji">${e(product.icon || '✦')}</span><div class="admin-listing-info"><strong>${e(localText(product.title, 'vendor.userTitle'))}</strong><small>${e(categoryName(product.category))} · ${formatMoney(product.price)} ${e(t('common.perDay'))}</small></div><span class="admin-listing-status ${isActive(product) ? 'is-published' : ''}">${e(isActive(product) ? t('admin.listingActive') : t('admin.listingPaused'))}</span><button type="button" class="admin-listing-toggle" data-action="listing-toggle" data-id="${e(product.id)}" aria-label="${e(isActive(product) ? t('admin.reject') : t('admin.approve'))}">${icon(isActive(product) ? 'check' : 'plus')}</button></article>`).join('')}</div></section></div><p class="admin-note">${icon('shield')} ${e(t('admin.note'))}</p></main>`;
}

function renderLegal(path) {
  const pageMap = {
    '/about': ['footer.about', 'legal.aboutTitle', 'legal.aboutText'],
    '/terms': ['footer.terms', 'legal.termsTitle', 'legal.termsText'],
    '/privacy': ['footer.privacy', 'legal.privacyTitle', 'legal.privacyText'],
    '/help': ['footer.helpCenter', 'legal.helpTitle', 'legal.helpText'],
  };
  const page = pageMap[path] || pageMap['/help'];
  return `<main class="container page-content legal-page"><div class="legal-card"><span class="eyebrow eyebrow-light">FESTIVO · ${e(t(page[0]))}</span><h1>${e(t(page[1]))}</h1><p>${e(t(page[2]))}</p><div class="legal-contact-card">${icon('mail')}<span><small>${e(t('footer.contact'))}</small><a href="mailto:hello@festivo.uz">${e(t('legal.contactEmail'))}</a></span></div>${routeLink('/', `${e(t('common.goHome'))} ${icon('arrow')}`, 'button button-secondary')}</div><div class="legal-decoration">✦</div></main>`;
}

function renderMain(path) {
  if (path === '/') return renderHome();
  if (path === '/equipment') return renderEquipment();
  if (path.startsWith('/equipment/')) return renderProductDetail(path.slice('/equipment/'.length));
  if (path === '/services') return renderServices();
  if (path === '/planner') return renderPlanner();
  if (path === '/cart') return renderCart();
  if (path === '/checkout/success') return renderSuccess();
  if (path === '/checkout') return renderCheckout();
  if (path === '/bookings') return renderBookings();
  if (path === '/account') return renderAccount();
  if (path === '/vendor') return renderVendor();
  if (path === '/admin') return renderAdmin();
  if (['/about', '/terms', '/privacy', '/help'].includes(path)) return renderLegal(path);
  return `<main class="container page-content"><div class="empty-state not-found-state"><span class="empty-illustration">${icon('spark')}</span><h1>${e(t('catalog.emptyTitle'))}</h1><p>${e(t('catalog.emptyText'))}</p>${routeLink('/', e(t('common.goHome')), 'button button-primary')}</div></main>`;
}
function currentPath() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path;
}
function captureFormValues() {
  const values = {};
  root.querySelectorAll('form').forEach((form, index) => {
    const formValues = {};
    form.querySelectorAll('[name]').forEach((field) => {
      if (field.type === 'checkbox') formValues[field.name] = field.checked;
      else if (field.type === 'radio') { if (field.checked) formValues[field.name] = field.value; }
      else formValues[field.name] = field.value;
    });
    values[form.dataset.form || `form-${index}`] = formValues;
  });
  return values;
}
function restoreFormValues(values) {
  root.querySelectorAll('form').forEach((form, index) => {
    const formValues = values[form.dataset.form || `form-${index}`];
    if (!formValues) return;
    form.querySelectorAll('[name]').forEach((field) => {
      if (!(field.name in formValues)) return;
      if (field.type === 'checkbox') field.checked = Boolean(formValues[field.name]);
      else if (field.type === 'radio') field.checked = field.value === formValues[field.name];
      else if (field.type !== 'hidden') field.value = formValues[field.name];
    });
  });
}
function render(options = {}) {
  const values = options.preserveForm ? captureFormValues() : null;
  const path = currentPath();
  document.documentElement.lang = state.language;
  const titleKey = path === '/' ? 'hero.trust' : path.startsWith('/equipment') ? 'nav.equipment' : path.startsWith('/checkout') ? 'checkout.title' : path === '/vendor' ? 'vendor.title' : path === '/admin' ? 'admin.title' : path === '/bookings' ? 'bookings.title' : path === '/account' ? 'account.title' : path === '/services' ? 'services.title' : path === '/planner' ? 'planner.title' : path === '/cart' ? 'cart.title' : path === '/about' ? 'legal.aboutTitle' : path === '/terms' ? 'legal.termsTitle' : path === '/privacy' ? 'legal.privacyTitle' : path === '/help' ? 'legal.helpTitle' : 'hero.trust';
  document.title = `FESTIVO — ${t(titleKey)}`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute('content', t('hero.subtitle'));
  root.innerHTML = `${renderHeader(path)}${renderMain(path)}${renderFooter()}<div class="toast-region" aria-live="polite" aria-atomic="true"><div class="toast-message ${state.toast ? 'is-visible' : ''}" role="status">${state.toast ? `${icon('check')}<span>${e(t(state.toast))}</span>` : ''}</div></div>`;
  if (values) restoreFormValues(values);
}
function navigate(path, { replace = false, preserveForm = false } = {}) {
  const [url, hash] = path.split('#');
  if (replace) window.history.replaceState({}, '', url || '/');
  else window.history.pushState({}, '', url || '/');
  state.menuOpen = false;
  render({ preserveForm });
  if (hash) window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

function showToast(key) {
  state.toast = key;
  const toast = root.querySelector('.toast-message');
  if (toast) {
    toast.innerHTML = `${icon('check')}<span>${e(t(key))}</span>`;
    toast.classList.add('is-visible');
  }
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    state.toast = '';
    const activeToast = root.querySelector('.toast-message');
    if (activeToast) activeToast.classList.remove('is-visible');
  }, 3200);
}
function setLanguage(language) {
  if (!translations[language] || state.language === language) return;
  state.language = language;
  writeStore(STORE.language, language);
  render({ preserveForm: true });
}
function updateCart() { writeStore(STORE.cart, state.cart); }
function updateServices() { writeStore(STORE.services, state.services); }
function updateBookings() { writeStore(STORE.bookings, state.bookings); }
function updateListings() { writeStore(STORE.listings, state.listings); }
function updateListingStatus() { writeStore(STORE.listingStatus, state.listingStatus); }
function updatePlan() { writeStore(STORE.plan, state.plan); state.eventDate = state.plan.date || getDefaultDate(); }
function parseFormValue(form, name) {
  const checked = form.querySelector(`[name="${name}"]:checked`);
  if (checked) return checked.value;
  const field = form.querySelector(`[name="${name}"]`);
  return field?.value ?? '';
}
function clearFormErrors(form) {
  form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
}
function setFormError(form, name, key) {
  const field = form.querySelector(`[name="${name}"]`);
  const error = form.querySelector(`[data-error="${name}"]`);
  if (field) field.setAttribute('aria-invalid', 'true');
  if (error) error.textContent = t(key);
}
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validPhone(phone) { return String(phone).replace(/\D/g, '').length >= 7; }
function isDateValid(date) { return Boolean(date) && date >= getToday(); }
function quantityFromForm(form, name = 'quantity') { return Math.max(1, Math.min(100, Math.floor(Number(parseFormValue(form, name)) || 1))); }
function addToCart(product, { date, quantity = 1, days = 1 } = {}) {
  if (!product) return false;
  const targetDate = date || state.eventDate || getDefaultDate();
  const matchingLine = state.cart.find((line) => line.productId === product.id && line.date === targetDate && Number(line.days) === Number(days));
  if (matchingLine) matchingLine.quantity = Math.min(100, (Number(matchingLine.quantity) || 0) + quantity);
  else state.cart.push({ productId: product.id, quantity: Math.max(1, quantity), date: targetDate, days: Math.max(1, days) });
  updateCart();
  return true;
}
function cartLineKey(line) {
  return `${line.productId}::${line.date || ''}::${Number(line.days) || 1}`;
}
function updateCartLine(lineKey, updater) {
  const index = state.cart.findIndex((line) => cartLineKey(line) === lineKey);
  if (index < 0) return;
  updater(state.cart[index]);
  if (Number(state.cart[index].quantity) <= 0) state.cart.splice(index, 1);
  updateCart();
}

function renderWithToast(key) {
  render({ preserveForm: true });
  showToast(key);
}

root.addEventListener('click', (event) => {
  const langButton = event.target.closest('[data-lang]');
  if (langButton) {
    setLanguage(langButton.dataset.lang);
    return;
  }
  const internalLink = event.target.closest('a[data-link]');
  if (internalLink && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    event.preventDefault();
    navigate(internalLink.getAttribute('href') || '/');
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  const action = button.dataset.action;
  if (action === 'menu-toggle') {
    state.menuOpen = !state.menuOpen;
    render({ preserveForm: true });
  } else if (action === 'quick-add') {
    const product = getProduct(button.dataset.id);
    const date = state.eventDate || getDefaultDate();
    addToCart(product, { date, quantity: 1, days: 1 });
    renderWithToast('toast.added');
  } else if (action === 'detail-qty') {
    const form = button.closest('form');
    const input = form?.querySelector('[name="quantity"]');
    if (input) {
      const max = Number(input.max) || 100;
      input.value = Math.max(1, Math.min(max, (Number(input.value) || 1) + Number(button.dataset.delta || 0)));
    }
  } else if (action === 'cart-quantity') {
    updateCartLine(button.dataset.lineKey, (line) => { line.quantity = (Number(line.quantity) || 1) + Number(button.dataset.delta || 0); });
    render({ preserveForm: true });
  } else if (action === 'remove-line') {
    state.cart = state.cart.filter((line) => cartLineKey(line) !== button.dataset.lineKey);
    updateCart();
    renderWithToast('toast.removed');
  } else if (action === 'go-checkout') {
    if (state.cart.length) navigate('/checkout');
  } else if (action === 'clear-filters') {
    navigate('/equipment');
  } else if (action === 'listing-toggle') {
    const product = getProduct(button.dataset.id);
    if (product) {
      state.listingStatus[product.id] = !isActive(product);
      updateListingStatus();
      renderWithToast('toast.listingStatus');
    }
  } else if (action === 'booking-status') {
    const booking = state.bookings.find((item) => item.id === button.dataset.id);
    if (booking) {
      booking.status = button.dataset.status;
      updateBookings();
      renderWithToast('toast.bookingUpdated');
    }
  } else if (action === 'account-mode') {
    state.accountMode = button.dataset.mode || 'signin';
    render({ preserveForm: true });
  } else if (action === 'logout') {
    state.profile = null;
    try { localStorage.removeItem(STORE.profile); } catch { /* Storage may be unavailable. */ }
    state.accountMode = 'signin';
    renderWithToast('toast.profileSaved');
  }
});

root.addEventListener('change', (event) => {
  const target = event.target;
  if (target.matches('[data-filter]')) {
    const params = new URLSearchParams(window.location.search);
    if (target.dataset.filter === 'category') {
      target.value === 'all' ? params.delete('category') : params.set('category', target.value);
    } else if (target.dataset.filter === 'sort') {
      target.value === 'popular' ? params.delete('sort') : params.set('sort', target.value);
    } else if (target.dataset.filter === 'priceMax') {
      const price = Math.max(0, Math.floor(Number(target.value) || 0));
      price ? params.set('maxPrice', String(price)) : params.delete('maxPrice');
    }
    const query = params.toString();
    navigate(`/equipment${query ? `?${query}` : ''}`);
    return;
  }
  if (target.matches('[data-cart-date]')) {
    const productId = target.dataset.cartDate;
    const oldDate = target.dataset.currentDate;
    const lineKey = target.dataset.lineKey;
    if (!isDateValid(target.value)) {
      target.value = oldDate;
      return;
    }
    updateCartLine(lineKey, (line) => { line.date = target.value; });
    render({ preserveForm: true });
    return;
  }
  if (target.matches('[data-cart-days]')) {
    const lineKey = target.dataset.lineKey;
    const line = state.cart.find((item) => cartLineKey(item) === lineKey);
    if (line) {
      line.days = Math.max(1, Math.min(5, Number(target.value) || 1));
      updateCart();
      render({ preserveForm: true });
    }
    return;
  }
  if (target.matches('[data-service="delivery"]')) {
    state.services.delivery = target.checked;
    updateServices();
    render({ preserveForm: true });
  } else if (target.matches('[data-service="installation"]')) {
    state.services.installation = target.checked;
    updateServices();
    render({ preserveForm: true });
  } else if (target.matches('[data-service="delivery-method"]')) {
    state.services.delivery = target.value === 'deliver';
    updateServices();
    render({ preserveForm: true });
  }
});

root.addEventListener('submit', (event) => {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();
  const kind = form.dataset.form;
  clearFormErrors(form);

  if (kind === 'home-search') {
    const query = parseFormValue(form, 'q').trim();
    const date = parseFormValue(form, 'date');
    const guests = Math.max(1, Math.floor(Number(parseFormValue(form, 'guests')) || 1));
    if (date && !isDateValid(date)) { showToast('checkout.dateError'); return; }
    if (date) state.plan.date = date;
    state.plan.guests = guests;
    state.eventDate = state.plan.date || getDefaultDate();
    updatePlan();
    navigate(`/equipment${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    return;
  }

  if (kind === 'catalog-search') {
    const query = parseFormValue(form, 'q').trim();
    const params = new URLSearchParams(window.location.search);
    query ? params.set('q', query) : params.delete('q');
    const serialized = params.toString();
    navigate(`/equipment${serialized ? `?${serialized}` : ''}`);
    return;
  }

  if (kind === 'planner') {
    const eventType = parseFormValue(form, 'eventType');
    const date = parseFormValue(form, 'date');
    const guests = Number(parseFormValue(form, 'guests'));
    const venue = parseFormValue(form, 'venue').trim();
    let valid = true;
    if (!eventType) { setFormError(form, 'eventType', 'validation.category'); valid = false; }
    if (!date) { setFormError(form, 'date', 'validation.date'); valid = false; }
    else if (!isDateValid(date)) { setFormError(form, 'date', 'validation.datePast'); valid = false; }
    if (!guests || guests < 1) { setFormError(form, 'guests', 'validation.quantity'); valid = false; }
    if (!valid) return;
    state.plan = { ...state.plan, eventType, date, guests: Math.min(10000, Math.floor(guests)), venue };
    updatePlan();
    const selectedEvent = eventTypes.find((item) => item.id === eventType);
    const category = selectedEvent?.category;
    navigate(`/equipment${category ? `?category=${encodeURIComponent(category)}` : ''}`);
    return;
  }

  if (kind === 'product-booking') {
    const product = getProduct(form.dataset.id);
    const date = parseFormValue(form, 'date');
    const quantity = Number(parseFormValue(form, 'quantity'));
    const days = Number(parseFormValue(form, 'days')) || 1;
    let valid = true;
    if (!date) { setFormError(form, 'date', 'validation.date'); valid = false; }
    else if (!isDateValid(date)) { setFormError(form, 'date', 'validation.datePast'); valid = false; }
    if (!quantity || quantity < 1) { setFormError(form, 'quantity', 'validation.quantity'); valid = false; }
    if (!valid || !product) return;
    state.eventDate = date;
    state.plan.date = date;
    updatePlan();
    addToCart(product, { date, quantity: Math.min(Number(product.stock) || 100, Math.floor(quantity)), days: Math.max(1, Math.min(5, days)) });
    renderWithToast('toast.added');
    return;
  }

  if (kind === 'checkout') {
    const name = parseFormValue(form, 'name').trim();
    const email = parseFormValue(form, 'email').trim();
    const phone = parseFormValue(form, 'phone').trim();
    const address = parseFormValue(form, 'address').trim();
    const delivery = parseFormValue(form, 'deliveryMethod') === 'deliver';
    const installation = Boolean(form.querySelector('[name="installation"]')?.checked);
    const consent = Boolean(form.querySelector('[name="consent"]')?.checked);
    const notes = parseFormValue(form, 'notes').trim();
    let valid = true;
    if (!name) { setFormError(form, 'name', 'validation.name'); valid = false; }
    if (!validEmail(email)) { setFormError(form, 'email', 'validation.email'); valid = false; }
    if (!validPhone(phone)) { setFormError(form, 'phone', 'validation.phone'); valid = false; }
    if (delivery && !address) { setFormError(form, 'address', 'validation.address'); valid = false; }
    const invalidLine = state.cart.find((line) => !isDateValid(line.date));
    if (invalidLine) { showToast('checkout.dateError'); valid = false; }
    if (!consent) { setFormError(form, 'consent', 'validation.terms'); valid = false; }
    if (!valid) return;
    const totals = calculateTotals({ delivery, installation });
    let bookingId = `FV-${String(Date.now()).slice(-7)}`;
    while (state.bookings.some((booking) => booking.id === bookingId)) bookingId = `FV-${String(Date.now() + Math.floor(Math.random() * 10000)).slice(-7)}`;
    const items = state.cart.map((line) => {
      const product = getProduct(line.productId);
      return { productId: line.productId, title: product?.title || { [state.language]: t('vendor.userTitle') }, icon: product?.icon || '✦', quantity: Number(line.quantity) || 1, days: Number(line.days) || 1, date: line.date, price: Number(product?.price) || 0 };
    });
    const booking = { id: bookingId, status: 'pending', createdAt: new Date().toISOString(), name, email, phone, address: delivery ? address : '', notes, delivery, installation, eventDate: items[0]?.date || getDefaultDate(), items, subtotal: totals.subtotal, deliveryFee: totals.deliveryFee, installationFee: totals.installationFee, total: totals.total };
    state.bookings.push(booking);
    updateBookings();
    state.profile = { ...(state.profile || {}), name, email, phone, address: delivery ? address : (state.profile?.address || '') };
    writeStore(STORE.profile, state.profile);
    state.services = { delivery, installation };
    updateServices();
    state.cart = [];
    updateCart();
    navigate(`/checkout/success?id=${encodeURIComponent(bookingId)}`);
    return;
  }

  if (kind === 'account') {
    const name = parseFormValue(form, 'name').trim();
    const email = parseFormValue(form, 'email').trim();
    const phone = parseFormValue(form, 'phone').trim();
    const address = parseFormValue(form, 'address').trim();
    let valid = true;
    if (!name) { setFormError(form, 'name', 'validation.name'); valid = false; }
    if (!validEmail(email)) { setFormError(form, 'email', 'validation.email'); valid = false; }
    if (!validPhone(phone)) { setFormError(form, 'phone', 'validation.phone'); valid = false; }
    if (!valid) return;
    state.profile = { name, email, phone, address };
    writeStore(STORE.profile, state.profile);
    state.accountMode = 'signin';
    renderWithToast('toast.profileSaved');
    return;
  }

  if (kind === 'vendor-listing') {
    const title = parseFormValue(form, 'title').trim();
    const category = parseFormValue(form, 'category');
    const price = Number(parseFormValue(form, 'price'));
    const description = parseFormValue(form, 'description').trim();
    let valid = true;
    if (!title) { setFormError(form, 'title', 'validation.listingTitle'); valid = false; }
    if (!category) { setFormError(form, 'category', 'validation.category'); valid = false; }
    if (!price || price < 1) { setFormError(form, 'price', 'validation.price'); valid = false; }
    if (!description) { setFormError(form, 'description', 'validation.listingDescription'); valid = false; }
    if (!valid) return;
    const listingTitle = Object.fromEntries(languages.map(({ code }) => [code, translate(code, 'vendor.userTitle')]));
    const listingDescription = Object.fromEntries(languages.map(({ code }) => [code, translate(code, 'vendor.userDescription')]));
    listingTitle[state.language] = title;
    listingDescription[state.language] = description;
    const listing = {
      id: `partner-${Date.now()}`, category, title: listingTitle, description: listingDescription,
      includes: Object.fromEntries(languages.map(({ code }) => [code, [translate(code, 'vendor.userDescription')]])), price: Math.floor(price), rating: 5, reviews: 0, stock: 1,
      featured: false, badge: 'new', vendorName: state.profile?.name || 'FESTIVO Partner', icon: getCategory(category)?.icon || '✦',
      art: `art-${getCategory(category)?.tone || 'blue'}`, active: true, owner: 'current-vendor',
    };
    state.listings.unshift(listing);
    updateListings();
    state.listingStatus[listing.id] = true;
    updateListingStatus();
    form.reset();
    renderWithToast('toast.listingAdded');
    return;
  }

  if (kind === 'newsletter') {
    const email = parseFormValue(form, 'email').trim();
    if (!validEmail(email)) {
      const input = form.querySelector('[name="email"]');
      input?.setAttribute('aria-invalid', 'true');
      input?.focus();
      showToast('validation.email');
      return;
    }
    writeStore(STORE.newsletter, { email, subscribedAt: new Date().toISOString() });
    form.reset();
    showToast('toast.newsletter');
  }
});

window.addEventListener('popstate', () => {
  state.menuOpen = false;
  render();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.menuOpen) {
    state.menuOpen = false;
    render({ preserveForm: true });
  }
});

render();
