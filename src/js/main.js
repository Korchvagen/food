const { data } = require("autoprefixer");
const axios = require('axios');

window.addEventListener('DOMContentLoaded', () => {
  // Tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParrent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParrent.addEventListener('click', e => {
    const target = e.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer
  const deadline = '2025-05-30';

  function getTimeRemaining(endtime) {
    let days, hours, minutes, seconds;
    const total = Date.parse(endtime) - Date.parse(new Date());

    if (total <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(total / (1000 * 60 * 60 * 24));
      hours = Math.floor((total / 1000 * 60 * 60) % 24);
      minutes = Math.floor((total / 1000 / 60) % 60);
      seconds = Math.floor((total / 1000) % 60);
    }

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    }
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const data = getTimeRemaining(endtime);

      days.innerHTML = getZero(data.days);
      hours.innerHTML = getZero(data.hours);
      minutes.innerHTML = getZero(data.minutes);
      seconds.innerHTML = getZero(data.seconds);

      if (data.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadline)

  // Modal
  const modal = document.querySelector('.modal');
  const modalBtns = document.querySelectorAll('[data-modal]');

  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
  }

  modalBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {
    if (e.target == modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('show') && e.code === 'Escape') {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 50000);

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }

  window.addEventListener('scroll', showModalByScroll);

  // Classes
  class Card {
    constructor(imageSrc, alt, title, text, price, parentSelector, ...classes) {
      this.imageSrc = imageSrc;
      this.alt = alt;
      this.title = title;
      this.text = text;
      this.price = price;
      this.classes = classes;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 27;
      this.changeToUAH();
    }

    changeToUAH() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement('div');

      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }

      element.innerHTML = `
        <img src=${this.imageSrc} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.text}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;

      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  // getResource('http://localhost:3000/menu')
  // .then(data => {
  // data.forEach(({img, altimg, title, descr, price}) => {
  //   new Card(img, altimg, title, descr, price, '.menu .container').render();
  // });
  // });

  axios.get('http://localhost:3000/menu')
    .then(response => {
      response.data.forEach(({ img, altimg, title, descr, price }) => {
        new Card(img, altimg, title, descr, price, '.menu .container').render();
      });
    });

  // Forms
  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  }

  forms.forEach(item => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: data
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto
        `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');

    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  // Slider
  const slider = document.querySelector('.offer__slider');
  const slides = document.querySelectorAll('.offer__slide');
  const totalCounter = document.querySelector('#total');
  const currentCounter = document.querySelector('#current');
  const prevBtn = document.querySelector('.offer__slider-prev');
  const nextBtn = document.querySelector('.offer__slider-next');
  const slidesWrapper = document.querySelector('.offer__slider-wrapper');
  const slidesField = document.querySelector('.offer__slider-inner');
  const slideWidth = window.getComputedStyle(slidesWrapper).width;
  let curSlideIndex = 1;
  let offset = 0;

  if(slides.length < 10) {
    totalCounter.textContent = `0${slides.length}`;
    currentCounter.textContent = `0${curSlideIndex}`
  } else {
    totalCounter.textContent = slides.length;
    currentCounter.textContent = curSlideIndex;
  }

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
    slide.style.width = slideWidth;
  });

  slider.style.position = 'relative';

  const indicators = document.createElement('ol');
  const dots = [];
  indicators.classList.add('offer__carousel-indicators');
  slider.append(indicators);

  for(let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.classList.add('offer__dot');

    if(i === 0) {
      dot.style.opacity = 1;
    }

    indicators.append(dot);
    dots.push(dot);
  }

  function changeCounter() {
    if (slides.length < 10) {
      currentCounter.textContent = `0${curSlideIndex}`;
    } else {
      currentCounter.textContent = curSlideIndex;
    }

    dots.forEach(dot => dot.style.opacity = 0.5);
    dots[curSlideIndex - 1].style.opacity = 1;
  }

  nextBtn.addEventListener('click', () => {
    if (offset === +slideWidth.slice(0, slideWidth.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +slideWidth.slice(0, slideWidth.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if(curSlideIndex === slides.length) {
      curSlideIndex = 1;
    } else {
      curSlideIndex++;
    }

    changeCounter();
  });

  prevBtn.addEventListener('click', () => {
    if (offset === 0) {
      offset = +slideWidth.slice(0, slideWidth.length - 2) * (slides.length - 1);
    } else {
      offset -= +slideWidth.slice(0, slideWidth.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (curSlideIndex === 1) {
      curSlideIndex = slides.length;
    } else {
      curSlideIndex--;
    }

    changeCounter();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to');

      curSlideIndex = slideTo;
      offset = +slideWidth.slice(0, slideWidth.length - 2) * (slideTo - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;

      changeCounter();
    });
  });
});