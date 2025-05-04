// Deklarasi variabel
const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const profileHeader = document.getElementById('profile-header');
const heroContent = document.getElementById('hero-content');
const heroSection = document.getElementById('home');
const navLinksContainer = document.getElementById('nav-links');
const portfolioGrid = document.getElementById('portfolio-grid');
const portfolioLeftArrow = document.getElementById('portfolio-left-arrow');
const portfolioRightArrow = document.getElementById('portfolio-right-arrow');
const certGrid = document.getElementById('certificates-grid');
const certLeftArrow = document.getElementById('cert-left-arrow');
const certRightArrow = document.getElementById('cert-right-arrow');
const certificateItems = document.querySelectorAll('#certificates-grid .certificate-item');

// Cek apakah elemen ada
if (!navbar || !hamburger || !navLinks) {
  console.error('Error: navbar, hamburger, atau nav-links tidak ditemukan di HTML');
}

if (!portfolioGrid || !portfolioLeftArrow || !portfolioRightArrow) {
  console.error('Error: portfolio-grid, portfolio-left-arrow, atau portfolio-right-arrow tidak ditemukan di HTML');
}

if (!certGrid || !certLeftArrow || !certRightArrow) {
  console.error('Error: certificates-grid, cert-left-arrow, atau cert-right-arrow tidak ditemukan di HTML');
}

// Nonaktifkan scroll restoration browser
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
  console.log('Scroll restoration dinonaktifkan');
}

// Langsung atur posisi scroll ke atas di awal
window.scrollTo({
  top: 0,
  behavior: 'instant'
});
console.log('Posisi scroll diatur ke atas di awal script');

// GSAP dan ScrollTrigger Setup
gsap.registerPlugin(ScrollTrigger);

// Pastikan halaman dimuat dengan benar
document.addEventListener('DOMContentLoaded', () => {
  // Pastikan halaman mulai dari atas
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
  console.log('Halaman dimuat (DOMContentLoaded), discroll ke atas');

  // Inisialisasi filter untuk certificates
  const allFilterButton = document.querySelector('.certificates-filter .filter-btn[data-filter="all"]');
  if (allFilterButton) {
    allFilterButton.click(); // Simulasikan klik pada filter "All"
  }

  // Inisialisasi slider
  updatePortfolioArrows();
  updateCertArrows();
});

// Pastikan halaman mulai dari atas setelah semua sumber daya dimuat
window.onload = () => {
  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
  console.log('Halaman selesai dimuat (window.onload), discroll ke atas');

  // Tambahkan timeout untuk memastikan posisi scroll tetap di atas
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    console.log('Timeout: Posisi scroll dipastikan di atas');
  }, 100);

  // Atur ulang status elemen untuk desktop
  if (window.innerWidth > 768) {
    if (profileHeader && heroContent && navLinksContainer) {
      profileHeader.style.display = 'none';
      heroContent.style.display = 'flex';
      gsap.to(navLinksContainer, {
        x: '0%',
        duration: 0
      });
      console.log('Desktop: Profile header disembunyikan, nav links diatur ulang');
    }
  } else {
    // Atur ulang status elemen untuk mobile
    navbar.classList.add('navbar-home');
    navbar.classList.remove('scrolled');
    if (heroContent) {
      heroContent.style.opacity = '1';
    }
    console.log('Mobile: Navbar diatur ke navbar-home');
  }

  // Refresh ScrollTrigger
  ScrollTrigger.refresh();
  console.log('ScrollTrigger di-refresh');
};

// Inisialisasi awal untuk mobile
if (window.innerWidth <= 768 && window.scrollY === 0) {
  navbar.classList.add('navbar-home');
  console.log('Initial: Added .navbar-home on load');
}

// Hamburger Menu Toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    console.log('Hamburger clicked');
    const isActive = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active', isActive);
    if (isActive) {
      const navbarHeight = navbar.offsetHeight;
      navLinks.style.top = `${navbarHeight}px`;
      navLinks.scrollTop = 0;
      console.log('Navbar height:', navbarHeight);
    } else {
      navLinks.style.top = '';
    }
  });

  // Tutup menu saat klik di luar menu
  document.addEventListener('click', (e) => {
    if (
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target) &&
      navLinks.classList.contains('active')
    ) {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      navLinks.style.top = '';
    }
  });
}

