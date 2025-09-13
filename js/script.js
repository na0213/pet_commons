// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive components
    initializeHeader();
    initializeHeroAnimations();
    initializeLineupSlider();
    initializeVoiceSlider();
    initializeModal();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeFormHandling();
});

// Header scroll effect
function initializeHeader() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

document.getElementById("menuToggle").addEventListener("click", function() {
  const nav = document.getElementById("mobileNav");
  nav.style.display = (nav.style.display === "block") ? "none" : "block";
});
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".side-nav a");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 現在のセクションに対応するリンクを探す
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, {
    threshold: 0.3 // セクションが60%見えたらアクティブ
  });

  sections.forEach(section => observer.observe(section));
});

// スクロール制御
document.querySelectorAll('.side-nav a, .nav-list a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // デフォルトのジャンプを止める
    const targetId = this.getAttribute('href').slice(1); // #を除去
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // スマホ時はメニューを閉じる
    const mobileNav = document.getElementById("mobileNav");
    if (mobileNav && mobileNav.style.display === "block") {
      mobileNav.style.display = "none";
    }
  });
});


// Hero section animations
function initializeHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    // Animate hero content on load
    setTimeout(() => {
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 500);

    // Stagger animations for hero elements
    setTimeout(() => {
        if (heroTitle) heroTitle.classList.add('fade-in-up');
    }, 700);

    setTimeout(() => {
        if (heroSubtitle) heroSubtitle.classList.add('fade-in-up');
    }, 900);

    setTimeout(() => {
        if (heroCta) heroCta.classList.add('fade-in-up');
    }, 1100);
}

// Lineup slider functionality
function initializeLineupSlider() {
    const lineupGrid = document.querySelector('.lineup-grid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!lineupGrid || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = document.querySelectorAll('.lineup-card');
    const totalCards = cards.length;
    const cardsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    const maxIndex = Math.max(0, totalCards - cardsPerView);

    // Update slider position
    function updateSlider() {
        const translateX = -(currentIndex * (100 / cardsPerView));
        lineupGrid.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    }

    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // Next button
    nextBtn.addEventListener('click', function() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    });

    // Initialize slider
    updateSlider();

    // Update on window resize
    window.addEventListener('resize', function() {
        const newCardsPerView = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
        if (newCardsPerView !== cardsPerView) {
            currentIndex = 0;
            updateSlider();
        }
    });
}

// Voice slider functionality
// === Voices slider ===
(function () {
  const track = document.getElementById('voiceTrack');
  const prev  = document.querySelector('#voiceCarousel .prev');
  const next  = document.querySelector('#voiceCarousel .next');
  if (!track || !prev || !next) return;

  const getStep = () => {
    const card = track.querySelector('.voice-card');
    if (!card) return 0;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 16);
    return card.getBoundingClientRect().width + gap;
  };

  prev.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    track.scrollBy({ left:  getStep(), behavior: 'smooth' });
  });

  // キーボード操作（左右キー）
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev.click();
    if (e.key === 'ArrowRight') next.click();
  });
})();

// ===== Voices slider と足跡ナビの同期 =====
(function () {
  const track = document.getElementById('voiceTrack');
  const paws = document.querySelectorAll('#voicePaws .paw');
  const cards = track?.querySelectorAll('.voice-card') || [];
  if (!track || paws.length === 0 || cards.length === 0) return;

  function updatePaws() {
    let closestIndex = 0;
    let minDist = Infinity;
    const trackRect = track.getBoundingClientRect();

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.abs(
        rect.left + rect.width / 2 - (trackRect.left + trackRect.width / 2)
      );
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    paws.forEach((paw, i) => {
      paw.classList.toggle('active', i === closestIndex);
    });
  }

  track.addEventListener('scroll', () => {
    requestAnimationFrame(updatePaws);
  });

  updatePaws(); // 初期化
})();

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('modal');
    const popupBtns = document.querySelectorAll('.popup-btn');
    const closeBtn = document.querySelector('.close');
    
    if (!modal) return;

    // Open modal
    popupBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Animate modal in
            setTimeout(() => {
                modal.querySelector('.modal-content').style.transform = 'scale(1)';
                modal.querySelector('.modal-content').style.opacity = '1';
            }, 10);
        });
    });

    // Close modal
    function closeModal() {
        modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
        modal.querySelector('.modal-content').style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Initialize modal styles
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        modalContent.style.transition = 'all 0.3s ease';
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .about-item,
        .lineup-card,
        .features-main,
        .feature-item,
        .voice-slide,
        .timeline-item,
        .section-title
    `);

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form handling (for future contact forms)
function initializeFormHandling() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.querySelector('.cta-text').textContent;
            this.querySelector('.cta-text').textContent = '読み込み中...';
            this.style.pointerEvents = 'none';
            
            // Simulate form submission or redirect
            setTimeout(() => {
                this.querySelector('.cta-text').textContent = originalText;
                this.style.pointerEvents = 'auto';
                
                // Here you would typically redirect to a contact form or handle the action
                console.log('CTA button clicked - redirect to contact form');
            }, 1000);
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimized scroll handler
const handleScroll = debounce(() => {
    // Additional scroll-based animations can be added here
    const scrollTop = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-bg-img');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrollTop * speed}px)`;
    });
}, 10);

window.addEventListener('scroll', handleScroll);

// Mobile menu toggle (for future mobile navigation)
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
initializeLazyLoading();

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Resize handler for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Re-initialize components that need responsive updates
    initializeLineupSlider();
}, 250));

// Add loading class to body for initial animations
document.body.classList.add('loading');

window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
});

