(() => {
  const header = document.querySelector(".topbar");
  const mobileNav = document.querySelector(".mobile-nav");
  if (!header || !mobileNav) return;

  const menuButton = document.createElement("button");
  menuButton.className = "mobile-menu-btn";
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", "Open navigation menu");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
    <b>MENU</b>
  `;

  header.appendChild(menuButton);

  function closeMenu() {
    header.classList.remove("mobile-menu-open");
    menuButton.setAttribute("aria-expanded", "false");
  }

  menuButton.addEventListener("click", event => {
    event.stopPropagation();
    const opening = !header.classList.contains("mobile-menu-open");
    header.classList.toggle("mobile-menu-open", opening);
    menuButton.setAttribute("aria-expanded", String(opening));
    header.classList.remove("nav-hidden");
  });

  document.addEventListener("click", event => {
    if (!header.contains(event.target)) closeMenu();
  });

  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      closeMenu();

      // Anchor links should clear the screen after navigating to their section.
      if (link.hash) {
        setTimeout(() => header.classList.add("nav-hidden"), 260);
      }
    });
  });

  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    if (window.innerWidth > 1100) {
      header.classList.remove("nav-hidden", "mobile-menu-open");
      lastScrollY = window.scrollY;
      ticking = false;
      return;
    }

    const currentY = window.scrollY;
    const difference = currentY - lastScrollY;

    if (currentY < 30) {
      header.classList.remove("nav-hidden");
    } else if (difference > 8 && !header.classList.contains("mobile-menu-open")) {
      header.classList.add("nav-hidden");
    } else if (difference < -8) {
      header.classList.remove("nav-hidden");
    }

    lastScrollY = currentY;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMenu();
      header.classList.remove("nav-hidden");
    }
  });
})();
