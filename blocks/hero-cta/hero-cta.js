export default function decorate(block) {
  const rows = [...block.children];
  const imageRow = rows.find((row) => row.querySelector('picture, img'));
  const contentRow = rows.find((row) => row !== imageRow);

  if (imageRow) {
    imageRow.classList.add('hero-cta-image');
    // add a dark gradient overlay above the image
    const overlay = document.createElement('div');
    overlay.className = 'hero-cta-overlay';
    imageRow.append(overlay);
  } else {
    block.classList.add('no-image');
  }

  if (contentRow) {
    contentRow.classList.add('hero-cta-content');
  }
}
