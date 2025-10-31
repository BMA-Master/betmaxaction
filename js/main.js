// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when overlay is clicked
    navOverlay.addEventListener('click', closeMenu);

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
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
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

function openContactPopup(tab = 'general') {
    const popup = document.getElementById('contactPopup');
    if (!popup) return false;

    popup.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Always switch to the specified tab
    switchTab(tab);

    return false;
}

function closeContactPopup() {
    document.getElementById('contactPopup').classList.remove('active');
    document.body.style.overflow = '';
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
