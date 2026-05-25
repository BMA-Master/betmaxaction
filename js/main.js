// Hamburger Menu Toggle - SIMPLIFIED VERSION
let menuOpen = false;

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const drawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-overlay');

    menuOpen = !menuOpen;

    if (menuOpen) {
        hamburger.classList.add('active');
        drawer.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        hamburger.classList.remove('active');
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeMenu() {
    const hamburger = document.getElementById('hamburger-menu');
    const drawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-overlay');

    menuOpen = false;
    if (hamburger) hamburger.classList.remove('active');
    if (drawer) {
        drawer.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
    }
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't close if clicking on dropdown parent
            if (!this.textContent.includes('▼')) {
                closeMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });

    // Mega menu (click to toggle on mobile, outside-click + Esc to close)
    const megaMenu = document.querySelector('.mega-menu');
    if (megaMenu) {
        const trigger = megaMenu.querySelector('.mega-menu-trigger');

        if (trigger) {
            trigger.addEventListener('click', function(e) {
                // On narrow screens (mobile drawer): toggle the panel inline.
                // On desktop: let the link navigate to /knowledge-base/ but also allow click-to-pin.
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    megaMenu.classList.toggle('is-open');
                    trigger.setAttribute('aria-expanded', megaMenu.classList.contains('is-open') ? 'true' : 'false');
                }
            });
        }

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!megaMenu.contains(e.target)) {
                megaMenu.classList.remove('is-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                megaMenu.classList.remove('is-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

let currentTab = 'general';
let currentGameTab = 'tournament';

function switchGameTab(gameTabName) {
    // Remove active from all game tabs and content
    document.querySelectorAll('.game-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.game-content').forEach(content => content.classList.remove('active'));

    // Add active to selected game tab and content
    document.querySelector(`[onclick="switchGameTab('${gameTabName}')"]`).classList.add('active');
    document.getElementById(`${gameTabName}-content`).classList.add('active');

    currentGameTab = gameTabName;
}

let __popupScrollY = 0;

function openContactPopup(tab = 'general') {
    const popup = document.getElementById('contactPopup');
    if (!popup) return false;

    popup.classList.add('active');

    // Robust scroll lock: save scroll position and pin body in place.
    __popupScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${__popupScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';

    switchTab(tab);

    return false;
}

function closeContactPopup() {
    document.getElementById('contactPopup').classList.remove('active');

    // Restore scroll lock + scroll position.
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, __popupScrollY);
}

// Vertical details data
const verticalData = {
    leagues: {
        title: 'Leagues & Teams',
        items: [
            'Professional Leagues & Teams',
            'Collegiate Athletics',
            'Amateur Sports Associations',
            'Fantasy Sports Platforms',
            'eSports Organizations',
            'Youth Sports Organizations'
        ]
    },
    entertainment: {
        title: 'Entertainment Venues',
        items: [
            'Entertainment Venues & Arenas',
            'Music & Live Events',
            'Festivals & Cultural Events',
            'Hospitality & Travel Partners',
            'Retail & Point-of-Sale Integrations',
            'Theme Parks & Attractions'
        ]
    },
    casinos: {
        title: 'Casinos & iGaming',
        items: [
            'Casinos & iGaming Operators',
            'Online Sportsbooks',
            'Daily Fantasy Operators',
            'Lottery & Sweepstakes Providers',
            'Payment & Fintech Partners',
            'Gaming Technology Providers'
        ]
    },
    esports: {
        title: 'eSports',
        items: [
            'eSports Organizations',
            'Gaming Communities',
            'Streaming Platforms',
            'Technology Providers',
            'Data & Analytics Firms',
            'Tournament Organizers'
        ]
    },
    media: {
        title: 'Media Partners',
        items: [
            'Broadcasters & Media Networks',
            'Streaming Platforms',
            'Social Platforms & Communities',
            'Brand Sponsors & Advertisers',
            'Consumer Products & Merchandising',
            'Digital Media Publishers'
        ]
    }
};

let currentVertical = null;

function showVerticalDetails(vertical) {
    const detailsContainer = document.getElementById('vertical-details');
    const titleElement = document.getElementById('details-title');
    const listElement = document.getElementById('details-list');

    // If clicking the same vertical, close it
    if (currentVertical === vertical && detailsContainer.classList.contains('show')) {
        closeVerticalDetails();
        return;
    }

    // Update content
    const data = verticalData[vertical];
    titleElement.textContent = data.title;
    listElement.innerHTML = data.items.map(item => `<li>${item}</li>`).join('');

    // Show the container
    detailsContainer.classList.add('show');
    currentVertical = vertical;

    // Highlight the selected card
    document.querySelectorAll('.vertical-card').forEach(card => {
        card.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Scroll to details container on mobile and tablet
    setTimeout(() => {
        if (window.innerWidth <= 1024) {
            detailsContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100); // Small delay to allow the container to render
}

function closeVerticalDetails() {
    const detailsContainer = document.getElementById('vertical-details');
    detailsContainer.classList.remove('show');
    currentVertical = null;

    // Remove active state from all cards
    document.querySelectorAll('.vertical-card').forEach(card => {
        card.classList.remove('active');
    });
}

function switchTab(tabName) {
    // Remove active from all tabs and content
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active to selected tab button
    const tabButton = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (tabButton) {
        tabButton.classList.add('active');
    }

    // Add active to selected tab content
    const tabContent = document.getElementById(`${tabName}-tab`);
    if (tabContent) {
        tabContent.classList.add('active');
    }

    currentTab = tabName;
}

function handleFormSubmit(event, formType) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.formType = formType;

    // Show success message
    alert(`Thank you for your ${formType} inquiry! We'll get back to you within 24 hours.`);

    // Reset form and close popup
    event.target.reset();
    closeContactPopup();

    // Here you would typically send the data to your server
    console.log('Form submitted:', data);
}

// Close popup when clicking outside and on Escape key
document.addEventListener('DOMContentLoaded', function() {
    const contactPopup = document.getElementById('contactPopup');

    if (contactPopup) {
        // Close popup when clicking outside
        contactPopup.addEventListener('click', function(e) {
            if (e.target === this) {
                closeContactPopup();
            }
        });
    }

    // Close popup on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeContactPopup();
        }
    });
});

// Hero word rotator — types on/off through a list of words
function initHeroRotator() {
    const el = document.getElementById('heroRotator');
    if (!el) return;

    // Respect reduced-motion preference: leave first word static
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const words = ['Scale', 'Engage', 'Go Viral', 'Retain', 'Compete', 'Grow Loyalty'];
    let wordIdx = 0;
    let charIdx = words[0].length;
    let isDeleting = false;

    const typeSpeed = 90;
    const deleteSpeed = 45;
    const pauseAfterWord = 1800;
    const pauseAfterDelete = 250;
    const initialDelay = 2200;

    function tick() {
        const word = words[wordIdx];
        if (isDeleting) {
            charIdx--;
            el.textContent = word.slice(0, charIdx);
            if (charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                setTimeout(tick, pauseAfterDelete);
            } else {
                setTimeout(tick, deleteSpeed);
            }
        } else {
            charIdx++;
            el.textContent = word.slice(0, charIdx);
            if (charIdx === word.length) {
                isDeleting = true;
                setTimeout(tick, pauseAfterWord);
            } else {
                setTimeout(tick, typeSpeed);
            }
        }
    }

    // Start by erasing the initial "Scale" then cycle
    setTimeout(function () {
        isDeleting = true;
        tick();
    }, initialDelay);
}

document.addEventListener('DOMContentLoaded', initHeroRotator);

// Industries tab switcher (Partnership section)
function initIndustriesTabs() {
    const tabs = document.querySelectorAll('.industries-tab');
    const panels = document.querySelectorAll('.industries-panel');
    if (tabs.length === 0 || panels.length === 0) return;

    function activate(industry) {
        tabs.forEach(t => {
            const isActive = t.dataset.industry === industry;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        panels.forEach(p => {
            const isActive = p.dataset.industry === industry;
            if (isActive) {
                p.removeAttribute('hidden');
                p.classList.add('active');
            } else {
                p.setAttribute('hidden', '');
                p.classList.remove('active');
            }
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const industry = this.dataset.industry;
            activate(industry);

            // Scroll the active tab into view within its scroller
            const scroller = this.closest('[data-industries-tabs-scroller]');
            if (scroller) {
                const tabRect = this.getBoundingClientRect();
                const scrollerRect = scroller.getBoundingClientRect();
                const offset = tabRect.left - scrollerRect.left - (scrollerRect.width / 2) + (tabRect.width / 2);
                scroller.scrollBy({ left: offset, behavior: 'smooth' });
            }
        });
    });

    // Rail arrows (desktop)
    const railWrap = document.querySelector('[data-industries-rail]');
    if (railWrap) {
        const scroller = railWrap.querySelector('[data-industries-tabs-scroller]');
        const arrows = railWrap.querySelectorAll('[data-industries-rail-arrow]');

        function updateOverflow() {
            if (!scroller) return;
            const overflowing = scroller.scrollWidth > scroller.clientWidth + 2;
            railWrap.classList.toggle('is-overflowing', overflowing);
        }

        arrows.forEach(arrow => {
            arrow.addEventListener('click', function () {
                if (!scroller) return;
                const direction = this.dataset.industriesRailArrow === 'next' ? 1 : -1;
                scroller.scrollBy({ left: direction * scroller.clientWidth * 0.7, behavior: 'smooth' });
            });
        });

        updateOverflow();
        window.addEventListener('resize', updateOverflow);
    }
}

document.addEventListener('DOMContentLoaded', initIndustriesTabs);

// Intersection Observer for league logo animations
document.addEventListener('DOMContentLoaded', function() {
    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the fade-in class to trigger animation
                entry.target.classList.add('fade-in');
                // Stop observing this element
                logoObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all league logos
    document.querySelectorAll('.league-logo').forEach(logo => {
        // Remove the fade-in class initially
        logo.classList.remove('fade-in');
        logoObserver.observe(logo);
    });

});

// Game modes badge stagger reveal on scroll into view
document.addEventListener('DOMContentLoaded', function() {
    const grid = document.querySelector('.game-modes-grid');
    if (!grid || !('IntersectionObserver' in window)) return;

    grid.querySelectorAll('.game-mode').forEach((mode, i) => {
        mode.style.setProperty('--i', i);
    });
    grid.classList.add('stagger-ready');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -80px 0px'
    });

    observer.observe(grid);
});

// Entry Tab Switching (for Tournament Entry Points section)
function switchEntryTab(tabName) {
    // Remove active class from all tab buttons
    document.querySelectorAll('.entry-tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Remove active class from all tab content
    document.querySelectorAll('.entry-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to clicked button
    const activeButton = document.querySelector(`.entry-tab-button[onclick="switchEntryTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Add active class to corresponding content
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// Screenshot Carousel functionality
class ScreenshotCarousel {
    constructor(element) {
        this.container = element;
        this.slides = element.querySelectorAll('.carousel-slide');
        this.currentIndex = 0;
        this.prevBtn = element.querySelector('.carousel-nav.prev');
        this.nextBtn = element.querySelector('.carousel-nav.next');
        this.indicators = element.querySelectorAll('.indicator');

        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        // Show first slide
        this.showSlide(0);

        // Hide nav buttons if only one slide
        if (this.slides.length <= 1) {
            if (this.prevBtn) this.prevBtn.classList.add('hidden');
            if (this.nextBtn) this.nextBtn.classList.add('hidden');
            this.indicators.forEach(ind => ind.style.display = 'none');
            return;
        }

        // Bind navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        }

        // Bind indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSlide(index);
            });
        });

        // Click on slide to open lightbox
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                const images = Array.from(this.slides).map(s => ({
                    src: s.src,
                    alt: s.alt
                }));
                window.lightbox.open(images, index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.querySelector('.carousel-slide.active')) {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
    }

    showSlide(index) {
        // Remove active from all
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(ind => ind.classList.remove('active'));

        // Add active to current
        this.currentIndex = index;
        this.slides[this.currentIndex].classList.add('active');
        if (this.indicators[this.currentIndex]) {
            this.indicators[this.currentIndex].classList.add('active');
        }
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
}

// Lightbox functionality
class Lightbox {
    constructor() {
        this.overlay = null;
        this.image = null;
        this.closeBtn = null;
        this.prevBtn = null;
        this.nextBtn = null;
        this.currentImages = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        // Check if lightbox exists, create if not
        this.overlay = document.getElementById('lightbox');
        if (!this.overlay) {
            this.createLightbox();
        }

        this.image = this.overlay.querySelector('.lightbox-image');
        this.closeBtn = this.overlay.querySelector('.lightbox-close');
        this.prevBtn = this.overlay.querySelector('.lightbox-nav.prev');
        this.nextBtn = this.overlay.querySelector('.lightbox-nav.next');

        // Bind close button
        this.closeBtn.addEventListener('click', () => this.close());

        // Bind navigation
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prev();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.next();
            });
        }

        // Click outside image to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.overlay.classList.contains('active')) {
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
    }

    createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <button class="lightbox-close">&times;</button>
            <button class="lightbox-nav prev">&lsaquo;</button>
            <img src="" alt="" class="lightbox-image">
            <button class="lightbox-nav next">&rsaquo;</button>
        `;
        document.body.appendChild(lightbox);
        this.overlay = lightbox;
    }

    open(images, startIndex = 0) {
        this.currentImages = images;
        this.currentIndex = startIndex;
        this.showImage(this.currentIndex);
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll

        // Hide nav buttons if only one image
        if (images.length <= 1) {
            if (this.prevBtn) this.prevBtn.classList.add('hidden');
            if (this.nextBtn) this.nextBtn.classList.add('hidden');
        } else {
            if (this.prevBtn) this.prevBtn.classList.remove('hidden');
            if (this.nextBtn) this.nextBtn.classList.remove('hidden');
        }
    }

    close() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore body scroll
    }

    showImage(index) {
        this.currentIndex = index;
        const imageData = this.currentImages[this.currentIndex];
        this.image.src = imageData.src;
        this.image.alt = imageData.alt;
    }

    next() {
        if (this.currentImages.length <= 1) return;
        const nextIndex = (this.currentIndex + 1) % this.currentImages.length;
        this.showImage(nextIndex);
    }

    prev() {
        if (this.currentImages.length <= 1) return;
        const prevIndex = (this.currentIndex - 1 + this.currentImages.length) % this.currentImages.length;
        this.showImage(prevIndex);
    }
}

// Initialize carousels and lightbox on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lightbox (global)
    window.lightbox = new Lightbox();

    // Initialize all carousels
    document.querySelectorAll('.screenshot-carousel').forEach(carousel => {
        new ScreenshotCarousel(carousel);
    });
});
