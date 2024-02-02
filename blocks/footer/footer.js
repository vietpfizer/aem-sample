import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { SmartcaptureTags } from '../../scripts/pfizer-utilities.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
function setupSmartcaptureTags() {
  SmartcaptureTags([
    {
      selector: '.footer a',
      smName: 'footer-link',
      event: 'click',
    },
  ]);
}
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  block.textContent = '';

  // load footer fragment
  const footerPath = footerMeta.footer || '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);
  
  setupSmartcaptureTags();
  block.append(footer);
  
}
