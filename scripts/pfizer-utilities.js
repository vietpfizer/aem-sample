/**
 * Gets the value of a cookie
 */
function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.trim().startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue && decodeURIComponent(cookieValue);
}
/**
 Sets up Smartcapture tags if a Smartcapture=true cookie is set
 */
// eslint-disable-next-line import/prefer-default-export
export async function SmartcaptureTags(arrayOfqueryConfigs) {
  await new Promise((res) => { setTimeout(res, 1000); });
  if (getCookie('Smartcapture') !== 'true') {
    return;
  }
  arrayOfqueryConfigs.forEach((queryConfig) => {
    const { selector, smName, event } = queryConfig;
    if (!selector || !smName) {
      console.error('Incomplete Smartcapture configuration, selector and smName properties are required.');
      return;
    }
    let selectedElements;
    try {
      selectedElements = document.querySelectorAll(`${String(selector)}`);
    } catch (ex) {
      console.error('Failed to select Smartcapture elements. ', ex);
      return;
    }
    if (selectedElements.length > 0) {
      document.querySelectorAll(`${String(selector)}`).forEach((el) => {
        if (smName) el.setAttribute('data-Smartcapture', smName);
        if (event) el.setAttribute('data-Smartcapture-event', event);
      });
    } else {
      console.error('Missing Smartcapture element for selector: ', selector);
    }
  });
}