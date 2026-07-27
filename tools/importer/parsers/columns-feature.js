/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature.
 * Base block: columns
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-27
 *
 * Structure (from library-description.txt): flexible columns.
 *   Row 1: block name
 *   Row 2: one cell per column. This instance has 2 columns:
 *          left = feature image, right = breadcrumbs + heading + author meta.
 */
export default function parse(element, { document }) {
  // Direct child <div>s form the visual columns.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Empty-block guard.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: each direct child div becomes a column cell, preserving its inner content.
  const row = columns.map((col) => {
    const contents = Array.from(col.childNodes).filter((n) => {
      // Keep element nodes and non-empty text nodes.
      if (n.nodeType === 1) return true;
      return n.nodeType === 3 && n.textContent.trim().length > 0;
    });
    return contents.length ? contents : '';
  });
  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
