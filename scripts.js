// Sidebar open/close (mobile) + active section highlighting + publication filters

(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".overlay");
  const menuBtn = document.querySelector(".menu-btn");

  function setMenu(open) {
    if (!sidebar || !menuBtn || !overlay) return;
    sidebar.setAttribute("data-open", open ? "true" : "false");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    overlay.hidden = !open;
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const isOpen = sidebar?.getAttribute("data-open") === "true";
      setMenu(!isOpen);
    });
  }
  if (overlay) overlay.addEventListener("click", () => setMenu(false));

  // Close menu when a nav link is clicked (mobile)
  document.querySelectorAll(".side-nav a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  // Active section highlighting
  const navLinks = Array.from(document.querySelectorAll(".side-nav a"));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const match = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", match);
    });
  };

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        // pick most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // Publications filtering (works if you add .pub-item with data-year/data-venue)
  const pubList = document.getElementById("pubList");
  const yearFilter = document.getElementById("yearFilter");
  const venueFilter = document.getElementById("venueFilter");
  const resetBtn = document.getElementById("resetFilters");
  const emptyState = document.getElementById("pub-empty");

  if (pubList && yearFilter && venueFilter) {
    const items = Array.from(pubList.querySelectorAll(".pub-item"));

    const years = Array.from(
      new Set(items.map((it) => it.getAttribute("data-year")).filter(Boolean))
    ).sort((a, b) => Number(b) - Number(a));

    const venues = Array.from(
      new Set(items.map((it) => it.getAttribute("data-venue")).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));

    years.forEach((y) => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearFilter.appendChild(opt);
    });

    venues.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      venueFilter.appendChild(opt);
    });

    function applyFilters() {
      const y = yearFilter.value;
      const v = venueFilter.value;

      let shown = 0;
      items.forEach((it) => {
        const matchYear = y === "all" || it.getAttribute("data-year") === y;
        const matchVenue = v === "all" || it.getAttribute("data-venue") === v;
        const show = matchYear && matchVenue;
        it.style.display = show ? "" : "none";
        if (show) shown += 1;
      });

      if (emptyState) emptyState.hidden = shown !== 0;
    }

    yearFilter.addEventListener("change", applyFilters);
    venueFilter.addEventListener("change", applyFilters);

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        yearFilter.value = "all";
        venueFilter.value = "all";
        applyFilters();
      });
    }

    applyFilters();
  }
})();
