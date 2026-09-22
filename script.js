document.addEventListener('DOMContentLoaded', function () {

  /* ---------- HEADER: scroll state + on-dark toggle ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const heroEl = document.querySelector('.hero, .page-banner');
    const darkZone = heroEl ? heroEl.offsetHeight - 100 : 0;
    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 40);
      if (header.dataset.dark === 'true') {
        header.classList.toggle('on-dark', window.scrollY < darkZone);
      }
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  /* ---------- MOBILE DRAWER ---------- */
  const drawer = document.getElementById('drawer');
  const burger = document.querySelector('.burger');
  const drawerClose = document.querySelector('.drawer-close');
  if (drawer && burger) {
    burger.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (drawer && drawerClose) {
    drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- HERO SCROLL HINT (home page only) ---------- */
  const hero = document.querySelector('.hero');
  if (hero && !hero.querySelector('.scroll-hint')) {
    hero.insertAdjacentHTML('beforeend', '<div class="scroll-hint"><span>SCROLL</span><div class="line"></div></div>');
  }

  /* ---------- FILTER / CATEGORY CHIPS (vendors page) ---------- */
  document.querySelectorAll('.filter-bar .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-bar .chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  /* ---------- JOURNAL CATEGORY FILTER (visual only) ---------- */
  document.querySelectorAll('.journal-cats span').forEach((s) => {
    s.addEventListener('click', () => {
      document.querySelectorAll('.journal-cats span').forEach((x) => x.classList.remove('active'));
      s.classList.add('active');
    });
  });

  /* ---------- COMPARE CHIP TOGGLE (visual only) ---------- */
  document.querySelectorAll('.compare-select .chip').forEach((c) => {
    c.addEventListener('click', () => c.classList.toggle('active'));
  });

  /* ---------- VENDOR / MOODBOARD HEART SAVE TOGGLE ---------- */
  document.querySelectorAll('.vcard .heart').forEach((h) => {
    h.addEventListener('click', (e) => {
      e.preventDefault();
      h.classList.toggle('saved');
      h.innerHTML = h.classList.contains('saved') ? '&#9829;' : '&#9825;';
      h.style.color = h.classList.contains('saved') ? '#fff' : '';
      h.style.background = h.classList.contains('saved') ? 'var(--wine)' : 'rgba(255,255,255,0.9)';
    });
  });

  document.querySelectorAll('.mb-tile').forEach((t) => {
    const heart = t.querySelector('.mb-heart');
    if (!heart) return;
    heart.addEventListener('click', () => {
      t.classList.toggle('saved');
      heart.innerHTML = t.classList.contains('saved') ? '&#9829;' : '&#9825;';
    });
  });

  /* ---------- BUDGET CALCULATOR (planning-tools page) ---------- */
  const catRows = document.getElementById('catRows');
  if (catRows) {
    const categories = [
      { name: 'Venue', pct: 28, color: '#5C1A2E' },
      { name: 'Catering', pct: 20, color: '#7A2C42' },
      { name: 'Decor', pct: 14, color: '#B8925A' },
      { name: 'Photography', pct: 9, color: '#D9BD8F' },
      { name: 'Outfits', pct: 9, color: '#8C6A4E' },
      { name: 'Jewellery', pct: 8, color: '#3A0F1E' },
      { name: 'Makeup', pct: 4, color: '#C7A97A' },
      { name: 'Entertainment', pct: 4, color: '#9B5D6E' },
      { name: 'Invitations', pct: 2, color: '#E9DACB' },
      { name: 'Miscellaneous', pct: 2, color: '#A8907E' }
    ];

    categories.forEach((c) => {
      const row = document.createElement('div');
      row.className = 'cat-row';
      row.innerHTML = `<div class="cname">${c.name}</div><div class="cbar-track"><div class="cbar-fill" style="width:${c.pct}%;background:${c.color};"></div></div><div class="camt" data-pct="${c.pct}">₹0</div>`;
      catRows.appendChild(row);
    });

    function fmtINR(n) {
      return '₹' + Math.round(n).toLocaleString('en-IN');
    }

    function renderDonut(total) {
      const svg = document.getElementById('donut');
      if (!svg) return;
      svg.innerHTML = '';
      let acc = 0;
      const r = 15.9155;
      categories.forEach((c) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '21');
        circle.setAttribute('cy', '21');
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'transparent');
        circle.setAttribute('stroke', c.color);
        circle.setAttribute('stroke-width', '6');
        const circumference = 2 * Math.PI * r;
        circle.setAttribute('stroke-dasharray', `${circumference * (c.pct / 100)} ${circumference}`);
        circle.setAttribute('stroke-dashoffset', -circumference * (acc / 100));
        acc += c.pct;
        svg.appendChild(circle);
      });
      const legend = document.getElementById('legend');
      if (legend) {
        legend.innerHTML = categories
          .map((c) => `<div><span class="sw" style="background:${c.color}"></span>${c.name} — ${fmtINR((total * c.pct) / 100)}</div>`)
          .join('');
      }
    }

    function updateBudget(total) {
      document.querySelectorAll('.camt').forEach((el) => {
        const pct = parseFloat(el.getAttribute('data-pct'));
        el.textContent = fmtINR((total * pct) / 100);
      });
      renderDonut(total);
    }

    const bInput = document.getElementById('budgetInput');
    const bSlider = document.getElementById('budgetSlider');
    if (bInput && bSlider) {
      bInput.addEventListener('input', () => {
        bSlider.value = bInput.value;
        updateBudget(parseFloat(bInput.value) || 0);
      });
      bSlider.addEventListener('input', () => {
        bInput.value = bSlider.value;
        updateBudget(parseFloat(bSlider.value) || 0);
      });
      updateBudget(parseFloat(bInput.value) || 1000000);
    }
  }

  /* ---------- WEDDING CHECKLIST PROGRESS (planning-tools page) ---------- */
  const allChecks = document.querySelectorAll('#checklist input[type=checkbox]');
  if (allChecks.length) {
    function updateProgress() {
      const total = allChecks.length;
      const done = Array.from(allChecks).filter((c) => c.checked).length;
      const pct = Math.round((done / total) * 100);
      const progressNum = document.getElementById('progressNum');
      const progressFill = document.getElementById('progressFill');
      if (progressNum) progressNum.textContent = pct + '%';
      if (progressFill) progressFill.style.width = pct + '%';
    }
    allChecks.forEach((c) => {
      c.addEventListener('change', () => {
        c.closest('.check-item').classList.toggle('done', c.checked);
        updateProgress();
      });
    });
    updateProgress();
  }

  /* ---------- COUNTDOWN (planning-tools page) ---------- */
  const cdDays = document.getElementById('cdDays');
  if (cdDays) {
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 126);

    function tick() {
      const now = new Date();
      let diff = targetDate - now;
      if (diff < 0) diff = 0;
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      document.getElementById('cdDays').textContent = String(d).padStart(2, '0');
      document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
      document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
    }

    window.setCountdown = function () {
      const v = document.getElementById('weddingDate').value;
      if (v) {
        targetDate = new Date(v);
        tick();
      }
    };

    tick();
    setInterval(tick, 60000);
  }

});
