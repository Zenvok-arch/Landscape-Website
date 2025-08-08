document.addEventListener('DOMContentLoaded', () => {

  window.addEventListener('load', () => {
    // Delay duration in milliseconds (e.g., 200ms = 2 seconds)
    const delayMs = 200;

    setTimeout(() => {
      document.body.style.visibility = 'visible';
    }, delayMs);
  });

  // =============================================
  // --- Hamburger Menu Logic ---
  // =============================================
  const hamberger = document.querySelector(".hamberger");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  const aside = document.querySelector(".navitems-mb");
  const body = document.querySelector("body");
  const navLink = document.querySelectorAll(".navitem-mb li:not(.mobile-dropdown) > a");
  const fabContainer = document.querySelector(".floating-action-buttons");

  hamberger.addEventListener("click", () => {
    hamberger.classList.toggle("active");
    mobileOverlay.classList.toggle("active");
    aside.classList.toggle("active");
    body.classList.toggle("hidden");
    fabContainer.classList.toggle("fabs-hidden");

    if (typeof updateSlider === 'function') {
      // Use a small timeout to let the menu animation start first
      setTimeout(updateSlider, 50);
    }
  });

  function closeMobileMenu() {
    hamberger.classList.remove("active");
    mobileOverlay.classList.remove("active");
    aside.classList.remove("active");
    body.classList.remove("hidden");
    fabContainer.classList.remove("fabs-hidden");

    // Find any open dropdown and reset it
    const openDropdown = document.querySelector('.mobile-dropdown.is-open');
    if (openDropdown) {
      openDropdown.classList.remove('is-open');
      const submenu = openDropdown.querySelector('.mobile-submenu');
      submenu.style.maxHeight = '0px';
    }

  }

  mobileOverlay.addEventListener("click", closeMobileMenu);
  navLink.forEach(n => n.addEventListener("click", closeMobileMenu));

  // =============================================
  // --- Professional Desktop Dropdown Logic ---
  // =============================================
  const dropdowns = document.querySelectorAll('.dropdown-li');

  dropdowns.forEach(dropdown => {
    const triggerLink = dropdown.querySelector('a');

    triggerLink.addEventListener('click', (event) => {
      // For single-page sites, we always want to prevent the jump
      event.preventDefault();

      // Close any other dropdowns that might be open
      document.querySelectorAll('.dropdown-li.is-open').forEach(openDropdown => {
        if (openDropdown !== dropdown) {
          openDropdown.classList.remove('is-open');
        }
      });

      // Toggle the current dropdown
      dropdown.classList.toggle('is-open');
    });
  });

  // Add a global listener to close the menu when clicking anywhere else
  window.addEventListener('click', (event) => {
    // If the click was NOT inside a dropdown, close all dropdowns
    if (!event.target.closest('.dropdown-li')) {
      document.querySelectorAll('.dropdown-li.is-open').forEach(dropdown => {
        dropdown.classList.remove('is-open');
      });
    }
  });

  // =============================================
  // --- Logic to Close Dropdown on Item Click ---
  // =============================================
  const dropdownMenuItems = document.querySelectorAll('.dropdown-menu li a');

  dropdownMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      const parentDropdown = item.closest('.dropdown-li');
      if (parentDropdown) {
        parentDropdown.classList.remove('is-open');
      }
    });
  });

  // =============================================
  // --- Mobile Accordion Menu Logic ---
  // =============================================
  const mobileDropdownTrigger = document.querySelector('.mobile-dropdown > a');

  if (mobileDropdownTrigger) {
    mobileDropdownTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      const parentLi = mobileDropdownTrigger.parentElement;
      parentLi.classList.toggle('is-open');
      const submenu = parentLi.querySelector('.mobile-submenu');
      if (parentLi.classList.contains('is-open')) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
      } else {
        submenu.style.maxHeight = '0px';
      }
    });
  }
  // =============================================
  // --- Infinite Hero Slider Logic ---
  // =============================================
  const sliderWrapper = document.querySelector('.slider-wrapper');

  // Check if the slider exists on the page before running the code
  if (sliderWrapper) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    // Clone the first and last slides
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);

    sliderWrapper.appendChild(firstClone);
    sliderWrapper.insertBefore(lastClone, slides[0]);

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const allSlides = document.querySelectorAll('.slide');

    let currentIndex = 1;

    function updateSlider() {
      const slideWidth = allSlides[0].clientWidth;
      sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function setInitialPosition() {
      sliderWrapper.style.transition = 'none';
      updateSlider();
    }

    setInitialPosition();

    setTimeout(() => {
      sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
    }, 50);

    nextBtn.addEventListener('click', () => {
      if (currentIndex >= allSlides.length - 1) return;
      currentIndex++;
      updateSlider();
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex <= 0) return;
      currentIndex--;
      updateSlider();
    });

    sliderWrapper.addEventListener('transitionend', () => {
      if (currentIndex === allSlides.length - 1) {
        sliderWrapper.style.transition = 'none';
        currentIndex = 1;
        updateSlider();
      }
      if (currentIndex === 0) {
        sliderWrapper.style.transition = 'none';
        currentIndex = totalSlides;
        updateSlider();
      }
      setTimeout(() => {
        sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
      }, 50);
    });

    window.addEventListener('resize', () => {
      sliderWrapper.style.transition = 'none';
      updateSlider();
      setTimeout(() => {
        sliderWrapper.style.transition = 'transform 0.5s ease-in-out';
      }, 50);
    });

    setInterval(() => {
      nextBtn.click();
    }, 5000);
  }

  // =============================================
  // --- Universal Popup Form Logic ---
  // =============================================
  const openPopupButtons = document.querySelectorAll('.js-open-popup');
  const contactPopup = document.getElementById('contact-popup');
  const closePopupBtn = document.getElementById('close-popup-btn');
  const popupOverlay = document.getElementById('contact-popup-overlay');

  if (contactPopup) {
    function openPopup() {
      contactPopup.classList.add('active');
      popupOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closePopup() {
      contactPopup.classList.remove('active');
      popupOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    openPopupButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        openPopup();
      });
    });
    closePopupBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);
  }

