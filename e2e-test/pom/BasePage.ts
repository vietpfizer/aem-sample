import time from "@data/timeout_data.json";
export default class BasePage {
  timeout = time.normal;
  async goTo(page: any, url: string): Promise<void> {
    await page.goto(url);
  }

  // Executes a function or specified piece of code once the timer expires.
  async wait(page: any, timeout: number = this.timeout) {
    await page.waitForTimeout(timeout);
  }

  // Returns when element specified by locator satisfies the state option.
  async waitFor(
    page: any,
    selector: string,
    timeout: number = this.timeout
  ): Promise<void> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    await page.waitForTimeout(5000);
  }

  // Check is displayed
  async isDisplayed(
    page: any,
    selector: string,
    timeout: number = this.timeout
  ): Promise<boolean> {
    return await page
      .locator(selector)
      .first()
      .waitFor({ timeout: timeout })
      .then(() => true)
      .catch(() => false);
  }

  // Single touch at the position (x,y).
  async touchScreen(page: any, x: number, y: number): Promise<void> {
    await page.touchscreen.tap(x, y);
  }

  // Click element contains click, tap, dblclick
  async click(
    page: any,
    selector: string,
    type: string = "click",
    timeout: number = this.timeout
  ): Promise<void> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    if (type == "click") {
      await element.click({ timeout: timeout }); //Click an element.
    } else if (type == "tap") {
      await element.tap({ timeout: timeout }); //Perform a tap gesture on the element matching the locator.
    } else if (type == "dblclick") {
      await element.dblclick({ timeout: timeout }); //Double-click an element.
    }
  }

  // Set a value to the input field
  async enterText(
    page: any,
    selector: string,
    text: string,
    timeout: number = this.timeout
  ): Promise<void> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    await element.fill(text, { timeout: timeout });
  }

  // Clear the input field.
  async clear(
    page: any,
    selector: string,
    timeout: number = this.timeout
  ): Promise<void> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    await element.clear({ timeout: timeout });
  }

  // Calls blur on the element.
  async blur(
    page: any,
    selector: string,
    timeout: number = this.timeout
  ): Promise<void> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    await element.blur({ timeout: timeout });
  }

  // Returns the number of elements matching the locator.
  async count(
    page: any,
    selector: string,
    timeout: number = this.timeout
  ): Promise<number> {
    const element = await page.locator(selector);
    await element.waitFor({ timeout: timeout });
    return await element.count({ timeout: timeout });
  }

  // Drag the source element towards the target element and drop it.
  async dragTo(
    page: any,
    sourceLocator: string,
    targetLocator: string
  ): Promise<void> {
    const source = page.locator(sourceLocator).first();
    const target = page.locator(targetLocator).first();
    await source.dragTo(target);
  }

  // Returns the matching element's attribute value.
  async getAttribute(
    page: any,
    selector: string,
    attribute: string,
    timeout: number = this.timeout
  ): Promise<string> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    return await element.getAttribute(attribute, { timeout: timeout });
  }

  // get text
  async getText(
    page: any,
    selector: string,
    all: boolean = false,
    timeout: number = this.timeout
  ): Promise<string> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    if (all) {
      return await element.allTextContents({ timeout: timeout });
    } else {
      return await element.textContent({ timeout: timeout });
    }
  }

  // Highlight the corresponding element(s) on the screen
  async highlight(
    page: any,
    selector: string,
    timeout: number = this.timeout
  ): Promise<void> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    await element.highlight();
  }

  // Hover over the matching element.
  async hover(
    page: any,
    selector: string,
    timeout: number = this.timeout
  ): Promise<void> {
    const element = await page.locator(selector).first();
    await element.waitFor({ timeout: timeout });
    await element.hover();
  }

  // Keyboards contains insertText, type, down, up, press
  async keyboard(
    page: any,
    text: string,
    type: string = "insertText"
  ): Promise<void> {
    const keyboadElement = await page.keyboard;
    if (type == "insertText") {
      await keyboadElement.insertText(text); //Dispatches only input event, does not emit the keydown, keyup or keypress events.
    } else if (type == "type") {
      await keyboadElement.type(text); //Sends a keydown, keypress/input, and keyup event for each character in the text.
    } else if (type == "down") {
      await keyboadElement.down(text); //Dispatches a keydown event.
    } else if (type == "up") {
      await keyboadElement.up(text); //Dispatches a keyup event.
    } else if (type == "press") {
      await keyboadElement.press(text); //Press keys
    }
  }

  // Mouse contains click, dblclick, move, wheel
  async mouse(
    page: any,
    x: number,
    y: number,
    type: string = "click"
  ): Promise<void> {
    const mouseElement = await page.mouse;
    if (type == "click") {
      await mouseElement.click(x, y); //Mouse click
    } else if (type == "dblclick") {
      await mouseElement.dblclick(x, y); //dblclick click
    } else if (type == "move") {
      await mouseElement.move(x, y); //Dispatches a mousemove event.
    } else if (type == "wheel") {
      await mouseElement.wheel(x, y); //Dispatches a wheel event.
    }
  }

  //wait For Response
  async waitForResponse(
    page: any,
    endPoint: string,
    status: number
  ): Promise<any> {
    const response = await page.waitForResponse(
      (response) =>
        response.url().includes(endPoint) && response.status() === status
    );
    return JSON.parse(await response.body());
  }
}