// Tutup menu saat klik link navigasi
if (navLinks && navbar) {
  document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      const navbarHeight = navbar.offsetHeight;
      const offset = window.innerWidth <= 768 ? 0 : -20;

      let targetPosition;
      if (targetId === 'home') {
        targetPosition = 0;
      } else {
        targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;
      }

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Gunakan event scrollend jika didukung, atau fallback ke setTimeout
      if ('onscrollend' in window) {
        window.addEventListener('scrollend', () => {
          ScrollTrigger.refresh();
        }, { once: true });
      } else {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 1000);
      }

      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      navLinks.style.top = '';
    });
  });
}

// Update posisi nav-links saat scroll
if (navbar && navLinks) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    if (navLinks.classList.contains('active')) {
      const navbarHeight = navbar.offsetHeight;
      navLinks.style.top = `${navbarHeight}px`;
      console.log('Scroll - Navbar height:', navbarHeight);
    }
  });
}

// Responsivitas nav-links saat resize
window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) {
    if (!navLinks.classList.contains('active')) {
      navLinks.style.display = 'none';
    }
  } else {
    navLinks.style.display = 'flex';
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// Dynamic Dropdown Position for CV Preview and Download
document.querySelectorAll('.cv-preview, .cv-download').forEach(container => {
  const options = container.querySelector('.cv-options');
  container.addEventListener('mouseenter', () => {
    const rect = container.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < options.offsetHeight && spaceAbove > spaceBelow) {
      options.style.bottom = 'auto';
      options.style.top = '-100%';
    } else {
      options.style.top = 'auto';
      options.style.bottom = '100%';
    }
  });
});

// Back to Top and Back to Bottom Buttons
const backToTop = document.querySelector('.back-to-top');
const backToBottom = document.querySelector('.back-to-bottom');
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollPosition > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }

  if (scrollPosition + windowHeight < documentHeight - 300) {
    backToBottom.style.display = 'block';
  } else {
    backToBottom.style.display = 'none';
  }
});

// GSAP Animations (Fade-In on Scroll)
document.querySelectorAll('.fade-in').forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      onRefresh: () => {}
    }
  });
});

// Profile, Name, and Nav Links Animation
if (profileHeader && heroContent && heroSection && navLinksContainer) {
  ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: 'bottom top',
    onEnter: () => {
      console.log('Enter #home, width:', window.innerWidth);
      if (window.innerWidth <= 768) {
        navbar.classList.add('navbar-home');
      }
    },
    onLeave: () => {
      console.log('Leave #home, width:', window.innerWidth);
      if (window.innerWidth > 768) {
        profileHeader.style.display = 'flex';
        heroContent.style.display = 'none';
        gsap.to(navLinksContainer, {
          x: '37%',
          duration: 0.5,
          ease: 'power3.out'
        });
      } else {
        navbar.classList.remove('navbar-home');
        navbar.classList.add('scrolled');
      }
    },
    onEnterBack: () => {
      console.log('EnterBack #home, width:', window.innerWidth);
      if (window.innerWidth > 768) {
        profileHeader.style.display = 'none';
        heroContent.style.display = 'flex';
        gsap.to(navLinksContainer, {
          x: '0%',
          duration: 0.5,
          ease: 'power3.out'
        });
      } else {
        navbar.classList.add('navbar-home');
        if (window.scrollY <= 50) {
          navbar.classList.remove('scrolled');
        }
        heroContent.style.opacity = '1';
      }
    }
  });
}

// Portfolio Slider
let portfolioPos = 0;
const portfolioCardWidth = 250;
const portfolioCardMargin = 20;

// Tentukan portfolioCardsPerSlide berdasarkan lebar layar
const getPortfolioCardsPerSlide = () => {
  const cardsPerSlide = window.innerWidth <= 768 ? 1 : 4;
  console.log('getPortfolioCardsPerSlide - window.innerWidth:', window.innerWidth, 'cardsPerSlide:', cardsPerSlide);
  return cardsPerSlide;
};
let portfolioCardsPerSlide = getPortfolioCardsPerSlide();
let portfolioSlideWidth = (portfolioCardWidth * portfolioCardsPerSlide) + (portfolioCardMargin * (portfolioCardsPerSlide - 1));

