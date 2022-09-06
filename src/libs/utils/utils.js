class Utils {
  /**
   * 將字串或 HTML 字串轉為 fragment DOM
   * @param {string} html - string
   * @param {string} [templateID] - template id
   */
  static createFragmentDOM(html = '', templateID = '') {
    const templateContainerDOM = document.createElement('template');

    templateContainerDOM.innerHTML = html;

    const fragmentDOM = templateContainerDOM.content;

    if (!templateID) {
      return fragmentDOM;
    }

    const queryTemplateDOM = fragmentDOM.querySelector(`#${templateID}`);

    if (!queryTemplateDOM) {
      throw new Error(`template id "${templateID}" not found.`);
    }

    /**
     * @type {DocumentFragment}
     */
    const templateFragmentDOM = queryTemplateDOM.content;

    return templateFragmentDOM;
  }
}

export default Utils;
