function slider() {
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

  if (slides.length < 10) {
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

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);
    dot.classList.add('offer__dot');

    if (i === 0) {
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

  function deleteLetters(str) {
    return +str.replace(/\D/g, '');
  }

  nextBtn.addEventListener('click', () => {
    if (offset === deleteLetters(slideWidth) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += deleteLetters(slideWidth);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (curSlideIndex === slides.length) {
      curSlideIndex = 1;
    } else {
      curSlideIndex++;
    }

    changeCounter();
  });

  prevBtn.addEventListener('click', () => {
    if (offset === 0) {
      offset = deleteLetters(slideWidth) * (slides.length - 1);
    } else {
      offset -= deleteLetters(slideWidth);
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
      offset = deleteLetters(slideWidth) * (slideTo - 1);
      slidesField.style.transform = `translateX(-${offset}px)`;

      changeCounter();
    });
  });
}

module.exports = slider;