// Update portfolioSlideWidth saat window di-resize
window.addEventListener('resize', () => {
  portfolioCardsPerSlide = getPortfolioCardsPerSlide();
  portfolioSlideWidth = (portfolioCardWidth * portfolioCardsPerSlide) + (portfolioCardMargin * (portfolioCardsPerSlide - 1));
  portfolioPos = portfolioGrid.scrollLeft;
  console.log('Resize - portfolioCardsPerSlide:', portfolioCardsPerSlide, 'portfolioSlideWidth:', portfolioSlideWidth);
  updatePortfolioArrows();
  ScrollTrigger.refresh();

  // Update juga untuk certificates
  certCardsPerSlide = getCardsPerSlide();
  certSlideWidth = certSingleSlideWidth * certCardsPerSlide;
  certPos = certGrid.scrollLeft;
  console.log('Resize - certCardsPerSlide:', certCardsPerSlide, 'certSlideWidth:', certSlideWidth);
  updateCertArrows();
});

function updatePortfolioArrows() {
  const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)');
  const maxPos = Math.max(0, (portfolioItems.length - portfolioCardsPerSlide) * (portfolioCardWidth + portfolioCardMargin));
  portfolioPos = portfolioGrid.scrollLeft;
  portfolioLeftArrow.disabled = portfolioPos <= 0;
  portfolioRightArrow.disabled = portfolioPos >= maxPos;
  portfolioLeftArrow.style.opacity = portfolioPos <= 0 ? 0.5 : 1;
  portfolioRightArrow.style.opacity = portfolioPos >= maxPos ? 0.5 : 1;
}

if (portfolioLeftArrow) {
  portfolioLeftArrow.addEventListener('click', () => {
    portfolioPos = Math.max(portfolioGrid.scrollLeft - portfolioSlideWidth, 0);
    portfolioGrid.scrollTo({
      left: portfolioPos,
      behavior: 'smooth'
    });
    updatePortfolioArrows();
  });
}

if (portfolioRightArrow) {
  portfolioRightArrow.addEventListener('click', () => {
    const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)');
    const maxPos = Math.max(0, (portfolioItems.length - portfolioCardsPerSlide) * (portfolioCardWidth + portfolioCardMargin));
    portfolioPos = Math.min(portfolioGrid.scrollLeft + portfolioSlideWidth, maxPos);
    portfolioGrid.scrollTo({
      left: portfolioPos,
      behavior: 'smooth'
    });
    updatePortfolioArrows();
  });
}

portfolioGrid.addEventListener('scroll', () => {
  updatePortfolioArrows();
});

// Drag-scroll untuk Portfolio (Mouse)
let isDraggingPortfolio = false;
let startXPortfolio = 0;
let initialPortfolioPos = 0;

portfolioGrid.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isDraggingPortfolio = true;
  startXPortfolio = e.pageX;
  initialPortfolioPos = portfolioGrid.scrollLeft;
  portfolioGrid.classList.add('dragging');
  portfolioGrid.style.cursor = 'grabbing';
});

portfolioGrid.addEventListener('mouseleave', () => {
  if (isDraggingPortfolio) {
    isDraggingPortfolio = false;
    portfolioGrid.classList.remove('dragging');
    portfolioGrid.style.cursor = 'grab';
    updatePortfolioArrows();
  }
});

portfolioGrid.addEventListener('mouseup', () => {
  if (isDraggingPortfolio) {
    isDraggingPortfolio = false;
    portfolioGrid.classList.remove('dragging');
    portfolioGrid.style.cursor = 'grab';
    updatePortfolioArrows();
  }
});

portfolioGrid.addEventListener('mousemove', (e) => {
  if (!isDraggingPortfolio) return;
  e.preventDefault();
  const x = e.pageX;
  const walk = (x - startXPortfolio) * 1.5;
  const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)');
  const maxPos = Math.max(0, (portfolioItems.length - portfolioCardsPerSlide) * (portfolioCardWidth + portfolioCardMargin));
  portfolioPos = Math.min(Math.max(initialPortfolioPos - walk, 0), maxPos);
  portfolioGrid.scrollLeft = portfolioPos;
});

