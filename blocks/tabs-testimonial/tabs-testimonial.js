// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * Tabs Testimonial block.
 *
 * Authored structure (each row = one testimonial):
 *   <div>
 *     <div>  <- tab cell: avatar img, <strong>name</strong>, role
 *     <div>  <- panel cell: large img, <strong>name</strong>, role, quote
 *   </div>
 *
 * Renders an active content pane (large image + name/role/quote) followed by a
 * menu of avatar tab buttons. Clicking a tab switches the visible pane.
 */
export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Testimonials');

  const rows = [...block.children];
  rows.forEach((row, i) => {
    const [tabCell, panelCell] = row.children;
    const id = toClassName(tabCell.textContent) || `tab-${i}`;

    // turn the row into the tabpanel using its second cell's content
    row.className = 'tabs-testimonial-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');
    row.replaceChildren(...panelCell.children);

    // build the avatar tab button from the first cell
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tabCell.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
  });

  block.append(tablist);
}
