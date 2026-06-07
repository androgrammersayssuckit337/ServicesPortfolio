document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (menuBtn && mobileMenu && overlay && closeBtn) {
    const openMenu = () => {
      mobileMenu.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
  }

  // Highlight active link in Desktop Nav
  const path = window.location.pathname;
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav-links a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === '.' + path || link.getAttribute('href') === path || (path === '/' && link.getAttribute('href') === './index.html')) {
      link.classList.add('text-breaux-accent', 'font-semibold');
      link.classList.remove('text-neutral-400', 'text-slate-600');
    }
  });

  // Intersection Observer for scroll reveal animations
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };
    
    let delayCounter = 0;
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a slight stagger effect based on delayCounter
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delayCounter * 100);
          
          delayCounter++;
          // Reset delay counter after a short time in case of multiple separate scrolls
          setTimeout(() => { delayCounter = 0; }, 500);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  }

  // Page Transition Logic
  const allLinks = document.querySelectorAll('a');
  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      
      // Check if it's an internal link
      if (
        target && 
        !target.startsWith('http') && 
        !target.startsWith('mailto:') && 
        !target.startsWith('tel:') && 
        link.target !== '_blank'
      ) {
        e.preventDefault();
        
        // Add fade-out class to the body
        document.body.classList.add('page-fade-out');
        
        // Navigate after animation completes
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    });
  });

  // Scroll Progress Bar
  const progressBar = document.createElement('div');
  progressBar.style.position = 'fixed';
  progressBar.style.top = '0';
  progressBar.style.left = '0';
  progressBar.style.height = '3px';
  progressBar.style.backgroundColor = '#3b82f6'; // Neon blue
  progressBar.style.boxShadow = '0 0 8px rgba(59, 130, 246, 0.8)';
  progressBar.style.width = '0%';
  progressBar.style.zIndex = '9999';
  progressBar.style.transition = 'width 0.1s ease-out';
  progressBar.style.pointerEvents = 'none';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const scrollPercentage = Math.min((scrollTop / scrollHeight) * 100, 100);
      progressBar.style.width = `${scrollPercentage}%`;
    } else {
      progressBar.style.width = '0%';
    }
  });
});

// Handle back/forward browser navigation to remove fade out state
window.addEventListener('pageshow', (e) => {
  if (e.persisted || document.body.classList.contains('page-fade-out')) {
    document.body.classList.remove('page-fade-out');
  }
});

