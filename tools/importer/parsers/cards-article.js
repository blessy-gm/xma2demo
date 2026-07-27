/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article.
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-27
 *
 * Structure (from library-description.txt): 2 columns, one row per card.
 *   Row 1: block name
 *   Each subsequent row: [image cell, text-content cell]
 *     image cell = card image
 *     text cell  = meta (tag + date) + heading + CTA link (from card href)
 *   Source cards are <a class="article-card"> wrapping an image div and a body div.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link'));

  // Empty-block guard.
  if (cards.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('.article-card-image img, img');
    const body = card.querySelector('.article-card-body');

    const textContent = [];
    if (body) {
      Array.from(body.childNodes).forEach((n) => {
        if (n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())) {
          textContent.push(n);
        }
      });
    }

    // Preserve the card link as a CTA at the bottom of the text cell.
    const href = card.getAttribute('href');
    const heading = body ? body.querySelector('h1, h2, h3, h4, h5, h6') : null;
    if (href) {
      const cta = document.createElement('a');
      cta.href = href;
      cta.textContent = heading ? heading.textContent : 'Read more';
      textContent.push(cta);
    }

    cells.push([
      img || '',
      textContent.length ? textContent : '',
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