// =============================================
// --- FINAL Cloudflare Form Submission Logic ---
// =============================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'SENDING...';

    const formData = new FormData(contactForm);
    const workerUrl = '/submit-form'; // This now points to your new function file

    fetch(workerUrl, {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      formStatus.textContent = data.message;
      if (data.success) {
        formStatus.className = 'form-status-message success';
        contactForm.reset();
        // This resets the Turnstile widget after a successful submission
        turnstile.reset(); 
      } else {
        formStatus.className = 'form-status-message error';
      }
    })
    .catch(error => {
      formStatus.textContent = 'A network error occurred. Please try again.';
      formStatus.className = 'form-status-message error';
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 6000);
    });
  });
}

  // =============================================
  // --- DYNAMIC & Reusable Custom Select Dropdown ---
  // =============================================
  document.querySelectorAll('.custom-select-wrapper').forEach(setupCustomSelect);

  function setupCustomSelect(wrapper) {
    const selectElement = wrapper.querySelector('select');
    const customSelectContainer = document.createElement('div');
    customSelectContainer.classList.add('custom-select');

    const trigger = document.createElement('div');
    trigger.classList.add('custom-select-trigger');
    trigger.innerHTML = `<span>${selectElement.options[selectElement.selectedIndex].textContent}</span><div class="arrow"></div>`;
    customSelectContainer.appendChild(trigger);

    const options = document.createElement('div');
    options.classList.add('custom-options');

    for (const optionElement of selectElement.options) {
      if (optionElement.disabled) continue;

      const customOption = document.createElement('span');
      customOption.classList.add('custom-option');
      customOption.textContent = optionElement.textContent;
      customOption.setAttribute('data-value', optionElement.value);

      customOption.addEventListener('click', () => {
        trigger.querySelector('span').textContent = customOption.textContent;
        selectElement.value = customOption.getAttribute('data-value');
        customSelectContainer.classList.remove('open');
      });

      options.appendChild(customOption);
    }

    customSelectContainer.appendChild(options);
    wrapper.appendChild(customSelectContainer);
    selectElement.style.display = 'none';

    trigger.addEventListener('click', () => {
      customSelectContainer.classList.toggle('open');
    });
  }

  window.addEventListener('click', (e) => {
    document.querySelectorAll('.custom-select.open').forEach(openSelect => {
      if (!openSelect.parentElement.contains(e.target)) {
        openSelect.classList.remove('open');
      }
    });
  });

  // =============================================
  // --- FINAL "Silent" Floating Action Buttons Logic ---
  // =============================================
  const callFabText = document.getElementById('call-fab-text');
  const whatsappFabText = document.getElementById('whatsapp-fab-text');

  if (callFabText && whatsappFabText) {
    let isTextVisible = false;
    const callTextStates = ["Talk To An Expert", "Get a Free Quote"];
    const whatsappTextStates = ["Chat on WhatsApp", "Ask Us Anything"];
    let callTextIndex = 0;
    let whatsappTextIndex = 0;

    function showMessage(element, text, duration) {
      if (isTextVisible) return;
      isTextVisible = true;
      element.textContent = text;
      element.classList.add('is-visible');
      setTimeout(() => {
        element.classList.remove('is-visible');
        isTextVisible = false;
      }, duration);
    }

    function animationLoop() {
      const nextInterval = 20000 + (Math.random() * 15000);
      setTimeout(() => {
        if (!isTextVisible) {
          if (Math.random() > 0.5) {
            const text = callTextStates[callTextIndex % callTextStates.length];
            showMessage(callFabText, text, 10000);
            callTextIndex++;
          } else {
            const text = whatsappTextStates[whatsappTextIndex % whatsappTextStates.length];
            showMessage(whatsappFabText, text, 10000);
            whatsappTextIndex++;
          }
        }
        animationLoop();
      }, nextInterval);
    }
    setTimeout(animationLoop, 5000);
  }

  // --- Scroll Detection Logic ---
  const allFabs = document.querySelectorAll('.fab-side-btn, .fab-main-cta');
  let scrollTimer;

  window.addEventListener('scroll', () => {
    allFabs.forEach(fab => fab.classList.add('is-scrolling'));
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      allFabs.forEach(fab => fab.classList.remove('is-scrolling'));
    }, 500);
  });

  // =============================================
  // --- Hide FABs When Footer is Visible Logic (IMPROVED) ---
  // =============================================
  const fabHideZone = document.querySelector('#fab-hide-trigger-zone');

  if (fabContainer && fabHideZone) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.01
    };

    const fabObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fabContainer.classList.add('is-hidden');
        } else {
          if (entry.boundingClientRect.top > 0) {
            fabContainer.classList.remove('is-hidden');
          }
        }
      });
    }, observerOptions);

    fabObserver.observe(fabHideZone);
  }

  // =============================================
  // --- FIX for Glitching Testimonial Scroller ---
  // =============================================
  const testimonialScroller = document.querySelector(".testimonial-v2-scroller");

  if (testimonialScroller) {
    const scrollerInner = testimonialScroller.querySelector(".testimonial-v2-inner");
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach(item => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  }

  // =============================================
  // --- Scroll to Top Button Logic ---
  // =============================================
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        scrollToTopBtn.classList.add("is-visible");
      } else {
        scrollToTopBtn.classList.remove("is-visible");
      }
    });

    scrollToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

});