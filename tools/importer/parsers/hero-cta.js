/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-cta.
 * Base block: hero
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-27
 *
 * Structure (from library-description.txt): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title (heading) + subheading + CTA button
 */
export default function parse(element, { document }) {
  // Background image (the overlay cover-image).
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');

  // Text content lives in the card-body overlay.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard.
  if (!heading && !subheading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image.
  if (bgImage) {
    cells.push([bgImage]);
  } else {
    cells.push(['']);
  }

  // Row 3: text content and CTA.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta', cells });
  element.replaceWith(block);
}