// Drag-scroll untuk Portfolio (Touch)
portfolioGrid.addEventListener('touchstart', (e) => {
  isDraggingPortfolio = true;
  startXPortfolio = e.touches[0].pageX;
  initialPortfolioPos = portfolioGrid.scrollLeft;
  portfolioGrid.classList.add('dragging');
});

portfolioGrid.addEventListener('touchend', () => {
  if (isDraggingPortfolio) {
    isDraggingPortfolio = false;
    portfolioGrid.classList.remove('dragging');
    updatePortfolioArrows();
  }
});

portfolioGrid.addEventListener('touchmove', (e) => {
  if (!isDraggingPortfolio) return;
  const x = e.touches[0].pageX;
  const walk = (x - startXPortfolio) * 1.5;
  const portfolioItems = portfolioGrid.querySelectorAll('.portfolio-item:not(.hidden)');
  const maxPos = Math.max(0, (portfolioItems.length - portfolioCardsPerSlide) * (portfolioCardWidth + portfolioCardMargin));
  portfolioPos = Math.min(Math.max(initialPortfolioPos - walk, 0), maxPos);
  portfolioGrid.scrollLeft = portfolioPos;
});

// Certificates Slider
let certPos = 0;
const certCardWidth = 240;
const certCardMargin = 15;
const certSingleSlideWidth = certCardWidth + certCardMargin;

// Tentukan certCardsPerSlide berdasarkan lebar layar
const getCardsPerSlide = () => {
  const cardsPerSlide = window.innerWidth <= 768 ? 1 : 3;
  console.log('getCardsPerSlide - window.innerWidth:', window.innerWidth, 'cardsPerSlide:', cardsPerSlide);
  return cardsPerSlide;
};
let certCardsPerSlide = getCardsPerSlide();
let certSlideWidth = certSingleSlideWidth * certCardsPerSlide;

// Fungsi untuk menghitung visibleCertificates
function getVisibleCertificates() {
  const items = Array.from(certGrid.querySelectorAll('.certificate-item')).filter(item => {
    return !item.classList.contains('hidden') && item.style.display !== 'none';
  });
  console.log('getVisibleCertificates - Total visible items:', items.length);
  items.forEach((item, index) => {
    console.log(`Item ${index}: category=${item.getAttribute('data-category')}, display=${item.style.display}, offsetWidth=${item.offsetWidth}`);
  });
  return items.length;
}

// Arrow Logic untuk Certificates
function updateCertArrows() {
  const visibleItems = Array.from(certGrid.querySelectorAll('.certificate-item')).filter(item => {
    return !item.classList.contains('hidden') && item.style.display !== 'none';
  });

  // Hitung lebar total untuk debugging
  let totalWidth = 0;
  visibleItems.forEach((item, index) => {
    const itemWidth = item.offsetWidth || certCardWidth; // Fallback ke certCardWidth jika offsetWidth 0
    totalWidth += itemWidth + certCardMargin;
    console.log(`Item ${index}: lebar=${itemWidth}, kategori=${item.getAttribute('data-category')}`);
  });
  totalWidth -= certCardMargin; // Kurangi margin terakhir

  const containerWidth = certGrid.clientWidth;
  const actualScrollWidth = certGrid.scrollWidth; // Ambil lebar sebenarnya
  const maxPos = Math.max(0, actualScrollWidth - containerWidth); // Gunakan scrollWidth untuk maxPos

  certPos = certGrid.scrollLeft;

  const tolerance = 1;
  const isAtStart = certPos <= tolerance;
  const isAtEnd = certPos >= maxPos - tolerance;

  console.log('updateCertArrows - Jumlah item terlihat:', visibleItems.length, 
              'Lebar total (hitungan):', totalWidth, 
              'Lebar sebenarnya (scrollWidth):', actualScrollWidth, 
              'Lebar container:', containerWidth, 
              'maxPos:', maxPos, 
              'certPos:', certPos, 
              'certCardsPerSlide:', certCardsPerSlide, 
              'isAtStart:', isAtStart, 
              'isAtEnd:', isAtEnd);

  if (isAtStart) {
    console.log('Panah kiri dimatikan - Alasan: certPos <= tolerance');
    certLeftArrow.classList.add('disabled');
    certLeftArrow.disabled = true;
  } else {
    console.log('Panah kiri diaktifkan - Alasan: certPos > tolerance');
    certLeftArrow.classList.remove('disabled');
    certLeftArrow.disabled = false;
  }

  if (isAtEnd) {
    console.log('Panah kanan dimatikan - Alasan: certPos >= maxPos - tolerance');
    certRightArrow.classList.add('disabled');
    certRightArrow.disabled = true;
  } else {
    console.log('Panah kanan diaktifkan - Alasan: certPos < maxPos - tolerance');
    certRightArrow.classList.remove('disabled');
    certRightArrow.disabled = false;
  }

  certLeftArrow.style.opacity = isAtStart ? 0.5 : 1;
  certRightArrow.style.opacity = isAtEnd ? 0.5 : 1;
}

