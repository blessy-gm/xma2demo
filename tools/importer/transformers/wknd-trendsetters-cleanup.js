/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 *
 * Removes non-authorable site chrome and Astro build artifacts from the
 * scraped homepage. All selectors are taken from migration-work/cleaned.html
 * (the captured DOM), never guessed.
 *
 * Source is an Astro-built site: elements carry data-astro-cid-* attributes
 * and utility-* classes. The navbar (body > div.navbar) and footer
 * (body > footer) are the global site shell and are auto-populated in EDS,
 * so they are removed here.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Nothing here blocks block parsing on this page. Non-authorable chrome
    // (navbar/footer/breadcrumbs/skip-link) is removed in afterTransform so it
    // is present for any block matching that relies on document context.
  }

  if (hookName === TransformHook.afterTransform) {
    // --- Non-authorable site chrome (from cleaned.html) ---
    WebImporter.DOMUtils.remove(element, [
      // Skip-to-content link (cleaned.html line 1: <a ... class="skip-link">)
      'a.skip-link',
      // Global navbar shell — auto-populated in EDS (cleaned.html line 1: <div class="navbar">)
      '.navbar',
      // Global footer shell — auto-populated in EDS (cleaned.html line 178: <footer class="footer inverse-footer">)
      'footer',
      // Breadcrumb trail inside the featured-story section (cleaned.html line 49: <div class="breadcrumbs">)
      '.breadcrumbs',
      // Safe, non-authorable elements
      'iframe',
      'link',
      'noscript',
    ]);

    // --- Strip Astro build artifacts: data-astro-cid-* attributes ---
    // Present on <body> and inline svg markup (e.g. cleaned.html line 78).
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-astro-cid-')) {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
