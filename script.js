/**
 * RAMAYAN INSTITUTE OF TRADING — NISCHCHIT LAKSHYA
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. THEME SWITCHER (DARK MODE <-> DAYLIGHT / LIGHT MODE)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('nischchit_lakshya_theme') || 'dark';

    // Apply initial theme
    document.documentElement.setAttribute('data-theme', storedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('nischchit_lakshya_theme', newTheme);
        });
    }

    /* ==========================================================================
       2. STICKY HEADER & FLOATING SCROLL TIMER
       ========================================================================== */
    const siteHeader = document.getElementById('site-header');
    const floatingTimer = document.getElementById('floating-timer');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        if (floatingTimer) {
            if (window.scrollY > 350) {
                floatingTimer.classList.add('active');
            } else {
                floatingTimer.classList.remove('active');
            }
        }
    });

    /* ==========================================================================
       3. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        // Close mobile drawer when a link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       4. FAQ ACCORDION INTERACTION
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isOpen = faqItem.classList.contains('active');

            // Close all open accordion items for single-open experience
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const btn = item.querySelector('.faq-question');
                if (btn) btn.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================================================
       5. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('visible'));
    }

    /* ==========================================================================
       6. FORM VALIDATION & SUBMISSION HANDLER
       ========================================================================== */
    const regForm = document.getElementById('registration-form');

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm()) {
                const formData = {
                    fullName: document.getElementById('fullName').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    tradingExperience: document.getElementById('tradingExperience').value,
                    learningGoal: document.getElementById('learningGoal').value,
                    contactMethod: document.querySelector('input[name="contactMethod"]:checked')?.value || 'WhatsApp',
                    consent: document.getElementById('consent').checked,
                    timestamp: new Date().toISOString()
                };

                // Show success state on button momentarily
                const submitBtn = regForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>PROCESSING...</span>';
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = '<span>REGISTRATION READY</span> ✓';
                    
                    // Call Isolated Payment Gateway Integration Function
                    proceedToPayment(formData);

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 600);
            }
        });

        // Clear inline errors on input
        const inputs = regForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearError(input.id);
            });
        });
    }

    function validateForm() {
        let isValid = true;

        // Clear all previous errors
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

        // Full Name Validation
        const fullName = document.getElementById('fullName');
        if (!fullName || !fullName.value.trim() || fullName.value.trim().length < 2) {
            showError('fullName', 'Please enter your full name (at least 2 characters).');
            isValid = false;
        }

        // Email Validation
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !email.value.trim() || !emailRegex.test(email.value.trim())) {
            showError('email', 'Please enter a valid email address.');
            isValid = false;
        }

        // Phone Validation (10 digits Indian phone check)
        const phone = document.getElementById('phone');
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phone ? phone.value.trim().replace(/[\s\-\+\(\)]/g, '') : '';
        if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
            showError('phone', 'Please enter a valid 10-digit mobile number.');
            isValid = false;
        }

        // Trading Experience Validation
        const tradingExperience = document.getElementById('tradingExperience');
        if (!tradingExperience || !tradingExperience.value) {
            showError('tradingExperience', 'Please select your trading experience level.');
            isValid = false;
        }

        // Learning Goal Validation
        const learningGoal = document.getElementById('learningGoal');
        if (!learningGoal || !learningGoal.value) {
            showError('learningGoal', 'Please select what you primary want to learn.');
            isValid = false;
        }

        // Consent Checkbox Validation
        const consent = document.getElementById('consent');
        if (!consent || !consent.checked) {
            showError('consent', 'You must agree to the terms and financial risk acknowledgment.');
            isValid = false;
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const errorEl = document.getElementById(`error-${fieldId}`);
        const inputEl = document.getElementById(fieldId);
        if (errorEl) errorEl.textContent = message;
        if (inputEl) inputEl.classList.add('invalid');
    }

    function clearError(fieldId) {
        const errorEl = document.getElementById(`error-${fieldId}`);
        const inputEl = document.getElementById(fieldId);
        if (errorEl) errorEl.textContent = '';
        if (inputEl) inputEl.classList.remove('invalid');
    }

    /* ==========================================================================
       6. LIVE COUNTDOWN TIMER (TARGET: UPCOMING MONDAY AT 10:00 AM)
       ========================================================================== */
    function initCountdownTimer() {
        function getTargetDate() {
            const now = new Date();
            const target = new Date(now);
            target.setHours(10, 0, 0, 0);

            const day = now.getDay(); // 0: Sun, 1: Mon, ..., 4: Thu, 5: Fri, 6: Sat
            let daysToAdd = (1 + 7 - day) % 7;

            // If today is Monday and past 10am, target next Monday
            if (day === 1 && now >= target) {
                daysToAdd = 7;
            } else if (daysToAdd === 0 && day !== 1) {
                daysToAdd = 7;
            }

            target.setDate(now.getDate() + daysToAdd);
            return target;
        }

        const targetDate = getTargetDate();

        function updateTimer() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance <= 0) {
                document.querySelectorAll('.timer-days').forEach(el => el.textContent = '00');
                document.querySelectorAll('.timer-hours').forEach(el => el.textContent = '00');
                document.querySelectorAll('.timer-minutes').forEach(el => el.textContent = '00');
                document.querySelectorAll('.timer-seconds').forEach(el => el.textContent = '00');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const pad = (n) => n < 10 ? '0' + n : n;

            document.querySelectorAll('.timer-days').forEach(el => el.textContent = pad(days));
            document.querySelectorAll('.timer-hours').forEach(el => el.textContent = pad(hours));
            document.querySelectorAll('.timer-minutes').forEach(el => el.textContent = pad(minutes));
            document.querySelectorAll('.timer-seconds').forEach(el => el.textContent = pad(seconds));
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    initCountdownTimer();

});

/* ==========================================================================
   7. PAYMENT GATEWAY HANDOFF STUB
   ========================================================================== */
/**
 * Isolated function called after frontend registration form validation succeeds.
 * Connect your Razorpay / Payment Gateway logic here.
 * 
 * @param {Object} formData Validated user registration details
 */
function proceedToPayment(formData) {
    console.log("==========================================");
    console.log("NISCHCHIT LAKSHYA — REGISTRATION SUCCESSFUL");
    console.log("Registration Data Ready For Payment Gateway:");
    console.dir(formData);
    console.log("==========================================");

    // RAZORPAY / PAYMENT INTEGRATION WILL BE ADDED HERE
}
