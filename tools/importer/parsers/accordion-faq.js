/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Base block: accordion
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-27
 *
 * Structure (from library-description.txt): 2 columns, one row per accordion item.
 *   Row 1: block name
 *   Each subsequent row: [title cell, content cell]
 *   Source uses <details class="faq-item"> with <summary class="faq-question">
 *   for the title and <div class="faq-answer"> for the body.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.faq-item, details'));

  // Empty-block guard.
  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    const summary = item.querySelector('.faq-question, summary');
    const answer = item.querySelector('.faq-answer');

    // Title cell: prefer the inner span text, else the summary itself.
    let titleCell = '';
    if (summary) {
      const inner = summary.querySelector('span');
      titleCell = inner || summary;
    }

    // Content cell: answer body contents.
    let contentCell = '';
    if (answer) {
      const contents = Array.from(answer.childNodes).filter(
        (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()),
      );
      contentCell = contents.length ? contents : answer;
    }

    cells.push([titleCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