// Event Listener untuk Scroll
certGrid.addEventListener('scroll', () => {
  certPos = certGrid.scrollLeft;
  updateCertArrows();
});

// Event Listener untuk Panah
if (certLeftArrow) {
  certLeftArrow.addEventListener('click', () => {
    const visibleItems = Array.from(certGrid.querySelectorAll('.certificate-item')).filter(item => {
      return !item.classList.contains('hidden') && item.style.display !== 'none';
    });
    let totalWidth = 0;
    visibleItems.forEach(item => {
      totalWidth += item.offsetWidth + certCardMargin;
    });
    totalWidth -= certCardMargin;
    const containerWidth = certGrid.clientWidth;
    const maxPos = Math.max(0, totalWidth - containerWidth);

    certPos = Math.max(certPos - certSlideWidth, 0);
    console.log('Left arrow clicked - Target certPos:', certPos, 'maxPos:', maxPos, 'Current scrollLeft:', certGrid.scrollLeft);
    certGrid.scrollTo({
      left: certPos,
      behavior: 'auto' // Gunakan 'auto' untuk memastikan scroll instan
    });

    // Gunakan requestAnimationFrame untuk sinkronisasi
    let lastScrollLeft = certGrid.scrollLeft;
    const checkScroll = () => {
      const currentScrollLeft = certGrid.scrollLeft;
      console.log('Checking scroll - Current scrollLeft:', currentScrollLeft, 'Target certPos:', certPos);
      
      if (Math.abs(currentScrollLeft - certPos) < 1) {
        certPos = currentScrollLeft;
        updateCertArrows();
        console.log('Scroll completed - Final certPos:', certPos);
      } else if (currentScrollLeft === lastScrollLeft) {
        // Jika scrollLeft tidak berubah, artinya scroll gagal
        console.warn('Scroll failed - Forcing certPos to target:', certPos);
        certGrid.scrollLeft = certPos; // Paksa set scrollLeft
        updateCertArrows();
      } else {
        lastScrollLeft = currentScrollLeft;
        requestAnimationFrame(checkScroll);
      }
    };
    requestAnimationFrame(checkScroll);
  });
}

if (certRightArrow) {
  certRightArrow.addEventListener('click', () => {
    const visibleItems = Array.from(certGrid.querySelectorAll('.certificate-item')).filter(item => {
      return !item.classList.contains('hidden') && item.style.display !== 'none';
    });
    const actualScrollWidth = certGrid.scrollWidth;
    const containerWidth = certGrid.clientWidth;
    const maxPos = Math.max(0, actualScrollWidth - containerWidth);

    // Hitung target certPos
    certPos = Math.min(certPos + certSlideWidth, maxPos);
    console.log('Right arrow clicked - Target certPos:', certPos, 'maxPos:', maxPos, 'Current scrollLeft:', certGrid.scrollLeft);

    // Langsung set scrollLeft tanpa requestAnimationFrame
    certGrid.scrollTo({
      left: certPos,
      behavior: 'smooth' // Kembali ke smooth untuk pengalaman pengguna yang lebih baik
    });

    // Update posisi dan panah setelah scroll selesai
    setTimeout(() => {
      certPos = certGrid.scrollLeft;
      updateCertArrows();
      console.log('Scroll completed - Final certPos:', certPos);
    }, 300); // Beri waktu 300ms untuk scroll selesai
  });
}

