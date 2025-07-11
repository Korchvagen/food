window.addEventListener('DOMContentLoaded', () => {
  const timer = require('./modules/timer');
  const tabs = require('./modules/tabs');
  const modal = require('./modules/modal');
  const cards = require('./modules/cards');
  const forms = require('./modules/forms');
  const slider = require('./modules/slider');
  const calc = require('./modules/calc');

  timer();
  tabs();
  modal();
  cards();
  forms();
  slider();
  calc();

  
});