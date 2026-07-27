/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-header.
 * Base block: hero
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-27
 *
 * Structure (from library-description.txt): 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background image(s) (optional)
 *   Row 3: title (heading) + subheading + CTA buttons
 */
export default function parse(element, { document }) {
  // Row 2 content: images. Source keeps them in a nested grid-layout of <img class="cover-image">.
  const images = Array.from(element.querySelectorAll('img'));

  // Row 3 content: heading, subheading, CTA buttons.
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const subheading = element.querySelector('p.subheading, p[class*="subheading"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard.
  if (!heading && !subheading && images.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image(s).
  if (images.length > 0) {
    cells.push([images]);
  } else {
    cells.push(['']);
  }

  // Row 3: text content and CTAs.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-header', cells });
  element.replaceWith(block);
}
