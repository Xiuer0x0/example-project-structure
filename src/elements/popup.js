import PopupHTML from './templates/popup.html';

import Utils from '../libs/utils';

/**
 * @typedef IPopupOptions
 * @property {Node | string} [content] - Popup content
 * @property {string[]} [classList] - 增加於 popup 上的 className
 * @property {boolean} [isShowCloseBtn] - 是否顯示關閉按鈕，預設 `true`
 * @property {boolean} [isClickOuterClose] - 是否啟用點擊外部時觸發 Popup close，預設 `true`
 * @property {Function} [onBeforeShowing] - 在 Popup 顯示之前執行
 * @property {Function} [onHidden] - 在 Popup hide 後執行
 * @property {Function} [onDestroyed] - 在 Popup destroy 後執行
 * @property {Function} [onClosed] - 在 Popup 關閉完成的 callback
 * @property {'destroy' | 'hidden'} [closeMode] - 關閉 Popup 的模式，'destroy' 從 DOM tree 中移除，'hidden' 僅隱藏
 * @property {Node} [targetDOM] - 將 popup 插入於哪個元件內，預設 document.body
 */

const CSSTag = {
  disabled: 'disabled',
  hidden: 'hidden',
  fadeOut: 'fade-out',
};

/**
 * @param {Element} dom
 */
function getTransitionDuration(dom) {
  const { transitionDuration } = window.getComputedStyle(dom, null);

  return parseFloat(transitionDuration);
}

/**
 * @param {HTMLElement} clickDOM
 */
function initClickPrEvent(clickDOM) {
  clickDOM.addEventListener('click', function (e) {
    const isDisabled = this.classList.contains(CSSTag.disabled);

    if (isDisabled) {
      e.stopImmediatePropagation();

      return false;
    }
  }, true);
}

/**
 * @param {DocumentFragment} popupDOM
 */
function initPopupMaskEvent(popupDOM) {
  const popupMaskDOM = popupDOM.querySelector('.popup-mask');

  initClickPrEvent(popupMaskDOM);
  popupMaskDOM.addEventListener('click', () => {
    popupMaskDOM.classList.add(CSSTag.disabled);

    if (this._options.isClickOuterClose) {
      this.close();
    }

    popupMaskDOM.classList.remove(CSSTag.disabled);
  });

  return popupMaskDOM;
}

/**
 * @param {DocumentFragment} popupDOM
 */
function initPopupContainerEvent(popupDOM) {
  const popupContainerDOM = popupDOM.querySelector('.popup-container');

  popupContainerDOM.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  return popupContainerDOM;
}

/**
 * @param {DocumentFragment} popupDOM
 */
function initPopupCloseBtnEvent(popupDOM) {
  const popupCloseBtnDOM = popupDOM.querySelector('.btn-popup-close');

  initClickPrEvent(popupCloseBtnDOM);
  popupCloseBtnDOM.addEventListener('click', () => {
    this.close();
  });

  return popupCloseBtnDOM;
}

/**
 * @param {IPopupOptions} options
 */
function createPopupDOM(options = {}) {
  const popupFragmentDOM = Utils.createFragmentDOM(PopupHTML, 'PopupTemplate');
  const popupDOM = popupFragmentDOM.firstElementChild;

  popupDOM.classList.add(...options.classList);
  popupDOM.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  return popupDOM;
}

class PopupElement {
  /**
   * @param {IPopupOptions} [options] - 可選參數
   */
  constructor({
    content = '',
    classList = [],
    isShowCloseBtn = true,
    isClickOuterClose = true,
    onBeforeShowing = async () => {},
    onHidden = async () => {},
    onDestroyed = async () => {},
    onClosed = async () => {},
    closeMode = 'destroy',
    targetDOM = document.body,
  } = {}) {
    /** 
     * @type {IPopupOptions}
     */
    this._options = {
      content,
      classList: [CSSTag.hidden, CSSTag.fadeOut, ...classList],
      isShowCloseBtn,
      isClickOuterClose,
      onBeforeShowing,
      onHidden,
      onDestroyed,
      onClosed,
      closeMode,
      targetDOM,
    };

    this.popupDOM = createPopupDOM(this._options);
    this.popupMaskDOM = initPopupMaskEvent.call(this, this.popupDOM);
    this.popupContainerDOM = initPopupContainerEvent(this.popupDOM);
    this.popupCloseBtnDOM = initPopupCloseBtnEvent.call(this, this.popupDOM);

    if (!this._options.isShowCloseBtn) {
      this.popupCloseBtnDOM.classList.add(CSSTag.hidden);
    }

    this.updateContainer(this._options.content);
  }

  /**
   * content 更新於 popup container
   * @param {Node | string} newContent
   */
  updateContainer(newContent) {
    this._options.content = newContent;

    this.popupContainerDOM.innerText = '';

    if (typeof this._options.content === 'string') {
      this.popupContainerDOM.append(Utils.createFragmentDOM(this._options.content));
    } else {
      this.popupContainerDOM.append(this._options.content);
    }
  }

  /**
   * 顯示 Popup DOM
   */
  async show() {
    if (!this.popupDOM) {
      return false;
    }

    const isHidden = this.popupDOM.classList.contains(CSSTag.hidden);

    if (!isHidden) {
      return false;
    }

    this.popupDOM.classList.remove(CSSTag.hidden);

    await this._options.onBeforeShowing();

    this._options.targetDOM.appendChild(this.popupDOM);

    this._fadeTransitionDuration = getTransitionDuration(this.popupDOM);

    setTimeout(() => {
      this.popupDOM.classList.remove(CSSTag.fadeOut);
    }, this._fadeTransitionDuration * 1000);
  }

  /**
   * 隱藏 popup
   */
  async hide() {
    this.popupDOM.classList.add(CSSTag.fadeOut);

    return new Promise((resolve) => {
      setTimeout(async () => {
        this.popupDOM.classList.add(CSSTag.hidden);

        await this._options.onHidden();

        resolve();
      }, this._fadeTransitionDuration * 1000);
    });
  }

  /**
   * destroy popup on DOM tree
   */
  async destroy() {
    this.popupDOM.remove();

    await this._options.onDestroyed();
  }

  /**
   * 關閉 popup 顯示，並根據 closeMode 執行對應行為
   */
  async close() {
    if (this._isClosing) {
      return false;
    }

    this._isClosing = true;

    await this.hide();

    if (this._options.closeMode === 'destroy') {
      await this.destroy();
    }

    await this._options.onClosed();

    this._isClosing = false;
  }
}

export default PopupElement;