// Global Site Search Logic
document.addEventListener('DOMContentLoaded', () => {
    const searchModalHTML = `
    <div id="search-modal" class="fixed inset-0 z-50 hidden bg-neutral-950/90 backdrop-blur-sm flex justify-center items-start pt-20 pb-4 px-4 opacity-0 transition-opacity duration-200">
        <div class="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-sm shadow-2xl flex flex-col max-h-[80vh]">
            <div class="flex items-center border-b border-neutral-800 p-4 relative">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-neutral-400 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" id="search-input" class="w-full bg-transparent border-none outline-none text-white text-lg placeholder-neutral-500 pr-12 focus:ring-0" placeholder="Search services, projects, or personnel..." autocomplete="off">
                <button id="close-search" class="text-neutral-400 hover:text-white p-1 absolute right-4"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div id="search-results" class="overflow-y-auto p-2">
                <div class="p-8 text-center text-neutral-500 text-sm flex flex-col items-center justify-center gap-3">
                    <svg class="h-12 w-12 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>Type to start searching...</span>
                    <span class="text-xs border border-neutral-800 px-2 py-1 rounded-sm mt-2">Cmd / Ctrl + K</span>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', searchModalHTML);

    const searchBtns = document.querySelectorAll('.site-search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeSearchBtn = document.getElementById('close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    const searchData = [
        { title: 'Software Engineering', url: './webdev.html', tags: ['web', 'development', 'software', 'scaling', 'code', 'api', 'systems'], type: 'Service' },
        { title: 'Automotive Diagnostics', url: './mechanic.html', tags: ['mechanic', 'car', 'tuning', 'fleet', 'engine', 'diagnostics', 'automotive'], type: 'Service' },
        { title: 'Carpentry', url: './carpentry.html', tags: ['wood', 'construction', 'structures', 'wellness', 'building', 'shed'], type: 'Service' },
        { title: 'Fightnet', url: './fightnet.html', tags: ['secure', 'network', 'private', 'classified', 'wifi', 'offline'], type: 'Project' },
        { title: 'Personnel Resume', url: './resume.html', tags: ['david', 'breaux', 'resume', 'skills', 'experience', 'personnel', 'history'], type: 'Company' },
        { title: 'Investors', url: './investor.html', tags: ['invest', 'deck', 'portfolio', 'financials', 'pitch'], type: 'Company' },
        { title: 'Contact Operations', url: './contact.html', tags: ['contact', 'email', 'message', 'inquiry', 'form'], type: 'Company' },
        { title: 'Home', url: './index.html', tags: ['home', 'main', 'landing'], type: 'Company' },
        { title: 'Project Scale-Out', url: './index.html', tags: ['scale', 'enterprise', 'architecture', 'software'], type: 'Highlight' },
        { title: 'Digital Transformation', url: './index.html', tags: ['transformation', 'full-stack', 'web', 'systems'], type: 'Highlight' }
    ];

    const toggleSearch = (show) => {
        if (show) {
            searchModal.classList.remove('hidden');
            setTimeout(() => {
                searchModal.classList.remove('opacity-0');
                searchInput.focus();
            }, 10);
            document.body.style.overflow = 'hidden';
        } else {
            searchModal.classList.add('opacity-0');
            setTimeout(() => {
                searchModal.classList.add('hidden');
                searchInput.value = '';
                searchResults.innerHTML = '<div class="p-8 text-center text-neutral-500 text-sm flex flex-col items-center justify-center gap-3"><svg class="h-12 w-12 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Type to start searching...</span><span class="text-xs border border-neutral-800 px-2 py-1 rounded-sm mt-2">Cmd / Ctrl + K</span></div>';
            }, 200);
            document.body.style.overflow = '';
        }
    };

    searchBtns.forEach(btn => btn.addEventListener('click', () => toggleSearch(true)));
    
    if(closeSearchBtn) {
        closeSearchBtn.addEventListener('click', () => toggleSearch(false));
    }
    
    if(searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) toggleSearch(false);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !searchModal.classList.contains('hidden')) {
            toggleSearch(false);
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearch(true);
        }
    });

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (!query) {
                searchResults.innerHTML = '<div class="p-8 text-center text-neutral-500 text-sm flex flex-col items-center justify-center gap-3"><svg class="h-12 w-12 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>Type to start searching...</span><span class="text-xs border border-neutral-800 px-2 py-1 rounded-sm mt-2">Cmd / Ctrl + K</span></div>';
                return;
            }

            const results = searchData.filter(item => {
                return item.title.toLowerCase().includes(query) || 
                       item.tags.some(tag => tag.includes(query)) ||
                       item.type.toLowerCase().includes(query);
            });

            if (results.length === 0) {
                searchResults.innerHTML = '<div class="p-8 text-center text-neutral-500 text-sm">No results found for "<span class="text-white">' + query + '</span>"</div>';
                return;
            }

            searchResults.innerHTML = results.map(item => `
                <a href="${item.url}" class="block p-4 hover:bg-neutral-800 border-b border-neutral-800/50 last:border-0 transition-colors">
                    <div class="flex justify-between items-center">
                        <span class="text-white font-bold tracking-wide">${item.title}</span>
                        <span class="text-xs uppercase tracking-widest text-blue-500 border border-blue-900 bg-blue-950/20 px-2 py-1 rounded-sm">${item.type}</span>
                    </div>
                </a>
            `).join('');
        });
    }
});