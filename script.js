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

        regForm.addEventListener('submit', async (e) => {

            e.preventDefault();

            // Validate form first
            if (!validateForm()) {
                return;
            }

            // Collect form data
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),

                email: document.getElementById('email').value.trim(),

                phone: document.getElementById('phone').value
                    .trim()
                    .replace(/[\s\-+()]/g, ''),

                tradingExperience:
                    document.getElementById('tradingExperience').value,

                learningGoal:
                    document.getElementById('learningGoal').value,

                contactMethod:
                    document.querySelector(
                        'input[name="contactMethod"]:checked'
                    )?.value || 'WhatsApp',

                consent:
                    document.getElementById('consent').checked,

                timestamp:
                    new Date().toISOString()
            };

            // Start Razorpay payment flow
            await proceedToPayment(formData);
        });


        // Clear inline errors on input/change
        const inputs = regForm.querySelectorAll('input, select');

        inputs.forEach(input => {

            input.addEventListener('input', () => {
                clearError(input.id);
            });

            input.addEventListener('change', () => {
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
       6. DYNAMIC WORKSHOP SCHEDULE & LIVE COUNTDOWN TIMER
       ==========================================================================
       Developers: To change the workshop schedule at any time, you can:
         1. Modify default values in WORKSHOP_CONFIG below, OR
         2. Call window.setWorkshopTime('08:09 PM') in code/console, OR
         3. Call window.setWorkshopTime({ day: 'Monday', time: '08:09 PM', timezone: 'IST' })
         
       All matching UI elements (Hero card, Floating pill, Details section)
       and the live countdown timer will automatically recalculate and update!
       ========================================================================== */

    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const WORKSHOP_CONFIG = {
        // Target recurring day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        dayOfWeek: 1,
        dayName: 'Monday',
        dayShort: 'Mon',

        // Workshop Start Time (supports '08:09 PM', '8:09 PM', '20:09', '10:00 AM')
        time: '08:09 PM',

        // Timezone label for display
        timezone: 'IST',

        // Optional: Specific fixed ISO date/time (e.g. '2026-09-21T20:09:00+05:30').
        // If null, it dynamically targets the upcoming recurring day & time.
        fixedDate: null,

        // Optional: Custom text for the workshop date card (e.g. 'Upcoming Batch' or '21 Sep 2026')
        dateDisplay: null,

        // Template for hero subtitle
        countdownSubtitleText: 'Next Live Batch Starts {day} at {time}'
    };

    /**
     * Parses 12-hour or 24-hour time string into structured hours/minutes and display format
     */
    function parseTimeString(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') {
            return { hours: 20, minutes: 9, display12: '08:09 PM', display24: '20:09' };
        }
        const trimmed = timeStr.trim();
        const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i);
        if (!match) {
            return { hours: 20, minutes: 9, display12: trimmed, display24: trimmed };
        }
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[4] ? match[4].toUpperCase() : null;

        if (ampm) {
            if (ampm === 'PM' && h < 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
        }

        const displayHours = h % 12 === 0 ? 12 : h % 12;
        const period = h >= 12 ? 'PM' : 'AM';
        const pad = (n) => String(n).padStart(2, '0');

        return {
            hours: h,
            minutes: m,
            display12: `${pad(displayHours)}:${pad(m)} ${period}`,
            display24: `${pad(h)}:${pad(m)}`
        };
    }

    /**
     * Parses day input (number 0-6 or string 'Monday', 'Mon', etc.)
     */
    function parseDay(dayInput) {
        if (typeof dayInput === 'number' && dayInput >= 0 && dayInput <= 6) {
            return {
                index: dayInput,
                name: DAYS[dayInput],
                short: DAYS_SHORT[dayInput]
            };
        }
        if (typeof dayInput === 'string') {
            const lower = dayInput.trim().toLowerCase();
            const foundIndex = DAYS.findIndex(d => d.toLowerCase().startsWith(lower.slice(0, 3)));
            if (foundIndex !== -1) {
                return {
                    index: foundIndex,
                    name: DAYS[foundIndex],
                    short: DAYS_SHORT[foundIndex]
                };
            }
        }
        return { index: 1, name: 'Monday', short: 'Mon' };
    }

    /**
     * Calculates the target Date object based on WORKSHOP_CONFIG
     */
    function getWorkshopTargetDate() {
        if (WORKSHOP_CONFIG.fixedDate) {
            const fixed = new Date(WORKSHOP_CONFIG.fixedDate);
            if (!isNaN(fixed.getTime())) {
                return fixed;
            }
        }

        const now = new Date();
        const target = new Date(now);
        const parsed = parseTimeString(WORKSHOP_CONFIG.time);
        target.setHours(parsed.hours, parsed.minutes, 0, 0);

        const targetDay = typeof WORKSHOP_CONFIG.dayOfWeek === 'number' ? WORKSHOP_CONFIG.dayOfWeek : 1;
        const currentDay = now.getDay();
        let daysToAdd = (targetDay - currentDay + 7) % 7;

        // If today is the scheduled day and the workshop time has already passed today, roll over to next week
        if (daysToAdd === 0 && now.getTime() >= target.getTime()) {
            daysToAdd = 7;
        }

        target.setDate(now.getDate() + daysToAdd);
        return target;
    }

    /**
     * Synchronously updates all workshop schedule text elements in the DOM
     */
    function updateWorkshopDisplay() {
        const parsedTime = parseTimeString(WORKSHOP_CONFIG.time);
        const dayInfo = parseDay(WORKSHOP_CONFIG.dayOfWeek);
        const displayTime = parsedTime.display12;
        const timezone = WORKSHOP_CONFIG.timezone || 'IST';

        // 1. Floating timer widget pill (e.g. "Mon 08:09 PM")
        const floatingTimeEls = document.querySelectorAll('#floating-timer-time, [data-workshop-floating-time], .floating-timer-widget .f-timer-head span');
        floatingTimeEls.forEach(el => {
            el.textContent = `${dayInfo.short} ${displayTime}`;
        });

        // 2. Hero countdown subtitle (e.g. "Next Live Batch Starts Monday at 08:09 PM")
        const subtitleEls = document.querySelectorAll('#hero-countdown-subtitle, [data-workshop-countdown-subtitle], .countdown-subtitle');
        const subtitleTpl = WORKSHOP_CONFIG.countdownSubtitleText || 'Next Live Batch Starts {day} at {time}';
        const formattedSubtitle = subtitleTpl
            .replace('{day}', dayInfo.name)
            .replace('{shortDay}', dayInfo.short)
            .replace('{time}', displayTime)
            .replace('{timezone}', timezone);

        subtitleEls.forEach(el => {
            el.textContent = formattedSubtitle;
        });

        // 3. Workshop detail TIME card (e.g. "08:09 PM IST")
        let timeCardFound = false;
        const detailTimeEls = document.querySelectorAll('#workshop-detail-time, [data-workshop-time]');
        if (detailTimeEls.length > 0) {
            detailTimeEls.forEach(el => {
                el.textContent = `${displayTime} ${timezone}`.trim();
            });
            timeCardFound = true;
        }

        if (!timeCardFound) {
            document.querySelectorAll('.detail-card').forEach(card => {
                const label = card.querySelector('.d-label');
                const value = card.querySelector('.d-value');
                if (label && label.textContent.trim().toUpperCase() === 'TIME' && value) {
                    value.textContent = `${displayTime} ${timezone}`.trim();
                }
            });
        }

        // 4. Workshop detail DATE card (if configured)
        if (WORKSHOP_CONFIG.dateDisplay) {
            const detailDateEls = document.querySelectorAll('#workshop-detail-date, [data-workshop-date]');
            detailDateEls.forEach(el => {
                el.textContent = WORKSHOP_CONFIG.dateDisplay;
            });
        }
    }

    let countdownTimerInterval = null;
    let currentTargetDate = null;

    function tickTimer() {
        if (!currentTargetDate) {
            currentTargetDate = getWorkshopTargetDate();
        }

        const now = new Date().getTime();
        let distance = currentTargetDate.getTime() - now;

        // Auto roll-over when target reached (unless a fixed one-off date was specified)
        if (distance <= 0 && !WORKSHOP_CONFIG.fixedDate) {
            currentTargetDate = getWorkshopTargetDate();
            distance = currentTargetDate.getTime() - now;
        }

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

    function initCountdownTimer() {
        currentTargetDate = getWorkshopTargetDate();
        tickTimer();
        if (countdownTimerInterval) clearInterval(countdownTimerInterval);
        countdownTimerInterval = setInterval(tickTimer, 1000);
    }

    /**
     * DEVELOPER API: Dynamically change workshop schedule and sync UI + timer immediately
     *
     * Usage Examples:
     *   setWorkshopTime('08:09 PM')
     *   setWorkshopTime('20:09')
     *   setWorkshopTime({ time: '07:30 PM', day: 'Saturday' })
     *   setWorkshopTime({ time: '10:00 AM', dayOfWeek: 1, timezone: 'IST' })
     *   setWorkshopTime({ fixedDate: '2026-10-01T18:00:00' })
     *
     * @param {string|Object} options New time string or config object
     */
    function setWorkshopTime(options) {
        if (typeof options === 'string') {
            WORKSHOP_CONFIG.time = options;
        } else if (typeof options === 'object' && options !== null) {
            if (options.time) WORKSHOP_CONFIG.time = options.time;
            if (options.day !== undefined) {
                const dayObj = parseDay(options.day);
                WORKSHOP_CONFIG.dayOfWeek = dayObj.index;
                WORKSHOP_CONFIG.dayName = dayObj.name;
                WORKSHOP_CONFIG.dayShort = dayObj.short;
            } else if (options.dayOfWeek !== undefined) {
                const dayObj = parseDay(options.dayOfWeek);
                WORKSHOP_CONFIG.dayOfWeek = dayObj.index;
                WORKSHOP_CONFIG.dayName = dayObj.name;
                WORKSHOP_CONFIG.dayShort = dayObj.short;
            }
            if (options.timezone !== undefined) WORKSHOP_CONFIG.timezone = options.timezone;
            if (options.fixedDate !== undefined) WORKSHOP_CONFIG.fixedDate = options.fixedDate;
            if (options.dateDisplay !== undefined) WORKSHOP_CONFIG.dateDisplay = options.dateDisplay;
            if (options.countdownSubtitleText !== undefined) WORKSHOP_CONFIG.countdownSubtitleText = options.countdownSubtitleText;
        }

        // Keep day names synchronized with dayOfWeek
        const activeDay = parseDay(WORKSHOP_CONFIG.dayOfWeek);
        WORKSHOP_CONFIG.dayName = activeDay.name;
        WORKSHOP_CONFIG.dayShort = activeDay.short;

        // Update UI text across page
        updateWorkshopDisplay();

        // Recalculate target date and tick countdown immediately
        currentTargetDate = getWorkshopTargetDate();
        tickTimer();

        console.log(`[Workshop Config] Updated to: ${WORKSHOP_CONFIG.dayName} at ${WORKSHOP_CONFIG.time} (${WORKSHOP_CONFIG.timezone})`);
        return {
            config: WORKSHOP_CONFIG,
            targetDate: currentTargetDate
        };
    }

    /**
     * Parses key-value pairs from workshoptime.md
     */
    function parseMarkdownConfig(markdownText) {
        const config = {};
        if (!markdownText) return config;
        const lines = markdownText.split(/\r?\n/);
        lines.forEach(line => {
            const clean = line.replace(/^[\s*\-#>]+/, '').trim();
            // Ignore numbered items e.g. "1. DATE"
            if (/^\d+\./.test(clean)) return;

            const colonIdx = clean.indexOf(':');
            if (colonIdx !== -1) {
                const rawKey = clean.substring(0, colonIdx).replace(/[^a-zA-Z0-9_]/g, '').trim().toUpperCase();
                let rawVal = clean.substring(colonIdx + 1).replace(/[*_`]/g, '').trim();
                rawVal = rawVal.replace(/^["']|["']$/g, '');
                if (rawKey && rawVal) {
                    config[rawKey] = rawVal;
                }
            }
        });
        return config;
    }

    /**
     * Applies markdown configuration values to WORKSHOP_CONFIG and updates the UI
     */
    function applyScheduleFromConfig(cfg) {
        if (!cfg) return;

        // 1. Workshop Time
        if (cfg.TIME) {
            WORKSHOP_CONFIG.time = cfg.TIME;
        }

        // 2. Timezone
        if (cfg.TIMEZONE) {
            WORKSHOP_CONFIG.timezone = cfg.TIMEZONE;
        }

        // 3. Custom Countdown Title Template
        if (cfg.COUNTDOWN_TITLE) {
            WORKSHOP_CONFIG.countdownSubtitleText = cfg.COUNTDOWN_TITLE;
        }

        // 4. Future Date Configuration
        if (cfg.DATE) {
            const dateMatch = cfg.DATE.trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
            if (dateMatch) {
                const year = parseInt(dateMatch[1], 10);
                const month = parseInt(dateMatch[2], 10) - 1;
                const day = parseInt(dateMatch[3], 10);
                const parsedTime = parseTimeString(WORKSHOP_CONFIG.time);

                const target = new Date(year, month, day, parsedTime.hours, parsedTime.minutes, 0, 0);
                WORKSHOP_CONFIG.fixedDate = target;
                WORKSHOP_CONFIG.dayOfWeek = target.getDay();
                const dayObj = parseDay(target.getDay());
                WORKSHOP_CONFIG.dayName = dayObj.name;
                WORKSHOP_CONFIG.dayShort = dayObj.short;
            } else {
                const d = new Date(cfg.DATE);
                if (!isNaN(d.getTime())) {
                    WORKSHOP_CONFIG.fixedDate = d;
                    WORKSHOP_CONFIG.dayOfWeek = d.getDay();
                    const dayObj = parseDay(d.getDay());
                    WORKSHOP_CONFIG.dayName = dayObj.name;
                    WORKSHOP_CONFIG.dayShort = dayObj.short;
                }
            }
        } else if (cfg.DAY) {
            const dayObj = parseDay(cfg.DAY);
            WORKSHOP_CONFIG.dayOfWeek = dayObj.index;
            WORKSHOP_CONFIG.dayName = dayObj.name;
            WORKSHOP_CONFIG.dayShort = dayObj.short;
        }

        // 5. Date Display Text on Card
        if (cfg.DATE_DISPLAY) {
            WORKSHOP_CONFIG.dateDisplay = cfg.DATE_DISPLAY;
        } else if (cfg.DATE && WORKSHOP_CONFIG.fixedDate) {
            const d = new Date(WORKSHOP_CONFIG.fixedDate);
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            WORKSHOP_CONFIG.dateDisplay = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }

        updateWorkshopDisplay();
        currentTargetDate = getWorkshopTargetDate();
        tickTimer();
    }

    /**
     * Asynchronously loads workshoptime.md and applies updates
     */
    async function loadWorkshopTimeFromMD() {
        try {
            const res = await fetch('workshoptime.md?t=' + Date.now());
            if (!res.ok) return;
            const mdText = await res.text();
            const cfg = parseMarkdownConfig(mdText);
            applyScheduleFromConfig(cfg);
            console.log('[Workshop Schedule] Loaded successfully from workshoptime.md:', cfg);
        } catch (err) {
            // Silently fall back to built-in WORKSHOP_CONFIG (e.g. if loaded over local file:// protocol)
            console.info('[Workshop Schedule] Using built-in schedule configuration.');
        }
    }

    // Expose globally so developers or other scripts can call it anytime
    window.setWorkshopTime = setWorkshopTime;
    window.WORKSHOP_CONFIG = WORKSHOP_CONFIG;
    window.loadWorkshopTimeFromMD = loadWorkshopTimeFromMD;

    // Initial render and timer startup
    updateWorkshopDisplay();
    initCountdownTimer();

    // Dynamically load schedule from workshoptime.md
    loadWorkshopTimeFromMD();

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
async function proceedToPayment(formData) {

    const submitBtn =
        document.getElementById('registration-form')?.querySelector('.btn-submit');

    if (!submitBtn) {
        console.error('Submit button not found.');
        return;
    }

    const originalHTML =
        submitBtn.innerHTML;

    try {

        // Disable button
        submitBtn.disabled = true;

        submitBtn.innerHTML =
            '<span>CREATING SECURE PAYMENT...</span>';


        /*
         * STEP 1
         * Ask Vercel serverless function
         * to create Razorpay Order
         */

        const response = await fetch(
            '/api/create-order',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(formData)
            }
        );


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                'Unable to create payment order.'
            );
        }


        console.log(
            'Razorpay order created:',
            result.order
        );


        /*
         * STEP 2
         * Open Razorpay Checkout
         */

        const options = {

            key: result.keyId,

            amount: result.order.amount,

            currency: result.order.currency,

            name: 'Nischchit Lakshya',

            description:
                '5-Day Trading Workshop',

            order_id:
                result.order.id,


            /*
             * Prefill customer details
             */

            prefill: {

                name:
                    formData.fullName,

                email:
                    formData.email,

                contact:
                    formData.phone
            },


            /*
             * Additional information
             */

            notes: {

                tradingExperience:
                    formData.tradingExperience,

                learningGoal:
                    formData.learningGoal,

                contactMethod:
                    formData.contactMethod
            },


            theme: {

                color: '#D4AF37'
            },


            /*
             * STEP 3
             * Successful Razorpay Checkout
             */

            handler: async function (
                paymentResponse
            ) {

                console.log(
                    'Razorpay response:',
                    paymentResponse
                );

                await verifyRazorpayPayment(
                    paymentResponse,
                    formData
                );
            },


            /*
             * User closes Razorpay window
             */

            modal: {

                ondismiss: function () {

                    console.log(
                        'Razorpay checkout closed by user.'
                    );

                    submitBtn.disabled = false;

                    submitBtn.innerHTML =
                        originalHTML;
                }
            }
        };


        const razorpay =
            new Razorpay(options);


        /*
         * Razorpay payment failure event
         */

        razorpay.on(
            'payment.failed',
            function (response) {

                console.error(
                    'Razorpay payment failed:',
                    response.error
                );

                submitBtn.disabled = false;

                submitBtn.innerHTML =
                    originalHTML;

                const message =
                    response.error?.description ||
                    'Payment failed. Please try again.';

                alert(message);
            }
        );


        /*
         * Open Razorpay
         */

        razorpay.open();


    } catch (error) {

        console.error(
            'Payment initialization error:',
            error
        );

        submitBtn.disabled = false;

        submitBtn.innerHTML =
            originalHTML;

        alert(
            error.message ||
            'Unable to start payment. Please try again.'
        );
    }
}
async function verifyRazorpayPayment(
    paymentResponse,
    formData
) {

    const submitBtn =
        document.getElementById('registration-form')?.querySelector('.btn-submit');

    try {

        if (submitBtn) {

            submitBtn.disabled = true;

            submitBtn.innerHTML =
                '<span>VERIFYING PAYMENT...</span>';
        }


        /*
         * Send Razorpay response to Vercel
         */

        const response = await fetch(
            '/api/verify-payment',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({

                    razorpay_order_id:
                        paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                        paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                        paymentResponse.razorpay_signature
                })
            }
        );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success ||
            !result.verified
        ) {

            throw new Error(
                result.message ||
                'Payment verification failed.'
            );
        }


        console.log(
            'Payment successfully verified:',
            result
        );


        /*
         * Store registration information temporarily.
         *
         * Later we can replace this with Supabase/database storage.
         */

        const registrationData = {

            ...formData,

            orderId:
                result.orderId,

            paymentId:
                result.paymentId,

            paymentStatus:
                'PAID',

            paidAt:
                new Date().toISOString()
        };


        sessionStorage.setItem(
            'nischchitLakshyaRegistration',
            JSON.stringify(registrationData)
        );


        /*
         * Payment successful
         */

        window.location.href =
            '/thank-you.html';


    } catch (error) {

        console.error(
            'Payment verification error:',
            error
        );

        if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.innerHTML =
                '<span>PAYMENT VERIFICATION FAILED</span>';
        }


        alert(
            'We could not verify your payment automatically. ' +
            'Please do not make another payment immediately. ' +
            'Please contact support with your Payment ID.'
        );
    }
}