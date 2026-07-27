/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial.
 * Base block: tabs
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-27
 *
 * Structure (from library-description.txt): 2 columns, one row per tab.
 *   Row 1: block name
 *   Each subsequent row: [tab label, tab content]
 *     label   = tab-menu-link button content (avatar + name + role)
 *     content = matching tab-pane content (testimonial image + quote)
 *   Panes and menu links are matched by data-tab-index / data-tab-target.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tab-pane'));
  const menuLinks = Array.from(element.querySelectorAll('.tab-menu-link'));

  // Empty-block guard.
  if (panes.length === 0 && menuLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  panes.forEach((pane) => {
    const idx = pane.getAttribute('data-tab-index');
    // Find matching menu link (label) by target index; fall back to positional.
    const label = menuLinks.find((m) => m.getAttribute('data-tab-target') === idx)
      || menuLinks[cells.length];

    // Label cell: inner content of the button (avatar + name + role).
    const labelContent = label
      ? Array.from(label.childNodes).filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()))
      : '';

    // Content cell: the pane's inner content (image + testimonial text).
    const paneContent = Array.from(pane.childNodes).filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));

    cells.push([
      labelContent.length ? labelContent : '',
      paneContent.length ? paneContent : '',
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
