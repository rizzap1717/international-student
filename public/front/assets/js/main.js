/**
* Template Name: FlexStart
* Template URL: https://bootstrapmade.com/flexstart-bootstrap-startup-template/
* Updated: Nov 01 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Auto slide
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    let intervalId;

    if (totalSlides) {
      function showSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        const slider = document.querySelector(".slider");
        if (slider) {
          slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
      }

      function startAutoSlide() {
        intervalId = setInterval(() => {
          showSlide(currentIndex + 1);
        }, 3000);
      }

      function stopAutoSlide() {
        clearInterval(intervalId);
      }

      const sliderContainer = document.querySelector(".slider-container");
      if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", stopAutoSlide);
        sliderContainer.addEventListener("mouseleave", startAutoSlide);
      }

      startAutoSlide();
    }

    // Swiper init
    if (typeof Swiper !== 'undefined') {
      new Swiper('.swiper-container', {
        slidesPerView: 5,
        spaceBetween: 10,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        loop: true,
        loopAdditionalSlides: 2,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          576: { slidesPerView: 1 },
        },
      });

      new Swiper('.custom-swiper', {
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 1000,
      });
    }

    // Scroll toggle
    function toggleScrolled() {
      const body = document.querySelector('body');
      const header = document.querySelector('#header');
      if (!header) return;
      if (!header.classList.contains('scroll-up-sticky') &&
          !header.classList.contains('sticky-top') &&
          !header.classList.contains('fixed-top')) return;
      window.scrollY > 100 ? body.classList.add('scrolled') : body.classList.remove('scrolled');
    }

    document.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    // Preloader
    const preloader = document.getElementById('js-preloader');
    if (preloader) {
      window.addEventListener('load', function () {
        preloader.classList.add('fade-out');
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
      });
    }

    // Mobile nav toggle
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    function mobileNavToggle() {
      document.body.classList.toggle('mobile-nav-active');
      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
      }
    }
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
    }

    document.querySelectorAll('#navmenu a').forEach(link => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          mobileNavToggle();
        }
      });
    });

    // Mobile nav dropdown
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggle => {
      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        const dropdown = this.parentNode.nextElementSibling;
        if (dropdown) dropdown.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    // Scroll top button
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      function toggleScrollTop() {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }

      window.addEventListener('load', toggleScrollTop);
      document.addEventListener('scroll', toggleScrollTop);
    }

    // AOS init
    function aosInit() {
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
      }
    }
    window.addEventListener('load', aosInit);

    // GLightbox
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox' });
    }

    // PureCounter
    if (typeof PureCounter !== 'undefined') {
      new PureCounter();
    }

    // FAQ Toggle
    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach(faqItem => {
      faqItem.addEventListener('click', () => {
        faqItem.parentNode.classList.toggle('faq-active');
      });
    });

    // Isotope
    document.querySelectorAll('.isotope-layout').forEach(isotopeItem => {
      const layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
      const filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
      const sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
      let initIsotope;
      const container = isotopeItem.querySelector('.isotope-container');
      if (container) {
        imagesLoaded(container, function () {
          initIsotope = new Isotope(container, {
            itemSelector: '.isotope-item',
            layoutMode: layout,
            filter: filter,
            sortBy: sort,
          });
        });
      }

      isotopeItem.querySelectorAll('.isotope-filters li').forEach(filterBtn => {
        filterBtn.addEventListener('click', function () {
          isotopeItem.querySelector('.isotope-filters .filter-active')?.classList.remove('filter-active');
          this.classList.add('filter-active');
          initIsotope?.arrange({ filter: this.getAttribute('data-filter') });
          aosInit();
        });
      });
    });

    // Init custom swiper via config
    document.querySelectorAll('.init-swiper').forEach(swiperElement => {
      const configScript = swiperElement.querySelector('.swiper-config');
      if (configScript) {
        try {
          const config = JSON.parse(configScript.innerHTML.trim());
          new Swiper(swiperElement, config);
        } catch (err) {
          console.error("Invalid Swiper config", err);
        }
      }
    });

    // Scroll to hash on load
    if (window.location.hash) {
      const section = document.querySelector(window.location.hash);
      if (section) {
        setTimeout(() => {
          const margin = parseInt(getComputedStyle(section).scrollMarginTop);
          window.scrollTo({ top: section.offsetTop - margin, behavior: 'smooth' });
        }, 100);
      }
    }

    // Navmenu scrollspy
    const navmenulinks = document.querySelectorAll('.navmenu a');
    function navmenuScrollspy() {
      navmenulinks.forEach(link => {
        if (!link.hash) return;
        const section = document.querySelector(link.hash);
        if (!section) return;
        const pos = window.scrollY + 200;
        if (pos >= section.offsetTop && pos <= section.offsetTop + section.offsetHeight) {
          document.querySelectorAll('.navmenu a.active').forEach(el => el.classList.remove('active'));
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);
  });
})();

// Fakultas auto scroll
function scrollToSection(facultyId) {
  let sectionId = "";
  if (facultyId == 4) sectionId = "it-computer";
  else if (facultyId == 2) sectionId = "health";
  else if (facultyId == 3) sectionId = "economi-busines";

  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// jQuery: Populate study program select based on faculty
$('#faculty').on('change', function () {
  let facultyId = $(this).val();

  if (facultyId) {
      $('#study_program').html('<option>Loading...</option>');

      $.ajax({
          url: '/get-study-programs/' + facultyId,
          type: 'GET',
          success: function (data) {
              $('#study_program').empty();
              $('#study_program').append('<option value="">Select Program</option>');
              $.each(data, function (key, value) {
                  $('#study_program').append('<option value="' + value.id + '">' + value.prody_name + '</option>');
              });
          }
      });
  } else {
      $('#study_program').html('<option value="">Select Program</option>');
  }
});


function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
  }
}