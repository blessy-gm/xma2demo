import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });

    // Build the meta row: category tag pill + date.
    // Authored as a single paragraph, e.g. "Casual Cool May 12".
    const body = li.querySelector('.cards-article-card-body');
    if (body) {
      const metaP = body.querySelector('p');
      if (metaP && !metaP.closest('.cards-article-card-image')) {
        const raw = metaP.textContent.trim();
        // Date is the trailing "<Month> <day>" (e.g. "May 12").
        const match = raw.match(/^(.*?)\s+([A-Za-z]{3,9}\.?\s+\d{1,2})$/);
        const meta = document.createElement('div');
        meta.className = 'cards-article-card-meta';
        if (match) {
          const tag = document.createElement('span');
          tag.className = 'cards-article-tag';
          tag.textContent = match[1].trim();
          const date = document.createElement('span');
          date.className = 'cards-article-date';
          date.textContent = match[2].trim();
          meta.append(tag, date);
        } else {
          const tag = document.createElement('span');
          tag.className = 'cards-article-tag';
          tag.textContent = raw;
          meta.append(tag);
        }
        metaP.replaceWith(meta);
      }

      // The trailing link duplicates the title; turn the whole card into a link.
      const linkP = body.querySelector('p:last-of-type');
      const link = linkP && linkP.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        li.dataset.href = href;
        linkP.remove();
      }
    }

    // Make the whole card a link matching the source (clickable card).
    if (li.dataset.href) {
      const anchor = document.createElement('a');
      anchor.className = 'cards-article-card-link';
      anchor.href = li.dataset.href;
      while (li.firstElementChild) anchor.append(li.firstElementChild);
      li.append(anchor);
      delete li.dataset.href;
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
