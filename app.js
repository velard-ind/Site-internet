// VELARD industry - Application JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const pages = document.querySelectorAll('.page');
    const contactForm = document.getElementById('contact-form');
    const ctaButtons = document.querySelectorAll('[data-page]');

    // Variables globales
    let currentPage = 'accueil';

    // Initialisation
    init();

    function init() {
        setupNavigation();
        setupMobileMenu();
        setupContactForm();
        setupCTAButtons();
        showPage(currentPage);
        updateActiveNavLink(currentPage);
    }

    // Configuration de la navigation
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                
                if (targetPage) {
                    showPage(targetPage);
                    updateActiveNavLink(targetPage);
                    
                    // Fermer le menu mobile si ouvert
                    if (navMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                    
                    // Scroll vers le haut
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        // Liens du footer
        const footerLinks = document.querySelectorAll('.footer__links a[data-page]');
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                
                if (targetPage) {
                    showPage(targetPage);
                    updateActiveNavLink(targetPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    // Configuration du menu mobile
    function setupMobileMenu() {
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });

        // Fermer le menu avec la touche Échap
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    // Configuration du formulaire de contact
    function setupContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleContactFormSubmission();
            });
        }
    }

    // Configuration des boutons CTA
    function setupCTAButtons() {
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const targetPage = this.getAttribute('data-page');
                
                if (targetPage) {
                    e.preventDefault();
                    showPage(targetPage);
                    updateActiveNavLink(targetPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    // Afficher une page spécifique
    function showPage(pageId) {
        // Masquer toutes les pages
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Afficher la page demandée
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageId;
            
            // Mettre à jour le titre de la page
            updatePageTitle(pageId);
            
            // Analytics ou tracking (simulation)
            trackPageView(pageId);

            if (pageId === 'contact') {
                window.requestAnimationFrame(function() {
                    initWorldMap();
                });
            }
        }
    }

    // Mettre à jour le lien de navigation actif
    function updateActiveNavLink(pageId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }

    // Basculer l'affichage du menu mobile
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        
        // Changer l'icône du bouton
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }

        // Prévenir le scroll du body quand le menu est ouvert
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Gestion de la soumission du formulaire de contact
    function handleContactFormSubmission() {
        // Récupération des données du formulaire
        const formData = new FormData(contactForm);
        const data = {
            company: formData.get('company'),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            sector: formData.get('sector'),
            service: formData.get('service'),
            message: formData.get('message')
        };

        // Validation basique
        if (!data.company || !data.name || !data.email || !data.message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Veuillez saisir une adresse email valide.', 'error');
            return;
        }

        if (formData.get('_honey')) {
            showNotification('Votre demande a été envoyée à contact@velardindustry.com. Nous vous recontacterons rapidement.', 'success');
            contactForm.reset();
            return;
        }

        sendQuoteRequest(data);
    }

    function sendQuoteRequest(data) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Envoi en cours...';
        submitButton.disabled = true;

        const sectorLabels = {
            spatial: 'Spatial',
            aeronautique: 'Aéronautique',
            defense: 'Défense',
            autre: 'Autre'
        };
        const serviceLabels = {
            'ac-dc': 'Conversion AC-DC',
            'dc-dc': 'Conversion DC-DC',
            etudes: 'Études et conception',
            tests: 'Tests et validation',
            support: 'Support technique'
        };

        const payload = {
            _subject: 'Demande de devis — VELARD industry',
            _template: 'table',
            _captcha: 'false',
            _replyto: data.email,
            Entreprise: data.company,
            Nom: data.name,
            Email: data.email,
            Telephone: data.phone || 'Non renseigné',
            Secteur: sectorLabels[data.sector] || 'Non renseigné',
            Service: serviceLabels[data.service] || 'Non renseigné',
            Message: data.message
        };

        fetch('https://formsubmit.co/ajax/contact@velardindustry.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(function(response) {
                return response.json().then(function(result) {
                    if (!response.ok) {
                        throw new Error('send-failed');
                    }
                    return result;
                });
            })
            .then(function(result) {
                if (result && result.success === false) {
                    throw new Error('send-failed');
                }
                showNotification('Votre demande a été envoyée à contact@velardindustry.com. Nous vous recontacterons rapidement.', 'success');
                contactForm.reset();
            })
            .catch(function() {
                const subject = encodeURIComponent('Demande de devis — VELARD industry');
                const body = encodeURIComponent(
                    'Entreprise : ' + data.company + '\n' +
                    'Nom : ' + data.name + '\n' +
                    'Email : ' + data.email + '\n' +
                    'Téléphone : ' + (data.phone || 'Non renseigné') + '\n' +
                    'Secteur : ' + (sectorLabels[data.sector] || 'Non renseigné') + '\n' +
                    'Service : ' + (serviceLabels[data.service] || 'Non renseigné') + '\n\n' +
                    data.message
                );
                window.location.href = 'mailto:contact@velardindustry.com?subject=' + subject + '&body=' + body;
                showNotification('Ouverture de votre messagerie pour envoyer la demande à contact@velardindustry.com.', 'success');
            })
            .finally(function() {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
    }

    // Validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Affichage des notifications
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Créer la notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="notification__message">${message}</span>
            <button class="notification__close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Ajouter les styles inline pour la notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            zIndex: '9999',
            maxWidth: '400px',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '14px',
            lineHeight: '1.5',
            animation: 'slideInRight 0.3s ease-out'
        });

        // Styles selon le type
        if (type === 'success') {
            Object.assign(notification.style, {
                backgroundColor: 'rgba(54, 130, 174, 0.12)',
                color: '#102036',
                border: '1px solid rgba(54, 130, 174, 0.28)'
            });
        } else if (type === 'error') {
            Object.assign(notification.style, {
                backgroundColor: 'rgba(192, 21, 47, 0.1)',
                color: '#c0152f',
                border: '1px solid rgba(192, 21, 47, 0.2)'
            });
        }

        // Style du bouton de fermeture
        const closeButton = notification.querySelector('.notification__close');
        Object.assign(closeButton.style, {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            opacity: '0.7',
            transition: 'opacity 0.2s ease'
        });

        closeButton.onmouseover = () => closeButton.style.opacity = '1';
        closeButton.onmouseout = () => closeButton.style.opacity = '0.7';

        // Ajouter au DOM
        document.body.appendChild(notification);

        // Suppression automatique après 5 secondes
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Mettre à jour le titre de la page
    function updatePageTitle(pageId) {
        const titles = {
            'accueil': 'VELARD industry - Bureau d\'études conversion d\'énergie AC-DC et DC-DC',
            'apropos': 'À propos - VELARD industry',
            'services': 'Nos services - VELARD industry',
            'secteurs': 'Nos secteurs - VELARD industry',
            'contact': 'Contact - VELARD industry'
        };

        if (titles[pageId]) {
            document.title = titles[pageId];
        }
    }

    // Tracking des pages vues (simulation pour analytics)
    function trackPageView(pageId) {
        // Dans un vrai projet, ceci enverrait les données à Google Analytics ou autre
        console.log(`Page vue: ${pageId}`);
    }

    let worldMap;

    function initWorldMap() {
        const mapEl = document.getElementById('world-map');
        if (!mapEl || typeof L === 'undefined') {
            return;
        }

        if (worldMap) {
            worldMap.invalidateSize();
            return;
        }

        const mainIcon = L.divIcon({
            className: 'map-pin map-pin--main',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -10]
        });
        const presenceIcon = L.divIcon({
            className: 'map-pin map-pin--dot',
            iconSize: [9, 9],
            iconAnchor: [4, 4],
            popupAnchor: [0, -8]
        });

        const mainLocations = [
            { name: 'Île-de-France', coords: [48.8566, 2.3522] },
            { name: 'Saint-Étienne', coords: [45.4397, 4.3872] },
            { name: 'Tokyo', coords: [35.6762, 139.6503] },
            { name: 'Los Angeles', coords: [34.0522, -118.2437] },
            { name: 'New York', coords: [40.7128, -74.006] },
            { name: 'Berlin', coords: [52.52, 13.405] },
            { name: 'Londres', coords: [51.5074, -0.1278] },
            { name: 'Copenhague', coords: [55.6761, 12.5683] }
        ];

        const presenceLocations = [
            { name: 'Montréal', coords: [45.5017, -73.5673] },
            { name: 'Boston', coords: [42.3601, -71.0589] },
            { name: 'Mexico', coords: [19.4326, -99.1332] },
            { name: 'São Paulo', coords: [-23.5505, -46.6333] },
            { name: 'Santiago', coords: [-33.4489, -70.6693] },
            { name: 'Madrid', coords: [40.4168, -3.7038] },
            { name: 'Milan', coords: [45.4642, 9.19] },
            { name: 'Stockholm', coords: [59.3293, 18.0686] },
            { name: 'Dubaï', coords: [25.2048, 55.2708] },
            { name: 'Johannesburg', coords: [-26.2041, 28.0473] },
            { name: 'Nairobi', coords: [-1.2921, 36.8219] },
            { name: 'Mumbai', coords: [19.076, 72.8777] },
            { name: 'Singapour', coords: [1.3521, 103.8198] },
            { name: 'Séoul', coords: [37.5665, 126.978] },
            { name: 'Sydney', coords: [-33.8688, 151.2093] },
            { name: 'Vancouver', coords: [49.2827, -123.1207] }
        ];

        worldMap = L.map(mapEl, {
            worldCopyJump: true,
            minZoom: 2,
            maxZoom: 8,
            zoomControl: true,
            scrollWheelZoom: false
        }).setView([25, 12], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
            maxZoom: 8
        }).addTo(worldMap);

        worldMap.on('click', function() {
            worldMap.scrollWheelZoom.enable();
        });
        worldMap.on('mouseout', function() {
            worldMap.scrollWheelZoom.disable();
        });

        mainLocations.forEach(function(place) {
            L.marker(place.coords, { icon: mainIcon })
                .addTo(worldMap)
                .bindPopup('<div class="map-popup">' + place.name + '</div>');
        });

        presenceLocations.forEach(function(place) {
            L.marker(place.coords, { icon: presenceIcon, opacity: 0.9 })
                .addTo(worldMap)
                .bindPopup('<div class="map-popup">' + place.name + '</div>');
        });

        window.setTimeout(function() {
            worldMap.invalidateSize();
        }, 200);
    }

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Fermer le menu mobile si la fenêtre devient plus large
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        if (worldMap && currentPage === 'contact') {
            worldMap.invalidateSize();
        }
    });

    // Gestion du retour en arrière du navigateur
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            showPage(e.state.page);
            updateActiveNavLink(e.state.page);
        }
    });

    // Mise à jour de l'historique du navigateur
    function updateHistory(pageId) {
        const url = pageId === 'accueil' ? '/' : `#${pageId}`;
        history.pushState({ page: pageId }, '', url);
    }

    // Ajout des animations au scroll (intersection observer)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.6s ease-out';
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        const animatedElements = document.querySelectorAll('.card, .feature__item, .service__item');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Ajout des styles d'animation manquants
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification {
            transition: all 0.3s ease;
        }
        
        /* Smooth scroll pour les navigateurs qui ne le supportent pas nativement */
        html {
            scroll-behavior: smooth;
        }
        
        /* Animation pour les cartes au hover */
        .expertise__card:hover,
        .service__item:hover,
        .feature__item:hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Focus visible amélioré */
        .btn:focus-visible,
        .form-control:focus-visible,
        .nav__link:focus-visible {
            outline: 2px solid #3682ae;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);

    // Initialisation basée sur l'URL (si hash présent)
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
        showPage(hash);
        updateActiveNavLink(hash);
    }

    // Gestion des liens externes avec target="_blank"
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && e.target.href && e.target.href.startsWith('http')) {
            if (!e.target.target) {
                e.target.target = '_blank';
                e.target.rel = 'noopener noreferrer';
            }
        }
    });

    // Préchargement des pages pour une navigation plus fluide
    function preloadPages() {
        pages.forEach(page => {
            // Forcer un léger repaint pour optimiser les animations
            page.offsetHeight;
        });
    }

    // Appeler le préchargement après le chargement initial
    setTimeout(preloadPages, 1000);

    // Accessibility: gestion de la navigation au clavier
    document.addEventListener('keydown', function(e) {
        // Tab navigation améliorée
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Log pour confirmer que le script est chargé
    console.log('VELARD industry - Application initialisée avec succès');
});

// Fonctions utilitaires globales

// Formater les numéros de téléphone
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

// Valider les champs du formulaire en temps réel
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    switch(fieldName) {
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'phone':
            return value === '' || /^(\+33|0)[1-9](\d{8})$/.test(value.replace(/\s/g, ''));
        case 'company':
        case 'name':
        case 'message':
            return value.length > 0;
        default:
            return true;
    }
}

// Mise en forme automatique du téléphone
document.addEventListener('input', function(e) {
    if (e.target.name === 'phone') {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('33')) {
            value = '+' + value;
        } else if (value.length === 10 && value.startsWith('0')) {
            value = value;
        }
        e.target.value = formatPhoneNumber(value);
    }
});

// Export pour les tests (si nécessaire)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        formatPhoneNumber
    };
}