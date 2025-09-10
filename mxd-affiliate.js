// --- MXD Affiliate Core ------------------------------------------------------
const DEFAULT_UTM = { utm_source: 'mxd', utm_medium: 'affiliate', utm_campaign: 'site' };

async function loadLinks() {
  let m = {};
  try {
    const r = await fetch('links.json', { cache: 'no-store' });
    if (r.ok) m = await r.json();
  } catch {}
  const l = JSON.parse(localStorage.getItem('mxd_links') || '{}');
  return { ...m, ...l };
}

function ensureURL(u) {
  try { return new URL(u); }
  catch { return new URL(u, location.href); }
}

function getSubId() {
  return localStorage.getItem('mxd_subid') || Date.now().toString(36);
}

// Ghép UTM + params (phù hợp D2C/URL có thể gắn query thẳng)
function buildUrl(base, params, subid) {
  const url = ensureURL(base);
  Object.entries(params || {}).forEach(([k, v]) => {
    const val = String(v ?? '').replaceAll('{SUBID}', subid);
    if (val) url.searchParams.set(k, val);
  });
  Object.entries(DEFAULT_UTM).forEach(([k, v]) => {
    if (!url.searchParams.has(k)) url.searchParams.set(k, v);
  });
  if (!url.searchParams.has('subid')) url.searchParams.set('subid', subid);
  return url.toString();
}

// Gắn link theo links.json cho các nút có data-product-id
async function wireAffiliateClicks() {
  const map = await loadLinks();
  document.querySelectorAll('[data-product-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-product-id');
      const it = map[id];
      if (!it || !it.url) return; // schema D2C: {url, params, network}
      const subid = el.getAttribute('data-subid') || getSubId();
      const finalUrl = buildUrl(it.url, it.params, subid);
      el.setAttribute('href', finalUrl);
      try { gtag('event', 'affiliate_click', { item_id: id, network: it.network || 'na', subid }); } catch {}
    }, { once: true });
  });
}

document.addEventListener('DOMContentLoaded', wireAffiliateClicks);

// --- Shopee auto-rewrite qua ACCESSTRADE deeplink ----------------------------
// Dùng cho <a data-merchant="shopee" href="https://shopee.vn/...">Mua ngay</a>
// -> Tự đổi thành https://go.isclix.com/deep_link/... của BẠN.
;(() => {
  const PREFIX = 'https://go.isclix.com/deep_link/v6/5786623638831429755/4751584435713464237?sub4=oneatweb&url_enc=';
  const SUFFIX = ''; // ví dụ có thể thêm: '&sub1=mxd&sub2=page&sub3=btn'

  // base64 (UTF-8 safe)
  const b64utf8 = (str) => {
    const bytes = new TextEncoder().encode(str);
    let bin = ''; for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin);
  };

  function rewriteLink(a) {
    try {
      const u = new URL(a.getAttribute('href') || '', location.href);
      const host = u.hostname.replace(/^www\./, '');
      if (!host.endsWith('shopee.vn')) return;        // chỉ Shopee
      const enc = encodeURIComponent(b64utf8(u.href));
      a.href = `${PREFIX}${enc}${SUFFIX}`;
      a.rel  = 'sponsored noopener';
    } catch {}
  }

  function boot() {
    // chỉ rewrite các nút được đánh dấu rõ ràng
    document.querySelectorAll('a[data-merchant="shopee"]').forEach(rewriteLink);
  }

  document.addEventListener('DOMContentLoaded', boot);
})();

// --- Admin gate (giữ nguyên hành vi cũ) --------------------------------------
if (location.hash === '#admin') {
  localStorage.setItem('mxd_admin_gate', '1');
  location.replace('admin.html');
}
