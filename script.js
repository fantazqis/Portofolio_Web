(function () {
  'use strict';

  /* ── Dark Mode ── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = themeToggle.querySelector('.theme-icon');
  const html        = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', function () {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', next);
  });

  /* ── Hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.style.boxShadow = window.scrollY > 20 ? '0 2px 16px rgba(0,0,0,0.08)' : '';
  }, { passive: true });

  /* ── Typing animation ── */
  const phrases = [
    'QA Automation Engineer.',
    'Manual Testing Pro.',
    'Python Enthusiast.',
    'Aspiring Data Analyst.',
  ];
  const typedEl = document.getElementById('typed-text');
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const current = phrases[pi];
    typedEl.textContent = current.slice(0, ci);
    if (!deleting) {
      ci++;
      if (ci > current.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
    } else {
      ci--;
      if (ci < 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        ci = 0;
      }
    }
    setTimeout(type, deleting ? 55 : 85);
  }
  type();

  /* ── Skill bars on scroll ── */
  const barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.bar-fill').forEach(function (bar) {
          bar.style.width = bar.dataset.w + '%';
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-animate-bars]').forEach(function (el) {
    barObserver.observe(el);
  });

  /* ── Fade-up on scroll ── */
  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.section-title, .section-sub, .section-line, .about-grid, .skills-grid, .filter-bar, .projects-grid, .timeline, .learning-card, .quiz-card, .contact-sub, .contact-links').forEach(function (el) {
    el.classList.add('fade-up');
    fadeObserver.observe(el);
  });

  /* ── Project filter ── */
  const filterBar   = document.getElementById('filterBar');
  const projectCards = document.querySelectorAll('.proj-card');

  filterBar.addEventListener('click', function (e) {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projectCards.forEach(function (card) {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

  /* ── Learning ticker ── */
  const ticker     = document.getElementById('ticker');
  const tickerItems = ticker.querySelectorAll('span');
  const itemH      = 1.6; // rem — must match CSS
  let tickerIdx    = 0;

  setInterval(function () {
    tickerIdx = (tickerIdx + 1) % tickerItems.length;
    ticker.style.transform = 'translateY(-' + (tickerIdx * itemH) + 'rem)';
  }, 2400);

  /* ── Quiz ── */
  const questions = [
    {
      q: 'Which E2E testing framework do I primarily use?',
      opts: ['Playwright', 'Cypress', 'Puppeteer', 'WebDriverIO'],
      ans: 'Cypress',
    },
    {
      q: 'Which Python library am I using to learn data analysis?',
      opts: ['TensorFlow', 'Flask', 'pandas', 'scikit-learn'],
      ans: 'pandas',
    },
    {
      q: 'Which tool do I use for API testing?',
      opts: ['SoapUI', 'k6', 'Postman', 'Burp Suite'],
      ans: 'Postman',
    },
    {
      q: 'Which data viz tool am I currently learning?',
      opts: ['D3.js', 'Tableau', 'Grafana', 'Observable'],
      ans: 'Tableau',
    },
    {
      q: 'What language do I use for test automation scripts?',
      opts: ['Ruby', 'Java', 'Go', 'Python'],
      ans: 'Python',
    },
  ];

  let qi = 0, score = 0;

  const qQuestion = document.getElementById('quizQuestion');
  const qOptions  = document.getElementById('quizOptions');
  const qFeedback = document.getElementById('quizFeedback');
  const qScore    = document.getElementById('quizScore');
  const qNext     = document.getElementById('quizNext');
  const qProgress = document.getElementById('quizProgress');

  function loadQuestion() {
    if (qi >= questions.length) {
      qQuestion.textContent = 'You scored ' + score + '/' + questions.length + ' 🎉';
      qOptions.innerHTML = '';
      qFeedback.textContent =
        score === questions.length ? "Perfect score — you really did your homework!" :
        score >= 3               ? "Not bad! You've been paying attention." :
                                   "Guess you'll have to hire me to find out 😄";
      qNext.style.display = 'none';
      qScore.textContent  = '';
      qProgress.style.width = '100%';
      return;
    }
    const current = questions[qi];
    qProgress.style.width = ((qi / questions.length) * 100) + '%';
    qQuestion.textContent = 'Q' + (qi + 1) + ': ' + current.q;
    qFeedback.textContent = '';
    qNext.style.display   = 'none';
    qScore.textContent    = 'Score: ' + score + '/' + qi;
    qOptions.innerHTML    = '';
    current.opts.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.className   = 'quiz-opt';
      btn.textContent = opt;
      btn.addEventListener('click', function () { handleAnswer(opt, btn); });
      qOptions.appendChild(btn);
    });
  }

  function handleAnswer(selected, btn) {
    const ans = questions[qi].ans;
    qOptions.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.style.pointerEvents = 'none';
    });
    if (selected === ans) {
      btn.classList.add('correct');
      qFeedback.textContent = '✓ Correct!';
      score++;
    } else {
      btn.classList.add('wrong');
      qFeedback.textContent = '✗ Nope — it was ' + ans + '.';
      qOptions.querySelectorAll('.quiz-opt').forEach(function (b) {
        if (b.textContent === ans) b.classList.add('correct');
      });
    }
    qi++;
    qScore.textContent   = 'Score: ' + score + '/' + qi;
    qNext.style.display  = 'inline-block';
  }

  qNext.addEventListener('click', loadQuestion);
  loadQuestion();

})();
