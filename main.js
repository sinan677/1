document.addEventListener("DOMContentLoaded", () => {

  /* ============ NAVBAR: scroll state + mobile toggle ============ */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  const onScrollNav = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  navToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
    const isOpen = navbar.classList.contains("open");
    navToggle.setAttribute("aria-label", isOpen ? "Menüyü kapat" : "Menüyü aç");
  });

  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (e) => {
      // don't close menu when tapping a dropdown parent toggle on mobile
      if (link.parentElement.classList.contains("has-dropdown") && window.innerWidth <= 860) {
        e.preventDefault();
        link.parentElement.classList.toggle("open");
        return;
      }
      navbar.classList.remove("open");
    });
  });

  /* ============ REVEAL ON SCROLL ============ */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============ HERO STAT COUNTERS ============ */
  const statNums = document.querySelectorAll(".stat-num");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("tr-TR");
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("tr-TR");
    };
    requestAnimationFrame(step);
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNums.forEach(el => statObserver.observe(el));

  /* ============ GRAFT DENSITY CANVAS (signature hero visual) ============ */
  const canvas = document.getElementById("graftCanvas");
  const ctx = canvas.getContext("2d");
  let dots = [];
  let w, h, dpr;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.floor(w / 34);
    const rows = Math.floor(h / 34);
    const cx = cols / 2;
    const cy = rows / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
        // density falls off toward edges — like a graft map converging at hairline apex
        if (Math.random() > dist * 0.9) {
          dots.push({
            x: x * 34 + 17 + (Math.random() * 10 - 5),
            y: y * 34 + 17 + (Math.random() * 10 - 5),
            r: Math.random() * 1.1 + 0.6,
            baseAlpha: (1 - dist) * 0.55 + 0.08,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.5
          });
        }
      }
    }
  }

  let t = 0;
  let rafId;
  function drawDots() {
    t += 0.012;
    ctx.clearRect(0, 0, w, h);
    dots.forEach(d => {
      const flicker = Math.sin(t * d.speed + d.phase) * 0.25 + 0.75;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,166,100,${(d.baseAlpha * flicker).toFixed(3)})`;
      ctx.fill();
    });
    rafId = requestAnimationFrame(drawDots);
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas) {
    resizeCanvas();
    if (!prefersReducedMotion) {
      drawDots();
    } else {
      // static single frame for reduced motion
      ctx.clearRect(0, 0, w, h);
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,166,100,${d.baseAlpha})`;
        ctx.fill();
      });
    }
    let resizeTO;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTO);
      resizeTO = setTimeout(resizeCanvas, 150);
    });
  }

  /* ============ BEFORE / AFTER SLIDER ============ */
  const baSlider = document.getElementById("baSlider");
  const baBeforeWrap = document.getElementById("baBeforeWrap");
  const baHandle = document.getElementById("baHandle");

  if (baSlider) {
    let dragging = false;

    const setPosition = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(4, Math.min(96, pct));
      baBeforeWrap.style.width = pct + "%";
      baHandle.style.left = pct + "%";
      const beforeImg = baBeforeWrap.querySelector(".ba-before");
      beforeImg.style.width = rect.width + "px";
    };

    const startDrag = () => { dragging = true; };
    const stopDrag = () => { dragging = false; };
    const onMove = (clientX) => { if (dragging) setPosition(clientX); };

    baHandle.addEventListener("mousedown", startDrag);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", (e) => onMove(e.clientX));

    baHandle.addEventListener("touchstart", startDrag, { passive: true });
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("touchmove", (e) => {
      if (dragging && e.touches[0]) onMove(e.touches[0].clientX);
    }, { passive: true });

    baSlider.addEventListener("click", (e) => setPosition(e.clientX));

    // init width of before image to match container
    const initBaWidth = () => {
      const rect = baSlider.getBoundingClientRect();
      baBeforeWrap.querySelector(".ba-before").style.width = rect.width + "px";
    };
    window.addEventListener("resize", initBaWidth);
    initBaWidth();
  }

  /* ============ CONTACT FORM VALIDATION ============ */
  const form = document.getElementById("contactForm");
  if (form) {
    const requiredFields = form.querySelectorAll("[required]");

    const validateField = (field) => {
      const wrapper = field.closest(".field");
      const valid = field.checkValidity();
      wrapper.classList.toggle("invalid", !valid);
      return valid;
    };

    requiredFields.forEach(field => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.closest(".field").classList.contains("invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let allValid = true;
      requiredFields.forEach(field => {
        if (!validateField(field)) allValid = false;
      });

      if (!allValid) {
        const firstInvalid = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const btn = form.querySelector(".btn-text");
      const originalText = btn.textContent;
      btn.textContent = "Gönderiliyor...";

      setTimeout(() => {
        btn.textContent = "Talebiniz Alındı ✓";
        form.reset();
        requiredFields.forEach(f => f.closest(".field").classList.remove("invalid"));
        setTimeout(() => { btn.textContent = originalText; }, 3200);
      }, 900);
    });
  }

  /* ============ BACK TO TOP ============ */
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("visible", window.scrollY > 700);
  }, { passive: true });
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ============ FAQ ACCORDION ============ */
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(el => el.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  /* ============ VIDEO LIGHTBOX ============
     Each .video-card carries data-video-src (path to an mp4 you add under
     assets/videos/) and data-video-title. Leave data-video-src empty to
     show a friendly "coming soon" placeholder instead of a broken player. */
  const videoLightbox = document.getElementById("videoLightbox");
  const videoLightboxInner = document.getElementById("videoLightboxInner");
  const videoLightboxClose = document.getElementById("videoLightboxClose");

  document.querySelectorAll(".video-card").forEach(card => {
    card.addEventListener("click", () => {
      const src = card.dataset.videoSrc;
      const title = card.dataset.videoTitle || "Video";
      videoLightboxInner.innerHTML = "";

      if (src && src.trim() !== "") {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.setAttribute("aria-label", title);
        videoLightboxInner.appendChild(video);
      } else {
        const empty = document.createElement("div");
        empty.className = "video-lightbox-empty";
        empty.innerHTML = `<p><strong>${title}</strong></p><p>Bu video henüz eklenmedi. Kendi videonuzu <code>assets/videos/</code> klasörüne koyup ilgili kartın <code>data-video-src</code> özniteliğine dosya adını yazın.</p>`;
        videoLightboxInner.appendChild(empty);
      }
      videoLightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    videoLightbox.classList.remove("open");
    videoLightboxInner.innerHTML = "";
    document.body.style.overflow = "";
  };
  videoLightboxClose.addEventListener("click", closeLightbox);
  videoLightbox.addEventListener("click", (e) => {
    if (e.target === videoLightbox) closeLightbox();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoLightbox.classList.contains("open")) closeLightbox();
  });

  /* ============ MULTI-CHANNEL SUPPORT WIDGET ============ */
  const supportWidget = document.getElementById("supportWidget");
  const supportToggle = document.getElementById("supportToggle");
  if (supportToggle) {
    supportToggle.addEventListener("click", () => {
      supportWidget.classList.toggle("open");
    });
  }

});
