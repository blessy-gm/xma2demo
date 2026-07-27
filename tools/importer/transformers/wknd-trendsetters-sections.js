/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section breaks and section metadata.
 *
 * Runs in afterTransform only. Reads the template section definitions from
 * payload.template.sections (page-templates.json) and, for the homepage's
 * 7 sections:
 *   - inserts an <hr> before each non-first section (6 breaks total), and
 *   - inserts a "Section Metadata" block after each section that carries a
 *     style (the three `secondary` sections: Hero header, Image gallery,
 *     Latest articles).
 *
 * Section selectors come from page-templates.json, which were derived from
 * the captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;

    const doc = element.ownerDocument;

    // Process in reverse so inserting nodes doesn't shift the elements we
    // still need to locate for earlier sections.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const target = element.querySelector(section.selector);
      if (!target) continue;

      // Section Metadata block after the section (only when a style is set).
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (target.nextSibling) {
          target.parentNode.insertBefore(block, target.nextSibling);
        } else {
          target.parentNode.appendChild(block);
        }
      }

      // Section break before every section except the first.
      if (i > 0) {
        const hr = doc.createElement('hr');
        target.parentNode.insertBefore(hr, target);
      }
    }
  }
}
