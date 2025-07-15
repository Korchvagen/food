require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';

import timer from './modules/timer';
import tabs from './modules/tabs';
import modal from './modules/modal';
import cards from './modules/cards';
import forms from './modules/forms';
import slider from './modules/slider';
import calc from './modules/calc';
import { openModal } from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {
  const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

  timer('.timer', '2025-08-30');
  tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
  modal('[data-modal]', '.modal', modalTimerId);
  cards();
  forms('form', modalTimerId);
  slider({
    containerSelector: '.offer__slider',
    slideSelector: '.offer__slide',
    nextArrowSelector: '.offer__slider-next',
    prevArrowSelector: '.offer__slider-prev',
    totalCounterSelector: '#total',
    currentCounterSelector: '#current',
    wrapperSelector: '.offer__slider-wrapper',
    fieldSelector: '.offer__slider-inner'
  });
  calc();

  
});