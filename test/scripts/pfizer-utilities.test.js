/* global describe beforeEach before it */
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { SmartcaptureTags } from '../../scripts/pfizer-utilities.js';
const bodyHTML = `
<header>
  <nav>
    <div class="nav-sections">
    <ul>
        <li class="nav-drop">Example Content
        <ul>
            <li><a href="/"><u>Default Content</u></a></li>
            <li><a href="/Examples/Microservices/form">Microservices - Form</a></li>
            <li><a href="/Examples/Microservices/search">Microservices - Search</a></li>
        </ul>
        </li>
        <li class="nav-drop" aria-expanded="false">Getting Started
        <ul>
            <li><a href="/"><u>Build your first site</u></a></li>
            <li><a href="/"><u>Preview and publish content</u></a></li>
            <li><a href="/"><u>Organize your content</u></a></li>
        </ul>
        </li>
    </ul>
    </div>
  </nav>
</header>
<main></main>
<footer></footer>
`;
function createFakeError() {
  const fakeError = sinon.fake();
  sinon.replace(console, 'error', fakeError);
  return fakeError;
}
describe('SmartcaptureTags', () => {
  describe('with Smartcapture cookie', () => {
    before(() => {
      document.cookie = 'Smartcapture=true';
    });
    beforeEach(() => {
      document.body.innerHTML = bodyHTML;
    });
    it('should add the Smartcapture attributes if there is a Smartcapture=true cookie', async () => {
      const config = [
        {
          selector: 'li.nav-drop',
          smName: 'header-nav',
        },
      ];
      await SmartcaptureTags(config);
      expect(document.querySelectorAll('[data-Smartcapture="header-nav"]').length).eq(2);
    });
    it('should add both the Smartcapture and Smartcapture-event attributes when both are configured', async () => {
      const config = [
        {
          selector: 'li.nav-drop  a',
          smName: 'header-nav-link',
          event: 'hover',
        },
      ];
      await SmartcaptureTags(config);
      expect(document.querySelectorAll('[data-Smartcapture="header-nav-link"][data-Smartcapture-event="hover"]').length).eq(6);
    });
    it('should log an error message if the configuration is incomplete', async () => {
      const config = [
        {
          selector: 'li.nav-drop  a',
        },
      ];
      const fakeError = createFakeError();
      await SmartcaptureTags(config);
      expect(fakeError.calledWith('Incomplete Smartcapture configuration, selector and smName properties are required.')).eq(true);
      sinon.restore();
    });
    it('should log an error message if the configured selector is invalid', async () => {
      const config = [
        {
          selector: 'li.nav-drop()  a',
          smName: 'header-nav-link',
          event: 'hover',
        },
      ];
      const fakeError = createFakeError();
      await SmartcaptureTags(config);
      expect(fakeError.calledWithMatch('Failed to select Smartcapture elements. ')).eq(true);
      sinon.restore();
    });
    it('should log an error message if the selector does not select any elements', async () => {
      const config = [
        {
          selector: 'li.nav-drop  a.link',
          smName: 'header-nav-link',
          event: 'hover',
        },
      ];
      const fakeError = createFakeError();
      await SmartcaptureTags(config);
      expect(fakeError.calledWith(
        'Missing Smartcapture element for selector:',
        'li.nav-drop  a.link',
      )).eq(true);
      sinon.restore();
    });
  });
  describe('without Smartcapture cookie', () => {
    before(() => {
      document.cookie = 'Smartcapture=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
    it('should not add the Smartcapture attributes if there is no Smartcapture=true cookie', async () => {
      document.body.innerHTML = bodyHTML;
      const config = [
        {
          selector: 'li.nav-drop',
          smName: 'header-nav',
        },
      ];
      await SmartcaptureTags(config);
      expect(document.querySelectorAll('[data-Smartcapture="header-nav"]').length).eq(0);
    });
  });
});