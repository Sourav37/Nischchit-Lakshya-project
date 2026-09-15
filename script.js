/*
 * ============================================================================
 * RAMAYAN INSTITUTE OF TRADING — NISCHCHIT LAKSHYA
 * Interactive JavaScript Engine
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. THEME SWITCHER
       ========================================================================= */

    const themeToggleBtn = document.getElementById('theme-toggle');

    const storedTheme =
        localStorage.getItem('nischchit_lakshya_theme') || 'dark';

    document.documentElement.setAttribute('data-theme', storedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme =
                document.documentElement.getAttribute('data-theme');

            const newTheme =
                currentTheme === 'light' ? 'dark' : 'light';

            document.documentElement.setAttribute(
                'data-theme',
                newTheme
            );

            localStorage.setItem(
                'nischchit_lakshya_theme',
                newTheme
            );
        });
    }


    /* =========================================================================
       2. STICKY HEADER & FLOATING SCROLL TIMER
       ========================================================================= */

    const siteHeader =
        document.getElementById('site-header');

    const floatingTimer =
        document.getElementById('floating-timer');

    window.addEventListener('scroll', () => {

        if (siteHeader) {
            if (window.scrollY > 40) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }

        if (floatingTimer) {
            if (window.scrollY > 350) {
                floatingTimer.classList.add('active');
            } else {
                floatingTimer.classList.remove('active');
            }
        }

    });


    /* =========================================================================
       3. MOBILE NAVIGATION DRAWER
       ========================================================================= */

    const hamburgerBtn =
        document.getElementById('hamburger-btn');

    const mobileNav =
        document.getElementById('mobile-nav');

    if (hamburgerBtn && mobileNav) {

        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        const mobileLinks =
            mobileNav.querySelectorAll('a');

        mobileLinks.forEach(link => {

            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });

        });
    }


    /* =========================================================================
       4. FAQ ACCORDION
       ========================================================================= */

    const faqQuestions =
        document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {

        question.addEventListener('click', () => {

            const faqItem =
                question.parentElement;

            if (!faqItem) return;

            const isOpen =
                faqItem.classList.contains('active');

            document
                .querySelectorAll('.faq-item')
                .forEach(item => {

                    item.classList.remove('active');

                    const btn =
                        item.querySelector('.faq-question');

                    if (btn) {
                        btn.setAttribute(
                            'aria-expanded',
                            'false'
                        );
                    }

                });

            if (!isOpen) {

                faqItem.classList.add('active');

                question.setAttribute(
                    'aria-expanded',
                    'true'
                );

            }

        });

    });


    /* =========================================================================
       5. SCROLL REVEAL ANIMATIONS
       ========================================================================= */

    const revealElements =
        document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                'visible'
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.15,
                    rootMargin: '0px 0px -50px 0px'
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add('visible');
        });

    }


    /* =========================================================================
       6. FORM VALIDATION & SUBMISSION
       ========================================================================= */

    const regForm =
        document.getElementById('registration-form');

    if (regForm) {

        regForm.addEventListener(
            'submit',
            async event => {

                event.preventDefault();

                if (!validateForm()) {
                    return;
                }

                const phoneInput =
                    document.getElementById('phone');

                const formData = {

                    fullName:
                        document
                            .getElementById('fullName')
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById('email')
                            .value
                            .trim(),

                    phone:
                        phoneInput
                            ? phoneInput.value
                                .trim()
                                .replace(/[\s\-+()]/g, '')
                            : '',

                    tradingExperience:
                        document
                            .getElementById(
                                'tradingExperience'
                            )
                            .value,

                    learningGoal:
                        document
                            .getElementById(
                                'learningGoal'
                            )
                            .value,

                    contactMethod:
                        document.querySelector(
                            'input[name="contactMethod"]:checked'
                        )?.value || 'WhatsApp',

                    consent:
                        document
                            .getElementById('consent')
                            .checked,

                    timestamp:
                        new Date().toISOString()
                };

                await proceedToPayment(formData);

            }
        );


        /* ---------------------------------------------------------------------
           Clear validation errors while typing/changing
           --------------------------------------------------------------------- */

        const inputs =
            regForm.querySelectorAll(
                'input, select'
            );

        inputs.forEach(input => {

            /* Skip inputs that have no id (e.g. radio buttons) */
            if (!input.id) return;

            input.addEventListener(
                'input',
                () => {
                    clearError(input.id);
                }
            );

            input.addEventListener(
                'change',
                () => {
                    clearError(input.id);
                }
            );

        });

        /* Handle contactMethod radio group separately by name */
        regForm
            .querySelectorAll('input[name="contactMethod"]')
            .forEach(radio => {
                radio.addEventListener('change', () => {
                    clearError('contactMethod');
                });
            });

    }


    /* =========================================================================
       FORM VALIDATION
       ========================================================================= */

    function validateForm() {

        let isValid = true;

        document
            .querySelectorAll('.error-msg')
            .forEach(element => {
                element.textContent = '';
            });

        document
            .querySelectorAll('.invalid')
            .forEach(element => {
                element.classList.remove('invalid');
            });


        /* ---------------------------------------------------------------------
           Full Name
           --------------------------------------------------------------------- */

        const fullName =
            document.getElementById('fullName');

        if (
            !fullName ||
            !fullName.value.trim() ||
            fullName.value.trim().length < 2
        ) {

            showError(
                'fullName',
                'Please enter your full name (at least 2 characters).'
            );

            isValid = false;
        }


        /* ---------------------------------------------------------------------
           Email
           --------------------------------------------------------------------- */

        const email =
            document.getElementById('email');

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !email ||
            !email.value.trim() ||
            !emailRegex.test(
                email.value.trim()
            )
        ) {

            showError(
                'email',
                'Please enter a valid email address.'
            );

            isValid = false;
        }


        /* ---------------------------------------------------------------------
           Indian Mobile Number
           --------------------------------------------------------------------- */

        const phone =
            document.getElementById('phone');

        const phoneRegex =
            /^[6-9]\d{9}$/;

        const cleanPhone =
            phone
                ? phone.value
                    .trim()
                    .replace(/[\s\-+()]/g, '')
                : '';

        if (
            !cleanPhone ||
            !phoneRegex.test(cleanPhone)
        ) {

            showError(
                'phone',
                'Please enter a valid 10-digit mobile number.'
            );

            isValid = false;
        }


        /* ---------------------------------------------------------------------
           Trading Experience
           --------------------------------------------------------------------- */

        const tradingExperience =
            document.getElementById(
                'tradingExperience'
            );

        if (
            !tradingExperience ||
            !tradingExperience.value
        ) {

            showError(
                'tradingExperience',
                'Please select your trading experience level.'
            );

            isValid = false;
        }


        /* ---------------------------------------------------------------------
           Learning Goal
           --------------------------------------------------------------------- */

        const learningGoal =
            document.getElementById(
                'learningGoal'
            );

        if (
            !learningGoal ||
            !learningGoal.value
        ) {

            showError(
                'learningGoal',
                'Please select what you primarily want to learn.'
            );

            isValid = false;
        }


        /* ---------------------------------------------------------------------
           Consent
           --------------------------------------------------------------------- */

        const consent =
            document.getElementById('consent');

        if (
            !consent ||
            !consent.checked
        ) {

            showError(
                'consent',
                'You must agree to the terms and financial risk acknowledgment.'
            );

            isValid = false;
        }

        return isValid;
    }


    /* =========================================================================
       VALIDATION ERROR HELPERS
       ========================================================================= */

    function showError(fieldId, message) {

        const errorEl =
            document.getElementById(
                `error-${fieldId}`
            );

        const inputEl =
            document.getElementById(fieldId);

        if (errorEl) {
            errorEl.textContent = message;
        }

        if (inputEl) {
            inputEl.classList.add('invalid');
        }

    }


    function clearError(fieldId) {

        if (!fieldId) return;

        const errorEl =
            document.getElementById(
                `error-${fieldId}`
            );

        const inputEl =
            document.getElementById(fieldId);

        if (errorEl) {
            errorEl.textContent = '';
        }

        if (inputEl) {
            inputEl.classList.remove('invalid');
        }

    }


    /* =========================================================================
       7. DYNAMIC WORKSHOP SCHEDULE & LIVE COUNTDOWN
       ========================================================================= */

    const DAYS = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    const DAYS_SHORT = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];


    const WORKSHOP_CONFIG = {

        dayOfWeek: 1,

        dayName: 'Monday',

        dayShort: 'Mon',

        time: '08:09 PM',

        timezone: 'IST',

        fixedDate: null,

        dateDisplay: null,

        countdownSubtitleText:
            'Next Live Batch Starts {day} at {time}'

    };


    /* =========================================================================
       TIME PARSER
       ========================================================================= */

    function parseTimeString(timeStr) {

        if (
            !timeStr ||
            typeof timeStr !== 'string'
        ) {

            return {
                hours: 20,
                minutes: 9,
                display12: '08:09 PM',
                display24: '20:09'
            };

        }

        const trimmed =
            timeStr.trim();

        const match =
            trimmed.match(
                /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?$/i
            );

        if (!match) {

            return {
                hours: 20,
                minutes: 9,
                display12: trimmed,
                display24: trimmed
            };

        }

        let hours =
            parseInt(match[1], 10);

        const minutes =
            parseInt(match[2], 10);

        const ampm =
            match[4]
                ? match[4].toUpperCase()
                : null;


        if (ampm) {

            if (
                ampm === 'PM' &&
                hours < 12
            ) {
                hours += 12;
            }

            if (
                ampm === 'AM' &&
                hours === 12
            ) {
                hours = 0;
            }

        }


        const displayHours =
            hours % 12 === 0
                ? 12
                : hours % 12;

        const period =
            hours >= 12
                ? 'PM'
                : 'AM';

        const pad =
            number =>
                String(number).padStart(
                    2,
                    '0'
                );


        return {

            hours,

            minutes,

            display12:
                `${pad(displayHours)}:${pad(minutes)} ${period}`,

            display24:
                `${pad(hours)}:${pad(minutes)}`

        };

    }


    /* =========================================================================
       DAY PARSER
       ========================================================================= */

    function parseDay(dayInput) {

        if (
            typeof dayInput === 'number' &&
            dayInput >= 0 &&
            dayInput <= 6
        ) {

            return {

                index: dayInput,

                name: DAYS[dayInput],

                short: DAYS_SHORT[dayInput]

            };

        }


        if (
            typeof dayInput === 'string'
        ) {

            const lower =
                dayInput
                    .trim()
                    .toLowerCase();

            const foundIndex =
                DAYS.findIndex(
                    day =>
                        day
                            .toLowerCase()
                            .startsWith(
                                lower.slice(0, 3)
                            )
                );

            if (foundIndex !== -1) {

                return {

                    index: foundIndex,

                    name: DAYS[foundIndex],

                    short:
                        DAYS_SHORT[foundIndex]

                };

            }

        }


        return {

            index: 1,

            name: 'Monday',

            short: 'Mon'

        };

    }


    /* =========================================================================
       CALCULATE NEXT WORKSHOP DATE
       ========================================================================= */

    function getWorkshopTargetDate() {

        if (WORKSHOP_CONFIG.fixedDate) {

            const fixed =
                new Date(
                    WORKSHOP_CONFIG.fixedDate
                );

            if (
                !isNaN(
                    fixed.getTime()
                )
            ) {

                return fixed;

            }

        }


        const now =
            new Date();

        const target =
            new Date(now);

        const parsed =
            parseTimeString(
                WORKSHOP_CONFIG.time
            );


        target.setHours(
            parsed.hours,
            parsed.minutes,
            0,
            0
        );


        const targetDay =
            typeof WORKSHOP_CONFIG.dayOfWeek === 'number'
                ? WORKSHOP_CONFIG.dayOfWeek
                : 1;

        const currentDay =
            now.getDay();


        let daysToAdd =
            (
                targetDay -
                currentDay +
                7
            ) % 7;


        if (
            daysToAdd === 0 &&
            now.getTime() >= target.getTime()
        ) {

            daysToAdd = 7;

        }


        target.setDate(
            now.getDate() + daysToAdd
        );


        return target;

    }


    /* =========================================================================
       UPDATE WORKSHOP DISPLAY
       ========================================================================= */

    function updateWorkshopDisplay() {

        const parsedTime =
            parseTimeString(
                WORKSHOP_CONFIG.time
            );

        const dayInfo =
            parseDay(
                WORKSHOP_CONFIG.dayOfWeek
            );

        const displayTime =
            parsedTime.display12;

        const timezone =
            WORKSHOP_CONFIG.timezone || 'IST';


        /* ---------------------------------------------------------------------
           Floating Timer
           --------------------------------------------------------------------- */

        const floatingTimeEls =
            document.querySelectorAll(
                '#floating-timer-time, [data-workshop-floating-time], .floating-timer-widget .f-timer-head span'
            );

        floatingTimeEls.forEach(element => {

            element.textContent =
                `${dayInfo.short} ${displayTime}`;

        });


        /* ---------------------------------------------------------------------
           Hero Countdown Subtitle
           --------------------------------------------------------------------- */

        const subtitleEls =
            document.querySelectorAll(
                '#hero-countdown-subtitle, [data-workshop-countdown-subtitle], .countdown-subtitle'
            );

        const subtitleTemplate =
            WORKSHOP_CONFIG.countdownSubtitleText ||
            'Next Live Batch Starts {day} at {time}';


        const formattedSubtitle =
            subtitleTemplate
                .replace(
                    '{day}',
                    dayInfo.name
                )
                .replace(
                    '{shortDay}',
                    dayInfo.short
                )
                .replace(
                    '{time}',
                    displayTime
                )
                .replace(
                    '{timezone}',
                    timezone
                );


        subtitleEls.forEach(element => {

            element.textContent =
                formattedSubtitle;

        });


        /* ---------------------------------------------------------------------
           Workshop Time Card
           --------------------------------------------------------------------- */

        let timeCardFound = false;

        const detailTimeEls =
            document.querySelectorAll(
                '#workshop-detail-time, [data-workshop-time]'
            );


        if (
            detailTimeEls.length > 0
        ) {

            detailTimeEls.forEach(element => {

                element.textContent =
                    `${displayTime} ${timezone}`.trim();

            });

            timeCardFound = true;

        }


        if (!timeCardFound) {

            document
                .querySelectorAll('.detail-card')
                .forEach(card => {

                    const label =
                        card.querySelector('.d-label');

                    const value =
                        card.querySelector('.d-value');


                    if (
                        label &&
                        value &&
                        label.textContent
                            .trim()
                            .toUpperCase() === 'TIME'
                    ) {

                        value.textContent =
                            `${displayTime} ${timezone}`.trim();

                    }

                });

        }


        /* ---------------------------------------------------------------------
           Workshop Date Card
           --------------------------------------------------------------------- */

        if (
            WORKSHOP_CONFIG.dateDisplay
        ) {

            const detailDateEls =
                document.querySelectorAll(
                    '#workshop-detail-date, [data-workshop-date]'
                );

            detailDateEls.forEach(element => {

                element.textContent =
                    WORKSHOP_CONFIG.dateDisplay;

            });

        }

    }


    /* =========================================================================
       COUNTDOWN TIMER
       ========================================================================= */

    let countdownTimerInterval = null;

    let currentTargetDate = null;


    function tickTimer() {

        if (!currentTargetDate) {

            currentTargetDate =
                getWorkshopTargetDate();

        }


        const now =
            new Date().getTime();

        let distance =
            currentTargetDate.getTime() -
            now;


        /* ---------------------------------------------------------------------
           Automatically move recurring workshop to next week
           --------------------------------------------------------------------- */

        if (
            distance <= 0 &&
            !WORKSHOP_CONFIG.fixedDate
        ) {

            currentTargetDate =
                getWorkshopTargetDate();

            distance =
                currentTargetDate.getTime() -
                now;

        }


        if (distance <= 0) {

            ['timer-days', 'timer-hours', 'timer-minutes', 'timer-seconds'].forEach(cls => {
                document.querySelectorAll('.' + cls).forEach(el => {
                    el.textContent = '00';
                });
            });

            /* Show "Workshop has started" message if a fixed date was set */
            if (WORKSHOP_CONFIG.fixedDate) {
                document.querySelectorAll('.countdown-subtitle, #hero-countdown-subtitle, [data-workshop-countdown-subtitle]').forEach(el => {
                    el.textContent = '🎓 This batch has already started — stay tuned for the next one!';
                });
            }

            return;

        }


        const days =
            Math.floor(
                distance /
                (1000 * 60 * 60 * 24)
            );

        const hours =
            Math.floor(
                (
                    distance %
                    (1000 * 60 * 60 * 24)
                ) /
                (1000 * 60 * 60)
            );

        const minutes =
            Math.floor(
                (
                    distance %
                    (1000 * 60 * 60)
                ) /
                (1000 * 60)
            );

        const seconds =
            Math.floor(
                (
                    distance %
                    (1000 * 60)
                ) /
                1000
            );


        const pad =
            number =>
                number < 10
                    ? `0${number}`
                    : String(number);


        document
            .querySelectorAll('.timer-days')
            .forEach(element => {
                element.textContent =
                    pad(days);
            });


        document
            .querySelectorAll('.timer-hours')
            .forEach(element => {
                element.textContent =
                    pad(hours);
            });


        document
            .querySelectorAll('.timer-minutes')
            .forEach(element => {
                element.textContent =
                    pad(minutes);
            });


        document
            .querySelectorAll('.timer-seconds')
            .forEach(element => {
                element.textContent =
                    pad(seconds);
            });

    }


    function initCountdownTimer() {

        currentTargetDate =
            getWorkshopTargetDate();

        tickTimer();


        if (countdownTimerInterval) {

            clearInterval(
                countdownTimerInterval
            );

        }


        countdownTimerInterval =
            setInterval(
                tickTimer,
                1000
            );

    }


    /* =========================================================================
       DEVELOPER API — CHANGE WORKSHOP TIME
       ========================================================================= */

    function setWorkshopTime(options) {

        if (
            typeof options === 'string'
        ) {

            WORKSHOP_CONFIG.time =
                options;

        } else if (
            typeof options === 'object' &&
            options !== null
        ) {

            if (options.time) {

                WORKSHOP_CONFIG.time =
                    options.time;

            }


            if (
                options.day !== undefined
            ) {

                const dayObj =
                    parseDay(options.day);

                WORKSHOP_CONFIG.dayOfWeek =
                    dayObj.index;

                WORKSHOP_CONFIG.dayName =
                    dayObj.name;

                WORKSHOP_CONFIG.dayShort =
                    dayObj.short;

            } else if (
                options.dayOfWeek !== undefined
            ) {

                const dayObj =
                    parseDay(
                        options.dayOfWeek
                    );

                WORKSHOP_CONFIG.dayOfWeek =
                    dayObj.index;

                WORKSHOP_CONFIG.dayName =
                    dayObj.name;

                WORKSHOP_CONFIG.dayShort =
                    dayObj.short;

            }


            if (
                options.timezone !== undefined
            ) {

                WORKSHOP_CONFIG.timezone =
                    options.timezone;

            }


            if (
                options.fixedDate !== undefined
            ) {

                WORKSHOP_CONFIG.fixedDate =
                    options.fixedDate;

            }


            if (
                options.dateDisplay !== undefined
            ) {

                WORKSHOP_CONFIG.dateDisplay =
                    options.dateDisplay;

            }


            if (
                options.countdownSubtitleText !== undefined
            ) {

                WORKSHOP_CONFIG.countdownSubtitleText =
                    options.countdownSubtitleText;

            }

        }


        const activeDay =
            parseDay(
                WORKSHOP_CONFIG.dayOfWeek
            );

        WORKSHOP_CONFIG.dayName =
            activeDay.name;

        WORKSHOP_CONFIG.dayShort =
            activeDay.short;


        updateWorkshopDisplay();


        currentTargetDate =
            getWorkshopTargetDate();

        tickTimer();


        console.log(
            `[Workshop Config] Updated to: ${WORKSHOP_CONFIG.dayName} at ${WORKSHOP_CONFIG.time} (${WORKSHOP_CONFIG.timezone})`
        );


        return {

            config: WORKSHOP_CONFIG,

            targetDate:
                currentTargetDate

        };

    }


    /* =========================================================================
       PARSE workshoptime.md
       ========================================================================= */

    function parseMarkdownConfig(markdownText) {

        const config = {};

        if (!markdownText) {
            return config;
        }


        const lines =
            markdownText.split(/\r?\n/);


        lines.forEach(line => {

            const clean =
                line
                    .replace(
                        /^[\s*\-#>]+/,
                        ''
                    )
                    .trim();


            if (
                /^\d+\./.test(clean)
            ) {
                return;
            }


            const colonIndex =
                clean.indexOf(':');


            if (colonIndex === -1) {
                return;
            }


            const rawKey =
                clean
                    .substring(
                        0,
                        colonIndex
                    )
                    .replace(
                        /[^a-zA-Z0-9_]/g,
                        ''
                    )
                    .trim()
                    .toUpperCase();


            let rawValue =
                clean
                    .substring(
                        colonIndex + 1
                    )
                    .replace(
                        /[*_`]/g,
                        ''
                    )
                    .trim();


            rawValue =
                rawValue.replace(
                    /^["']|["']$/g,
                    ''
                );


            if (
                rawKey &&
                rawValue
            ) {

                config[rawKey] =
                    rawValue;

            }

        });


        return config;

    }


    /* =========================================================================
       APPLY MARKDOWN SCHEDULE CONFIGURATION
       ========================================================================= */

    function applyScheduleFromConfig(cfg) {

        if (!cfg) {
            return;
        }


        /* ---------------------------------------------------------------------
           Time
           --------------------------------------------------------------------- */

        if (cfg.TIME) {

            WORKSHOP_CONFIG.time =
                cfg.TIME;

        }


        /* ---------------------------------------------------------------------
           Timezone
           --------------------------------------------------------------------- */

        if (cfg.TIMEZONE) {

            WORKSHOP_CONFIG.timezone =
                cfg.TIMEZONE;

        }


        /* ---------------------------------------------------------------------
           Countdown Title
           --------------------------------------------------------------------- */

        if (cfg.COUNTDOWN_TITLE) {

            WORKSHOP_CONFIG.countdownSubtitleText =
                cfg.COUNTDOWN_TITLE;

        }


        /* ---------------------------------------------------------------------
           Date / Day
           --------------------------------------------------------------------- */

        if (cfg.DATE) {

            const dateMatch =
                cfg.DATE
                    .trim()
                    .match(
                        /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
                    );


            if (dateMatch) {

                const year =
                    parseInt(
                        dateMatch[1],
                        10
                    );

                const month =
                    parseInt(
                        dateMatch[2],
                        10
                    ) - 1;

                const day =
                    parseInt(
                        dateMatch[3],
                        10
                    );


                const parsedTime =
                    parseTimeString(
                        WORKSHOP_CONFIG.time
                    );


                const target =
                    new Date(
                        year,
                        month,
                        day,
                        parsedTime.hours,
                        parsedTime.minutes,
                        0,
                        0
                    );


                WORKSHOP_CONFIG.fixedDate =
                    target;

                WORKSHOP_CONFIG.dayOfWeek =
                    target.getDay();


                const dayObj =
                    parseDay(
                        target.getDay()
                    );


                WORKSHOP_CONFIG.dayName =
                    dayObj.name;

                WORKSHOP_CONFIG.dayShort =
                    dayObj.short;

            } else {

                const date =
                    new Date(cfg.DATE);


                if (
                    !isNaN(
                        date.getTime()
                    )
                ) {

                    WORKSHOP_CONFIG.fixedDate =
                        date;

                    WORKSHOP_CONFIG.dayOfWeek =
                        date.getDay();


                    const dayObj =
                        parseDay(
                            date.getDay()
                        );


                    WORKSHOP_CONFIG.dayName =
                        dayObj.name;

                    WORKSHOP_CONFIG.dayShort =
                        dayObj.short;

                }

            }

        } else if (cfg.DAY) {

            const dayObj =
                parseDay(cfg.DAY);

            WORKSHOP_CONFIG.dayOfWeek =
                dayObj.index;

            WORKSHOP_CONFIG.dayName =
                dayObj.name;

            WORKSHOP_CONFIG.dayShort =
                dayObj.short;

        }


        /* ---------------------------------------------------------------------
           Date Display
           --------------------------------------------------------------------- */

        if (cfg.DATE_DISPLAY) {

            WORKSHOP_CONFIG.dateDisplay =
                cfg.DATE_DISPLAY;

        } else if (
            cfg.DATE &&
            WORKSHOP_CONFIG.fixedDate
        ) {

            const date =
                new Date(
                    WORKSHOP_CONFIG.fixedDate
                );


            const months = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ];


            WORKSHOP_CONFIG.dateDisplay =
                `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

        }


        updateWorkshopDisplay();


        currentTargetDate =
            getWorkshopTargetDate();

        tickTimer();

    }


    /* =========================================================================
       LOAD workshoptime.md
       ========================================================================= */

    async function loadWorkshopTimeFromMD() {

        try {

            const response =
                await fetch(
                    `workshoptime.md?t=${Date.now()}`
                );


            if (!response.ok) {
                return;
            }


            const markdownText =
                await response.text();


            const config =
                parseMarkdownConfig(
                    markdownText
                );


            applyScheduleFromConfig(
                config
            );


            console.log(
                '[Workshop Schedule] Loaded successfully from workshoptime.md:',
                config
            );

        } catch (error) {

            console.info(
                '[Workshop Schedule] Using built-in schedule configuration.'
            );

        }

    }


    /* =========================================================================
       EXPOSE WORKSHOP API GLOBALLY
       ========================================================================= */

    window.setWorkshopTime =
        setWorkshopTime;

    window.WORKSHOP_CONFIG =
        WORKSHOP_CONFIG;

    window.loadWorkshopTimeFromMD =
        loadWorkshopTimeFromMD;


    /* =========================================================================
       INITIAL WORKSHOP RENDER
       ========================================================================= */

    updateWorkshopDisplay();

    initCountdownTimer();

    loadWorkshopTimeFromMD();

});


/* ============================================================================
   8. RAZORPAY PAYMENT — CREATE ORDER & OPEN CHECKOUT
   ============================================================================ */

/**
 * Called after successful frontend form validation.
 *
 * Flow:
 * 1. Send registration data to Vercel.
 * 2. Vercel creates Razorpay order.
 * 3. Open Razorpay Checkout.
 * 4. Receive payment response.
 * 5. Verify payment on server.
 */

async function proceedToPayment(formData) {

    const submitBtn =
        document
            .getElementById('registration-form')
            ?.querySelector('.btn-submit');


    if (!submitBtn) {

        console.error(
            'Submit button not found.'
        );

        return;

    }


    const originalHTML =
        submitBtn.innerHTML;


    try {

        /* ---------------------------------------------------------------------
           Disable submit button
           --------------------------------------------------------------------- */

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            '<span>CREATING SECURE PAYMENT...</span>';


        /* ---------------------------------------------------------------------
           STEP 1 — Create Razorpay Order
           --------------------------------------------------------------------- */

        const response =
            await fetch(
                '/api/create-order',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify(
                            formData
                        )
                }
            );


        let result;

        try {

            result =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                'Invalid response from payment server.'
            );

        }


        if (
            !response.ok ||
            !result.success ||
            !result.order
        ) {

            throw new Error(
                result.message ||
                'Unable to create payment order.'
            );

        }


        console.log(
            'Razorpay order created:',
            result.order
        );


        /* ---------------------------------------------------------------------
           STEP 2 — Make sure Razorpay Checkout is loaded
           --------------------------------------------------------------------- */

        if (
            typeof Razorpay === 'undefined'
        ) {

            throw new Error(
                'Razorpay Checkout is not loaded. Please check index.html.'
            );

        }


        /* ---------------------------------------------------------------------
           STEP 3 — Razorpay Checkout Options
           --------------------------------------------------------------------- */

        const options = {

            key:
                result.keyId,

            amount:
                result.order.amount,

            currency:
                result.order.currency,

            name:
                'Nischchit Lakshya',

            description:
                '5-Day Trading Workshop',

            order_id:
                result.order.id,


            /* -----------------------------------------------------------------
               Customer Details
               ----------------------------------------------------------------- */

            prefill: {

                name:
                    formData.fullName,

                email:
                    formData.email,

                contact:
                    formData.phone

            },


            /* -----------------------------------------------------------------
               Registration Information
               ----------------------------------------------------------------- */

            notes: {

                tradingExperience:
                    formData.tradingExperience,

                learningGoal:
                    formData.learningGoal,

                contactMethod:
                    formData.contactMethod

            },


            /* -----------------------------------------------------------------
               Razorpay Theme
               ----------------------------------------------------------------- */

            theme: {

                color:
                    '#D4AF37'

            },


            /* -----------------------------------------------------------------
               SUCCESSFUL PAYMENT
               ----------------------------------------------------------------- */

            handler:
                async function (paymentResponse) {

                    console.log(
                        'Razorpay response:',
                        paymentResponse
                    );


                    await verifyRazorpayPayment(
                        paymentResponse,
                        formData
                    );

                },


            /* -----------------------------------------------------------------
               Checkout Closed
               ----------------------------------------------------------------- */

            modal: {

                ondismiss:
                    function () {

                        console.log(
                            'Razorpay checkout closed by user.'
                        );


                        submitBtn.disabled =
                            false;

                        submitBtn.innerHTML =
                            originalHTML;

                    }

            }

        };


        /* ---------------------------------------------------------------------
           STEP 4 — Create Razorpay instance
           --------------------------------------------------------------------- */

        const razorpay =
            new Razorpay(options);


        /* ---------------------------------------------------------------------
           Payment Failed
           --------------------------------------------------------------------- */

        razorpay.on(
            'payment.failed',
            function (response) {

                console.error(
                    'Razorpay payment failed:',
                    response.error
                );


                submitBtn.disabled =
                    false;

                submitBtn.innerHTML =
                    originalHTML;


                const message =
                    response.error?.description ||
                    'Payment failed. Please try again.';


                alert(message);

            }
        );


        /* ---------------------------------------------------------------------
           STEP 5 — Open Razorpay Checkout
           --------------------------------------------------------------------- */

        razorpay.open();

    } catch (error) {

        console.error(
            'Payment initialization error:',
            error
        );


        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
        }


        alert(
            error.message ||
            'Unable to start payment. Please try again.'
        );

    }

}


