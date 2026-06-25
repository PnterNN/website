/* ══════════════════════════════════════════════════════
   MAIN — Navigation, Scroll, APIs, Form, Counters
   ══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ═══════════════════════════════════
    // AGE CALCULATOR
    // ═══════════════════════════════════
    function calculateAge() {
        const birthDate = new Date('2004-12-24');
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        const el = document.getElementById('ageValue');
        if (el) el.textContent = age + ' Years Old';
    }

    // ═══════════════════════════════════
    // SCROLL REVEAL (Intersection Observer)
    // ═══════════════════════════════════
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Trigger skill bar fill when skills become visible
                    if (entry.target.closest('#skills')) {
                        animateSkillBars();
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ═══════════════════════════════════
    // SIDE NAVIGATION — Active section highlight
    // ═══════════════════════════════════
    function initSideNav() {
        const sections = document.querySelectorAll('.section');
        const dots = document.querySelectorAll('.nav-dot');

        if (!sections.length || !dots.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    dots.forEach(dot => {
                        dot.classList.toggle('active', dot.dataset.section === id);
                    });
                }
            });
        }, {
            threshold: 0.3
        });

        sections.forEach(section => observer.observe(section));

        // Smooth scroll on dot click
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(dot.dataset.section);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ═══════════════════════════════════
    // COUNTER ANIMATION
    // ═══════════════════════════════════
    function animateCounter(element, target, suffix = '', duration = 2000) {
        if (!element || element.dataset.animated === 'true') return;
        element.dataset.animated = 'true';

        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (target - start) * eased);

            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // Stats counter observer
    function initStatCounters() {
        const statSection = document.getElementById('stats');
        if (!statSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger API fetches for stats
                    fetchGitHubStats();
                    fetchWakaTimeStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statSection);
    }

    // ═══════════════════════════════════
    // SKILL BARS ANIMATION
    // ═══════════════════════════════════
    let skillBarsAnimated = false;

    function animateSkillBars() {
        if (skillBarsAnimated) return;
        skillBarsAnimated = true;

        const fills = document.querySelectorAll('.skill-fill');
        fills.forEach((fill, i) => {
            setTimeout(() => {
                fill.style.width = fill.dataset.percent + '%';
            }, i * 80);
        });
    }

    // ═══════════════════════════════════
    // WAKATIME API
    // ═══════════════════════════════════
    function fetchWakaTimeSkills() {
        const grid = document.getElementById('skillsGrid');
        if (!grid) return;

        const url = 'https://wakatime.com/share/@PnterNN/a9dbca95-7cb4-47aa-9300-1e50e784370a.json';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const skills = data.data
                    .map(lang => ({
                        name: lang.name,
                        percent: Math.round(lang.percent)
                    }))
                    .sort((a, b) => b.percent - a.percent)
                    .slice(0, 8);

                // Clear loading
                grid.innerHTML = '';

                // Render skills
                skills.forEach(skill => {
                    const item = document.createElement('div');
                    item.className = 'skill-item reveal';
                    item.innerHTML = `
                        <div class="skill-header">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-percent">${skill.percent}%</span>
                        </div>
                        <div class="skill-bar">
                            <div class="skill-fill" data-percent="${skill.percent}"></div>
                        </div>
                    `;
                    grid.appendChild(item);
                });

                // Re-init reveal for new elements
                initScrollReveal();
            })
            .catch(() => {
                grid.innerHTML = `
                    <div class="skills-loading">
                        <p>Failed to load skill data.</p>
                    </div>
                `;
            });
    }

    function fetchWakaTimeStats() {
        const url = 'https://wakatime.com/share/@PnterNN/9c0aa61d-cae9-48b5-a2e1-f19618c5451d.json';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const grandTotal = data?.data?.grand_total || {};
                const totalTime = grandTotal.human_readable_total_including_other_language || '—';
                const dailyAvg = grandTotal.human_readable_daily_average_including_other_language || '—';

                // Clean up time strings
                const cleanTime = (str) => {
                    if (!str || str === '—') return '—';
                    return str
                        .replace(/hours?/gi, 'h')
                        .replace(/hrs?/gi, 'h')
                        .replace(/\d+\s*mins?/gi, '')
                        .trim();
                };

                const codingTimeEl = document.getElementById('statCodingTime');
                const dailyAvgEl = document.getElementById('statDailyAvg');

                if (codingTimeEl) codingTimeEl.textContent = cleanTime(totalTime);
                if (dailyAvgEl) dailyAvgEl.textContent = cleanTime(dailyAvg);
            })
            .catch(() => {
                // Silent fail
            });
    }

    // ═══════════════════════════════════
    // GITHUB API (REST — no token needed)
    // ═══════════════════════════════════
    function fetchGitHubStats() {
        const username = 'PnterNN';

        // Fetch user info (repos, followers, created_at)
        fetch(`https://api.github.com/users/${username}`)
            .then(res => res.json())
            .then(user => {
                // Repos
                const reposEl = document.getElementById('statRepos');
                if (reposEl) animateCounter(reposEl, user.public_repos);

                // Followers
                const followersEl = document.getElementById('statFollowers');
                if (followersEl) animateCounter(followersEl, user.followers);

                // Account age (years)
                const createdAt = new Date(user.created_at);
                const yearsActive = new Date().getFullYear() - createdAt.getFullYear();
                const yearsEl = document.getElementById('statYears');
                if (yearsEl) animateCounter(yearsEl, yearsActive);
            })
            .catch(() => {});

        // Fetch repos for star count
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
            .then(res => res.json())
            .then(repos => {
                if (!Array.isArray(repos)) return;
                const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
                const starsEl = document.getElementById('statStars');
                if (starsEl) animateCounter(starsEl, totalStars);
            })
            .catch(() => {});
    }

    // ═══════════════════════════════════
    // PROJECT FILTERING
    // ═══════════════════════════════════
    function initProjectFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.project-card');

        if (!buttons.length || !cards.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                cards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                        // Retrigger animation
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ═══════════════════════════════════
    // CONTACT FORM (EmailJS)
    // ═══════════════════════════════════
    function initContactForm() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init('hVoxcQUOQTzR-Qt71');
        }

        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            // Disable button
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';

            if (typeof emailjs === 'undefined') {
                showToast('EmailJS failed to load.', 'error');
                submitBtn.disabled = false;
                btnText.textContent = originalText;
                return;
            }

            emailjs.sendForm('service_8emx9zm', 'template_iu2emjl', form)
                .then(() => {
                    showToast('Message sent successfully!', 'success');
                    form.reset();
                })
                .catch((err) => {
                    console.error('EmailJS Error:', err);
                    showToast('Failed to send message. Please try again.', 'error');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    btnText.textContent = originalText;
                });
        });
    }

    // ═══════════════════════════════════
    // TOAST NOTIFICATION
    // ═══════════════════════════════════
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ═══════════════════════════════════
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ═══════════════════════════════════
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ═══════════════════════════════════
    // PROJECT CARD TILT EFFECT
    // ═══════════════════════════════════
    function initTiltEffect() {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -4;
                const rotateY = (x - centerX) / centerX * 4;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // ═══════════════════════════════════
    // INITIALIZE EVERYTHING
    // ═══════════════════════════════════
    document.addEventListener('DOMContentLoaded', () => {
        calculateAge();
        initScrollReveal();
        initSideNav();
        initProjectFilters();
        initContactForm();
        initSmoothScroll();
        initStatCounters();
        initTiltEffect();
        fetchWakaTimeSkills();
    });
})();