// Event Listener untuk Scroll
certGrid.addEventListener('scroll', () => {
  updateCertArrows();

  // Fallback jika scrollend tidak didukung
  clearTimeout(window.certScrollTimeout);
  window.certScrollTimeout = setTimeout(() => {
    certPos = certGrid.scrollLeft;
    updateCertArrows();
  }, 100);
});

certGrid.addEventListener('scrollend', () => {
  certPos = certGrid.scrollLeft;
  console.log('Scroll ended - certPos:', certPos);
  updateCertArrows();
});

// Drag-scroll untuk Certificates (Mouse)
let isDraggingCert = false;
let startXCert = 0;
let initialCertPos = 0;

certGrid.addEventListener('mousedown', (e) => {
  e.preventDefault();
  isDraggingCert = true;
  startXCert = e.pageX;
  initialCertPos = certGrid.scrollLeft;
  certGrid.classList.add('dragging');
  certGrid.style.cursor = 'grabbing';
});

certGrid.addEventListener('mouseleave', () => {
  if (isDraggingCert) {
    isDraggingCert = false;
    certGrid.classList.remove('dragging');
    certGrid.style.cursor = 'grab';
    updateCertArrows();
  }
});

certGrid.addEventListener('mouseup', () => {
  if (isDraggingCert) {
    isDraggingCert = false;
    certGrid.classList.remove('dragging');
    certGrid.style.cursor = 'grab';
    updateCertArrows();
  }
});

certGrid.addEventListener('mousemove', (e) => {
  if (!isDraggingCert) return;
  e.preventDefault();
  const x = e.pageX;
  const walk = (x - startXCert) * 1.5;

  const visibleItems = Array.from(certGrid.querySelectorAll('.certificate-item')).filter(item => {
    return !item.classList.contains('hidden') && item.style.display !== 'none';
  });
  let totalWidth = 0;
  visibleItems.forEach(item => {
    totalWidth += item.offsetWidth + certCardMargin;
  });
  totalWidth -= certCardMargin;
  const containerWidth = certGrid.clientWidth;
  const maxPos = Math.max(0, totalWidth - containerWidth);

  certPos = Math.min(Math.max(initialCertPos - walk, 0), maxPos);
  certGrid.scrollLeft = certPos;
  console.log('Dragging - certPos:', certPos, 'maxPos:', maxPos, 'Visible items:', visibleItems.length);
});

// Drag-scroll untuk Certificates (Touch)
certGrid.addEventListener('touchstart', (e) => {
  isDraggingCert = true;
  startXCert = e.touches[0].pageX;
  initialCertPos = certGrid.scrollLeft;
  certGrid.classList.add('dragging');
});

certGrid.addEventListener('touchend', () => {
  if (isDraggingCert) {
    isDraggingCert = false;
    certGrid.classList.remove('dragging');
    updateCertArrows();
  }
});

certGrid.addEventListener('touchmove', (e) => {
  if (!isDraggingCert) return;
  const x = e.touches[0].pageX;
  const walk = (x - startXCert) * 1.5;

  const visibleItems = Array.from(certGrid.querySelectorAll('.certificate-item')).filter(item => {
    return !item.classList.contains('hidden') && item.style.display !== 'none';
  });
  let totalWidth = 0;
  visibleItems.forEach(item => {
    totalWidth += item.offsetWidth + certCardMargin;
  });
  totalWidth -= certCardMargin;
  const containerWidth = certGrid.clientWidth;
  const maxPos = Math.max(0, totalWidth - containerWidth);

  certPos = Math.min(Math.max(initialCertPos - walk, 0), maxPos);
  certGrid.scrollLeft = certPos;
  console.log('Touching - certPos:', certPos, 'maxPos:', maxPos, 'Visible items:', visibleItems.length);
});

