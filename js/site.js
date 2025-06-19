fetch('/data/site.json')
  .then(r => r.json())
  .then(data => {
    const navItems = document.querySelectorAll('nav ul li');
    data.nav_links.forEach((link, i) => {
      if (navItems[i]) {
        const a = navItems[i].querySelector('a');
        if (a) {
          a.textContent = link.label;
          a.href = link.url;
        }
      }
    });

    const page = document.body.dataset.page;
    const pageData = data[page];
    if (pageData) {
      if (page === 'podcast') {
        document.querySelector('[data-content="chronicles-title"]').textContent = pageData.chronicles_title;
        document.querySelector('[data-content="chronicles-text"]').textContent = pageData.chronicles_text;
        document.querySelector('[data-content="voice-title"]').textContent = pageData.voice_title;
        document.querySelector('[data-content="voice-text"]').textContent = pageData.voice_text;
      } else {
        const titleEl = document.querySelector('[data-content="hero-title"]');
        const textEl = document.querySelector('[data-content="hero-text"]');
        if (titleEl) titleEl.textContent = pageData.hero_title;
        if (textEl) textEl.textContent = pageData.hero_text;
      }
    }
  })
  .catch(err => console.error('Error loading site data', err));
