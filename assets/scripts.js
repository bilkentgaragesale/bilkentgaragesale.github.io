// Language Setting
document.getElementById('languageSwitcher').addEventListener('change', function() {
  const lang = this.value;
  localStorage.setItem('selectedLanguage', lang);

  if (lang === 'tr') {
    window.location.href = '../tr/index.html';
  } else {
    window.location.href = '../en/index.html';
  }
});

// Load saved language preference
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('selectedLanguage') || 'en';
  document.getElementById('languageSwitcher').value = savedLang;

  initDescriptionClamps();
  updateShowMoreLabels();
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("prev") || event.target.classList.contains("next")) {
    const carousel = event.target.closest(".carousel");
    const imgElement = carousel.querySelector("img");
    const images = JSON.parse(carousel.getAttribute("data-images"));

    const currentFilename = imgElement.src.split("/").pop();
    let currentIndex = images.findIndex(img => img.endsWith(currentFilename));

    if (event.target.classList.contains("prev")) {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    } else {
      currentIndex = (currentIndex + 1) % images.length;
    }

    imgElement.src = images[currentIndex];
  }
});

let lightboxImages = [];
let lightboxIndex = 0;

// Open lightbox when image is clicked
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('product-image')) {
    const carousel = e.target.closest('.carousel');
    lightboxImages = JSON.parse(carousel.getAttribute('data-images'));
    lightboxIndex = lightboxImages.findIndex(img => img.endsWith(e.target.src.split("/").pop()));
    
    document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
    document.getElementById('lightbox').style.display = 'flex';
  }
});

// Lightbox Previous Button
document.getElementById('lightbox-prev').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
});

// Lightbox Next Button
document.getElementById('lightbox-next').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
});

// Close lightbox
document.querySelector('.lightbox-close').addEventListener('click', () => {
  document.getElementById('lightbox').style.display = 'none';
});

// Close if clicking outside image
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox') {
    document.getElementById('lightbox').style.display = 'none';
  }
});

// Closing the modal
document.getElementById('closeModal').addEventListener('click', function () {
document.getElementById('contactModal').style.display = 'none';
});

// Opening the modal
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('contact-seller')) {
    const itemName = event.target.getAttribute('data-item');
    const modal = document.getElementById('contactModal');
    const iframe = document.getElementById('contactFormIframe');

    if (iframe) {
      iframe.src = `https://docs.google.com/forms/d/e/1FAIpQLScdBPzBo4IsCkMlz0WT_1QzTOrfuU5aUYmjoEfbByxiO5Fu0w/viewform?usp=pp_url&entry.235809773=${encodeURIComponent(itemName)}`;
      modal.style.display = 'block';
    }
  }
});

function getShowMoreLabel(expanded) {
  const lang = document.documentElement.lang || 'en';
  if (lang === 'tr') return expanded ? 'Daha Az Göster' : 'Daha Fazla Göster';
  return expanded ? 'Show Less' : 'Show More';
}

function updateShowMoreLabels() {
  document.querySelectorAll('.show-more-btn').forEach(btn => {
    const expanded = btn.getAttribute('data-expanded') === 'true';
    btn.textContent = getShowMoreLabel(expanded);
  });
}

/* Call this AFTER you render all product cards into the DOM */
function initDescriptionClamps() {
  // remove old buttons (useful when re-rendering on language switch)
  document.querySelectorAll('.show-more-btn').forEach(b => b.remove());

  document.querySelectorAll('.description-text').forEach(el => {
    // Force layout to ensure correct measurements
    // (optional) el.offsetHeight;

    el.classList.remove('clamped', 'expanded'); // reset state

    // If content actually overflows, add a toggle button
    const isOverflowing = el.scrollHeight - 1 > el.clientHeight; // small fudge
    if (isOverflowing) {
      el.classList.add('clamped');

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'show-more-btn';
      btn.setAttribute('data-expanded', 'false');
      btn.textContent = getShowMoreLabel(false);
      el.insertAdjacentElement('afterend', btn);

      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('data-expanded') === 'true';
        el.classList.toggle('expanded', !expanded);
        btn.setAttribute('data-expanded', String(!expanded));
        btn.textContent = getShowMoreLabel(!expanded);
      });
    } 
    // else {
    //   // ensure unclamped state if not overflowing
    //   el.classList.remove('expanded');
    // }
  });
}