// Filter Logic untuk Centering
function applyFilter(grid, items, filter) {
  items.forEach(item => {
    const techOrCategory = grid.id === 'portfolio-grid' ? item.dataset.tech : item.dataset.category;
    if (filter === 'all') {
      item.classList.remove('hidden');
      item.style.display = 'block';
    } else {
      const techArray = grid.id === 'portfolio-grid' ? techOrCategory.split(' ') : [techOrCategory];
      if (techArray.includes(filter)) {
        item.classList.remove('hidden');
        item.style.display = 'block';
      } else {
        item.classList.add('hidden');
        item.style.display = 'none';
      }
    }
  });

  const visibleItems = grid.querySelectorAll('.portfolio-item:not(.hidden), .certificate-item:not(.hidden)').length;
  const itemsPerSlide = grid.id === 'portfolio-grid' ? portfolioCardsPerSlide : certCardsPerSlide;

  // Tambahkan atau hapus class untuk centering
  if (visibleItems <= itemsPerSlide) {
    grid.classList.add('filtered');
    grid.classList.add('cert-grid-centered'); // Tambah class untuk rata tengah
  } else {
    grid.classList.remove('filtered');
    grid.classList.remove('cert-grid-centered'); // Hapus class jika tidak perlu rata tengah
  }

  console.log(`${grid.id} total width after filter:`, grid.scrollWidth);

  if (grid.id === 'portfolio-grid') {
    portfolioPos = 0;
    portfolioGrid.scrollLeft = 0;
    updatePortfolioArrows();
  } else {
    certPos = 0;
    certGrid.scrollLeft = 0;
    updateCertArrows();
  }

  ScrollTrigger.refresh();
}

// Filter Portfolio
document.querySelectorAll('.portfolio-filter .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.portfolio-filter .filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    applyFilter(portfolioGrid, portfolioGrid.querySelectorAll('.portfolio-item'), btn.dataset.filter);
  });
});

// Filter Certificates
document.querySelectorAll('.certificates-filter .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.certificates-filter .filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    applyFilter(certGrid, certGrid.querySelectorAll('.certificate-item'), btn.dataset.filter);
  });
});

// Maintenance Popup
const maintenanceLinks = document.querySelectorAll('.maintenance-link');
const maintenancePopup = document.getElementById('maintenance-popup');
const closePopup = document.querySelectorAll('.close-popup');

maintenanceLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    maintenancePopup.style.display = 'flex';
  });
});

closePopup.forEach(btn => {
  btn.addEventListener('click', () => {
    maintenancePopup.style.display = 'none';
    comingSoonPopup.style.display = 'none';
    certificatePopup.style.display = 'none';
  });
});

maintenancePopup.addEventListener('click', (e) => {
  if (e.target === maintenancePopup) {
    maintenancePopup.style.display = 'none';
  }
});

// Coming Soon Popup
const comingSoonLinks = document.querySelectorAll('.coming-soon-link');
const comingSoonPopup = document.getElementById('coming-soon-popup');

comingSoonLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    comingSoonPopup.style.display = 'flex';
  });
});

comingSoonPopup.addEventListener('click', (e) => {
  if (e.target === comingSoonPopup) {
    comingSoonPopup.style.display = 'none';
  }
});

// Certificate Preview Popup
const certificatePopup = document.getElementById('certificate-popup');
const certificatePreviewImg = document.getElementById('certificate-preview-img');

certificateItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const imgSrc = item.querySelector('.certificate-img').getAttribute('src');
    certificatePreviewImg.setAttribute('src', imgSrc);
    certificatePopup.style.display = 'flex';
  });
});

certificatePopup.addEventListener('click', (e) => {
  if (e.target === certificatePopup) {
    certificatePopup.style.display = 'none';
  }
});

// Debugging lebar item
document.querySelectorAll('.portfolio-item, .certificate-item').forEach(item => {
  item.addEventListener('mouseover', () => {
    console.log(`${item.className} width on hover:`, item.getBoundingClientRect().width);
  });
  item.addEventListener('mouseout', () => {
    console.log(`${item.className} width on mouseout:`, item.getBoundingClientRect().width);
  });
});