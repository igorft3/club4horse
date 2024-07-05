document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("authorCarousel");
  const slides = carousel.children;
  const prevBtn = document.getElementById("btnCarouselLeftAuthor");
  const nextBtn = document.getElementById("btnCarouselRightAuthor");
  const indicators = document.querySelectorAll(".carousel-circle-item");
  let currentSlide = 0;

  function updateCarousel() {
    const offset = -currentSlide * 100;
    carousel.style.transform = `translateX(${offset}%)`;
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide);
    });
    prevBtn.classList.toggle("disabled", currentSlide === 0);
    nextBtn.classList.toggle("disabled", currentSlide === slides.length - 1);
  }

  prevBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide += 1;
      updateCarousel();
    }
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentSlide = index;
      updateCarousel();
    });
  });

  updateCarousel();

  const getVisibleSlides = () => {
    if (window.matchMedia("(max-width: 375px)").matches) {
      return 1;
    } else if (window.matchMedia("(min-width: 767px)").matches) {
      return 3;
    } else {
      return 1;
    }
  };

  const toggleCarouselButtons = () => {
    const membersCarouselBtn = document.querySelector(".members__carousel-btn");
    const carouselBtnMobile = document.querySelector(".carousel-btn--mobile");

    if (window.matchMedia("(max-width: 767px)").matches) {
      membersCarouselBtn.classList.add("display-none");
      carouselBtnMobile.classList.add("display-on");
    } else {
      membersCarouselBtn.classList.remove("display-none");
      carouselBtnMobile.classList.remove("display-on");
    }
  };

  const createCarousel = ({
    carouselId,
    btnLeftId,
    btnRightId,
    counterId,
    circleClass,
    isAutoPlay = false,
  }) => {
    const carousel = document.getElementById(carouselId);
    const btnLeft = document.getElementById(btnLeftId);
    const btnRight = document.getElementById(btnRightId);
    const numberCarusel = counterId ? document.getElementById(counterId) : null;
    const circles = circleClass
      ? Array.from(document.querySelectorAll(`.${circleClass}`))
      : null;
    let slides = Array.from(carousel.children);

    let currentIndex = 0;
    let visibleSlides = getVisibleSlides();
    let slideWidth = carousel.offsetWidth / visibleSlides;
    const totalSlides = slides.length;

    const setSlidePosition = (slide, index) => {
      slide.style.width = slideWidth + "px";
      slide.style.left = slideWidth * index + "px";
    };

    const updateSlideWidth = () => {
      slideWidth = carousel.offsetWidth / visibleSlides;
      slides.forEach(setSlidePosition);
      moveToSlide(carousel, currentIndex);
    };

    slides.forEach(setSlidePosition);

    const moveToSlide = (carousel, targetIndex) => {
      const targetSlide = slides[targetIndex];
      carousel.style.transform = "translateX(-" + targetSlide.style.left + ")";
      currentIndex = targetIndex;
      if (numberCarusel) updateCounter();
      if (circles) updateCircles();
      updateButtons();
    };

    const updateButtons = () => {
      btnLeft.disabled = currentIndex <= 0;
      btnLeft.classList.toggle("disabled", currentIndex <= 0);

      btnRight.disabled = currentIndex >= totalSlides - visibleSlides;
      btnRight.classList.toggle(
        "disabled",
        currentIndex >= totalSlides - visibleSlides
      );
    };

    const updateCounter = () => {
      const start = currentIndex + 1;
      const end = Math.min(currentIndex + visibleSlides, totalSlides);
      numberCarusel.textContent = visibleSlides > 1 ? `${start}-${end}` : start;
    };

    const updateCircles = () => {
      circles.forEach((circle, index) => {
        circle.classList.toggle("active", index === currentIndex);
      });
    };

    const updateIndex = (inc) => {
      let targetIndex = currentIndex + inc;
      if (targetIndex < 0) {
        targetIndex = 0;
      } else if (targetIndex > totalSlides - visibleSlides) {
        targetIndex = totalSlides - visibleSlides;
      }
      moveToSlide(carousel, targetIndex);
    };

    btnLeft.addEventListener("click", () => {
      updateIndex(-1);
    });

    btnRight.addEventListener("click", () => {
      updateIndex(1);
    });

    if (isAutoPlay) {
      setInterval(() => {
        if (currentIndex >= totalSlides - visibleSlides) {
          currentIndex = -1;
        } else {
          updateIndex(1);
        }
      }, 4000);
    }

    const handleResize = () => {
      visibleSlides = getVisibleSlides();
      updateSlideWidth();
      toggleCarouselButtons();
    };

    window.addEventListener("resize", handleResize);

    slides[0].classList.add("current-slide");
    if (numberCarusel) updateCounter();
    if (circles) updateCircles();
    updateButtons();
    toggleCarouselButtons();
  };

  createCarousel({
    carouselId: "membersCarousel",
    btnLeftId: "btnCarouselLeft",
    btnRightId: "btnCarouselRight",
    counterId: "numberCarusel",
    isAutoPlay: true,
  });

  createCarousel({
    carouselId: "membersCarousel",
    btnLeftId: "btnCarouselLeftMob",
    btnRightId: "btnCarouselRightMob",
    counterId: "numberCaruselMob",
    isAutoPlay: true,
  });
});
