/* --- THEME TOGGLE --- */
const themeToggle = document.getElementById("themeToggle");
const currentTheme = localStorage.getItem("theme") || "dark";
if (currentTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");
  if (theme === "light") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "☀️";
  }
  resizeCanvas();
});

/* --- MOBILE NAVIGATION --- */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

/* --- REVEAL ON SCROLL --- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

/* --- DYNAMIC WALLPAPER --- */
const canvas = document.getElementById("wallpaper");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let particles = [];
let animationFrame;
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";
  const count = Math.min(50, Math.floor(width / 20));

  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: Math.random() * 0.9 + 0.5,
    radius: isLight ? Math.random() * 6 + 4 : Math.random() * 3.5 + 1.5,
    alpha: Math.random() * 0.6 + 0.3,
    rotation: Math.random() * Math.PI,
    vRot: (Math.random() - 0.5) * 0.03,
  }));
}

function drawWallpaper() {
  ctx.clearRect(0, 0, width, height);
  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";

  particles.forEach((p) => {
    if (!reducedMotion) {
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.4;
      p.y += p.vy;
      p.rotation += p.vRot;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.alpha;

    if (isLight) {
      ctx.fillStyle = "#ff6392";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.radius, p.radius * 1.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        ctx.moveTo(-p.radius * 2.2, 0);
        ctx.lineTo(p.radius * 2.2, 0);
        ctx.rotate(Math.PI / 3);
      }
      ctx.stroke();
    }

    ctx.restore();
  });

  if (!reducedMotion) {
    animationFrame = requestAnimationFrame(drawWallpaper);
  }
}

resizeCanvas();
drawWallpaper();

window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawWallpaper();
});

/* --- CORRECTED VISITOR COUNTER LOGIC --- */
document.getElementById("year").textContent = new Date().getFullYear();

let visitors = localStorage.getItem("visitor_count");
if (!visitors) {
  visitors = 1482;
  localStorage.setItem("visitor_count", visitors);
}

// Increment only once per browser session using sessionStorage to prevent refresh inflation
if (!sessionStorage.getItem("visited_session")) {
  sessionStorage.setItem("visited_session", "true");
  visitors = parseInt(visitors) + 1;
  localStorage.setItem("visitor_count", visitors);
}

document.getElementById("visitorCount").textContent =
  Number(visitors).toLocaleString();
