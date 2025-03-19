/**
* Template Name: FlexStart
* Template URL: https://bootstrapmade.com/flexstart-bootstrap-startup-template/
* Updated: Nov 01 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {

  // auto slide
  document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    let intervalId; // Untuk menyimpan interval auto-slide

    if (!slides.length) return; // Hentikan jika tidak ada slide

    // Fungsi untuk menampilkan slide
    function showSlide(index) {
        if (index >= totalSlides) {
            currentIndex = 0; // Kembali ke awal jika melewati jumlah slide
        } else if (index < 0) {
            currentIndex = totalSlides - 1; // Kembali ke slide terakhir jika ke bawah
        } else {
            currentIndex = index;
        }

        // Menggeser slider
        const slider = document.querySelector(".slider");
        if (slider) {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }

    // Fungsi untuk memulai auto-slide
    function startAutoSlide() {
        intervalId = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 3000); // Ganti setiap 3 detik
    }

    // Fungsi untuk menghentikan auto-slide
    function stopAutoSlide() {
        clearInterval(intervalId);
    }

    // Tambahkan event untuk menghentikan dan melanjutkan saat hover
    const sliderContainer = document.querySelector(".slider-container");
    if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", stopAutoSlide);
        sliderContainer.addEventListener("mouseleave", startAutoSlide);
    }

    // Mulai auto-slide
    startAutoSlide();
});



const swiper = new Swiper('.swiper-container', {
  slidesPerView: 5, // Tampilkan 5 slide sekaligus
  spaceBetween: 10, // Spasi antar slide
  autoplay: {
    delay: 2000, // Durasi antar slide (2 detik)
    disableOnInteraction: false, // Tetap autoplay meskipun pengguna berinteraksi
  },
  loop: true, // Mengaktifkan loop (mengulang slide)
  loopAdditionalSlides: 2, // Menambahkan 2 slide ekstra untuk memastikan loop berjalan mulus
  navigation: {
    nextEl: '.swiper-button-next', // Tombol untuk slide ke kanan
    prevEl: '.swiper-button-prev', // Tombol untuk slide ke kiri
  },
  pagination: {
    el: '.swiper-pagination', // Pagination untuk navigasi slide
    clickable: true, // Membuat pagination dapat diklik
  },
  breakpoints: {
    768: {
      slidesPerView: 2, // Menampilkan 2 slide pada layar lebih kecil (tablet)
    },
    576: {
      slidesPerView: 1, // Menampilkan 1 slide pada layar lebih kecil (mobile)
    },
  },
});



  "use strict";

  
  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  
  // JavaScript untuk menghilangkan preloader saat halaman selesai dimuat
window.addEventListener('load', function () {
  const preloader = document.getElementById('js-preloader');
  preloader.classList.add('fade-out'); // Tambahkan kelas fade-out untuk animasi
  setTimeout(function () {
    preloader.style.display = 'none'; // Sembunyikan preloader
  }, 500); // Sesuaikan waktu animasi (ms) sesuai kebutuhan
});

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper('.custom-swiper', {
      loop: true, // Aktifkan looping
      autoplay: {
        delay: 2000, // Slide akan berpindah setiap 2 detik
        disableOnInteraction: false, // Autoplay tetap berjalan meskipun ada interaksi
      },
      slidesPerView: 1, // Menampilkan 1 slide pada satu waktu
      spaceBetween: 10, // Jarak antar slide
      speed: 1000, // Kecepatan transisi antar slide dalam ms
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  let currentSlide = 0;
  const slides = document.querySelectorAll(".slide");

  function showSlide(index) {
    slides[currentSlide].classList.remove("active");
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  function changeSlide(n) {
    showSlide(currentSlide + n);
  }

  setInterval(() => {
    changeSlide(1);
  }, 5000); // Durasi 5 detik per slide


  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
//untuk fakultas auto scroll
function scrollToSection(facultyId) {
  let sectionId = "";

  if (facultyId == 4) sectionId = "it-computer";
  else if (facultyId == 2) sectionId = "health";
  else if (facultyId == 3) sectionId = "economi-busines";

  if (sectionId) {
      document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  }
}