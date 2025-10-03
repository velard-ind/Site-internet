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

        // Simulation de l'envoi (dans un vrai projet, ceci ferait appel à un backend)
        simulateFormSubmission(data);
    }

    // Simulation de l'envoi du formulaire
    function simulateFormSubmission(data) {
        // Afficher un indicateur de chargement
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Envoi en cours...';
        submitButton.disabled = true;

        // Simuler un délai d'envoi
        setTimeout(() => {
            // Réinitialiser le bouton
            submitButton.textContent = originalText;
            submitButton.disabled = false;

            // Afficher un message de succès
            showNotification('Votre demande a été envoyée avec succès ! Nous vous recontacterons rapidement.', 'success');
            
            // Réinitialiser le formulaire
            contactForm.reset();
            
            // Log des données pour démonstration (à supprimer en production)
            console.log('Données du formulaire:', data);
            
        }, 2000);
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
                backgroundColor: 'rgba(33, 128, 141, 0.1)',
                color: '#218085',
                border: '1px solid rgba(33, 128, 141, 0.2)'
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

    // Gestion du redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        // Fermer le menu mobile si la fenêtre devient plus large
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMobileMenu();
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
            outline: 2px solid #3182ce;
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