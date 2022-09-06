import '../scss/page/development.scss';

import PopupElement from '../elements/popup';

// 開發用設定或測試區
console.log('Hello development');

function drawDevelopmentMark() {
  const markDOM = document.createElement('aside');

  markDOM.classList.add('development-mark');
  markDOM.innerText = 'Dev mode';

  document.body.append(markDOM);
}

window.addEventListener('load', function ready() {
  drawDevelopmentMark();

  const catImageDOM = document.createElement('img');

  catImageDOM.src = '/assets/img/sample.png';

  const popupCat = new PopupElement({
    content: catImageDOM,
  });

  popupCat.show();
});