/* ============================================================================
   9. RAZORPAY PAYMENT VERIFICATION
   ============================================================================ */

/**
 * Sends Razorpay's payment response to the Vercel server.
 *
 * IMPORTANT:
 * The actual signature verification happens on the server.
 * Never put RAZORPAY_KEY_SECRET in this JavaScript file.
 */

async function verifyRazorpayPayment(
    paymentResponse,
    formData
) {

    const submitBtn =
        document
            .getElementById('registration-form')
            ?.querySelector('.btn-submit');


    try {

        /* ---------------------------------------------------------------------
           Disable button while verification is running
           --------------------------------------------------------------------- */

        if (submitBtn) {

            submitBtn.disabled =
                true;

            submitBtn.innerHTML =
                '<span>VERIFYING PAYMENT...</span>';

        }


        /* ---------------------------------------------------------------------
           Validate Razorpay response before sending
           --------------------------------------------------------------------- */

        if (
            !paymentResponse ||
            !paymentResponse.razorpay_order_id ||
            !paymentResponse.razorpay_payment_id ||
            !paymentResponse.razorpay_signature
        ) {

            throw new Error(
                'Incomplete payment response received from Razorpay.'
            );

        }


        /* ---------------------------------------------------------------------
           Send payment details to Vercel
           --------------------------------------------------------------------- */

        const response =
            await fetch(
                '/api/verify-payment',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({

                            razorpay_order_id:
                                paymentResponse
                                    .razorpay_order_id,

                            razorpay_payment_id:
                                paymentResponse
                                    .razorpay_payment_id,

                            razorpay_signature:
                                paymentResponse
                                    .razorpay_signature

                        })
                }
            );


        let result;

        try {

            result =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                'Invalid response from payment verification server.'
            );

        }


        /* ---------------------------------------------------------------------
           Check verification result
           --------------------------------------------------------------------- */

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


        /* ---------------------------------------------------------------------
           Store registration temporarily
           --------------------------------------------------------------------- */

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
            JSON.stringify(
                registrationData
            )
        );


        /* ---------------------------------------------------------------------
           Payment successful
           --------------------------------------------------------------------- */

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<span>✓ PAYMENT VERIFIED — REDIRECTING...</span>';
        }

        window.location.href =
            '/thank-you.html';

    } catch (error) {

        console.error(
            'Payment verification error:',
            error
        );


        if (submitBtn) {

            submitBtn.disabled =
                false;

            submitBtn.innerHTML =
                '<span>PAYMENT VERIFICATION FAILED</span>';

        }


        const paymentId =
            paymentResponse?.razorpay_payment_id ||
            'Not available';


        alert(
            'We could not verify your payment automatically.\n\n' +
            'Please do not make another payment immediately.\n\n' +
            'Payment ID: ' +
            paymentId +
            '\n\n' +
            'Please contact support with this Payment ID.'
        );

    }

}