/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery.
 * Base block: cards
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-27
 *
 * Structure (from library-description.txt): cards, one row per card.
 *   Row 1: block name
 *   Each subsequent row = one card. This gallery instance is image-only
 *   (no title/description/CTA), so each card row holds a single image cell.
 */
export default function parse(element, { document }) {
  // Each direct child div wraps one card image.
  const cardDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (cardDivs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardDivs.forEach((card) => {
    const img = card.querySelector('img');
    if (img) {
      cells.push([img]);
    }
  });

  // If no images found at all, bail gracefully.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