// Console welcome message
console.log(`
🏔️ SANU Dog Friendly Website
🐕 Welcome to the console!
🌟 Built with HTML, CSS, and JavaScript
`);

// ===== Paw Walker: 右上→左・左→右 とジグザグに“ペタペタ”歩く =====
(function () {
  const walker = document.querySelector('.paw-walker');
  if (!walker) return;

  // --- 設定（お好みで調整） ---
  const STEP_MS = 820;         // 一歩ごとの間隔（小さいほど速く歩く）
  const SIZE_PX = 20;          // 足跡サイズ
  const VH_PER_SEG = 32;       // セグメント1本あたりの縦移動量（vh）
  const LEFT_LIM = 18;         // 左端(%)
  const RIGHT_LIM = 82;        // 右端(%)
  const FOOT_OFFSET_VW = 1.8;  // 足の左右の開き（vw）
  const FADE_AFTER_MS = 1400;  // 残像を薄くするまでの時間
  const CLEAN_AFTER_MS = 4200; // DOMから除去するまでの時間

  // 内部状態
  let seg = 0;            // 0,1,2… ジグザグの区間
  let tInSeg = 0;         // セグメント内の進捗 0→1
  let lastStampTime = 0;  // 最後に足跡を置いた時刻
  let isRightNext = true; // 次に置くのが右足？
  let pawEnabled = true; // 足跡を表示するかどうかのフラグ

  // ビューポート高さに対する現在のy(vh)
  let yvh = -6; // 画面外ちょい上から開始

  // ボタン制御
  const toggleBtn = document.getElementById('togglePawBtn');
  const pawLabel = toggleBtn?.querySelector('.paw-label');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      pawEnabled = !pawEnabled;
      walker.style.display = pawEnabled ? 'block' : 'none';
      if (!pawEnabled) lastStampTime = 0;

      // ラベル更新
      if (pawLabel) pawLabel.textContent = pawEnabled ? 'OFF' : 'ON';
    });
  }

  // ユーティリティ：現在セグメントの左右端を決める
  function segBounds(segIndex) {
    const goingLeft = (segIndex % 2 === 0); // 偶数セグメントは右→左
    return goingLeft
      ? { fromX: RIGHT_LIM, toX: LEFT_LIM, goingLeft: true }
      : { fromX: LEFT_LIM,  toX: RIGHT_LIM, goingLeft: false };
  }

  // 線形補間
  const lerp = (a,b,t) => a + (b-a) * t;

  // 1歩ぶんの足跡を打つ
  function placeFootprint({ xvw, yvh, goingLeft, isRight }) {
    const el = document.createElement('span');
    el.className = 'paw-stamp';
    el.style.setProperty('--size', SIZE_PX + 'px');

    // 進行方向に合わせて角度を変える（↙ / ↘）
    // 少しだけ右足・左足で角度差をつけると“踏み出し”感が出る
    const rot = goingLeft
      ? (isRight ? 228 : 200)   // 左へ進むとき：↙
      : (isRight ? 152 : 164);  // 右へ進むとき：↘
    el.style.setProperty('--rot', rot + 'deg');

    // 進行方向に対して横（左右）に少しオフセットして左右の足を分ける
    // goingLeft のときは “右足=進行線より右側 / 左足=左側” にずらす
    const side = (isRight ? 1 : -1) * FOOT_OFFSET_VW * (goingLeft ? 1 : -1);
    const xWithFoot = xvw + side;

    // 位置を transform で指定（パフォーマンス安定）
    el.style.transform = `translate(calc(${xWithFoot}vw), ${yvh}vh) translate(-50%,-50%) rotate(${rot}deg)`;

    walker.appendChild(el);

    // 残像がうるさければ自然に薄くする
    setTimeout(() => { el.style.opacity = 0.08; }, FADE_AFTER_MS);
    setTimeout(() => { el.remove(); }, CLEAN_AFTER_MS);
  }

  // アニメーションループ：一定間隔で足跡を置きつつ、下へ降りる
  function tick(now) {
    requestAnimationFrame(tick);

    // まだ最初のフレームなら初期化
    if (!lastStampTime) lastStampTime = now;

    // 現在のセグメントの左右・向き
    const { fromX, toX, goingLeft } = segBounds(seg);

    // セグメントの縦位置レンジ
    const segStartY = -6 + seg * VH_PER_SEG;
    const segEndY   = segStartY + VH_PER_SEG;

    // 1フレーム分進める（固定速度感を出したいので時間ベース）
    // ここでは“1歩=STEP_MS”を基準に、セグメント内進捗も一定で進める
    const SEG_MS = STEP_MS * 4; // だいたい4歩で1セグメント進む想定
    const dt = Math.min(32, (now - (tick._lastNow || now))); // フレーム間隔
    tick._lastNow = now;
    tInSeg += dt / SEG_MS;
    if (tInSeg >= 1) {
      tInSeg = 0;
      seg += 1;
    }

    // 現在位置（x:vw, y:vh）
    const xvw = lerp(fromX, toX, tInSeg);
    yvh = lerp(segStartY, segEndY, tInSeg);

    // 画面を抜けたらリセット（上から再スタート）
    if (yvh > 112) {
      seg = 0;
      tInSeg = 0;
      yvh = -6;
      isRightNext = true;
    }

    // 一歩ごとにスタンプを置く
    if (now - lastStampTime >= STEP_MS) {
      placeFootprint({
        xvw,
        yvh,
        goingLeft,
        isRight: isRightNext
      });
      isRightNext = !isRightNext;
      lastStampTime = now;
    }
  }

  requestAnimationFrame(tick);
})();
