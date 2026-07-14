const announcementState = {
  all: [],
  category: "all",
  homepageItems: [],
  homepageIndex: 0,
  homepageTimer: null
};

function announcementEscape(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function announcementDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function announcementCard(item, featured = false) {
  const hasImage = Boolean(item.imageUrl);

  const image = hasImage
    ? `<div class="announcement-image"><img src="${item.imageUrl}" alt=""></div>`
    : "";

  const button =
    item.buttonText && item.buttonUrl
      ? `<a class="announcement-button" href="${item.buttonUrl}" target="_blank" rel="noreferrer">
           ${announcementEscape(item.buttonText)} →
         </a>`
      : "";

  const categoryMeta = {
    stream: { icon: "🎮", label: "STREAM UPDATE" },
    announcement: { icon: "📢", label: "ANNOUNCEMENT" },
    personal: { icon: "👤", label: "PERSONAL" },
    schedule: { icon: "📅", label: "SCHEDULE" },
    community: { icon: "💜", label: "COMMUNITY" },
    website: { icon: "🌐", label: "WEBSITE UPDATE" },
    event: { icon: "🎉", label: "EVENT" },
  };

  const category = categoryMeta[item.category] || {
    icon: "📢",
    label: String(item.category || "ANNOUNCEMENT").toUpperCase(),
  };

  const author = item.author || "Arnimane";
  const signoff =
    item.signoffStyle === "dash"
      ? `- ${author}`
      : `With Chaos, ${author}`;

  const priority = ["normal", "important", "critical"].includes(item.priority)
    ? item.priority
    : "normal";

  return `
    <article class="announcement-card ${featured ? "featured" : ""} ${hasImage ? "has-image" : "no-image"} priority-${priority}">
      ${image}

      <div class="announcement-content">
        <div class="announcement-meta">
          <span class="announcement-category category-${announcementEscape(item.category || "announcement")}">
            <span class="announcement-category-icon" aria-hidden="true">${category.icon}</span>
            ${announcementEscape(category.label)}
          </span>

          ${
            priority !== "normal"
              ? `<span class="announcement-priority">${priority === "critical" ? "CRITICAL" : "IMPORTANT"}</span>`
              : ""
          }

          <time datetime="${item.publishedAt}">
            ${announcementDate(item.publishedAt)}
          </time>
        </div>

        <h3>${announcementEscape(item.title)}</h3>
        <p>${announcementEscape(item.summary || "")}</p>

        <div class="announcement-footer">
          <p class="announcement-author">${announcementEscape(signoff)}</p>
          ${button}
        </div>
      </div>
    </article>
  `;
}

async function fetchAnnouncements() {
  const response = await fetch("/api/announcements");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to load announcements.");
  }

  return data.announcements || [];
}

function renderHomepageAnnouncement() {
  const featuredContainer = document.getElementById("featuredAnnouncement");
  const counter = document.getElementById("announcementCounter");
  const dots = document.getElementById("announcementDots");
  const previousButton = document.getElementById("announcementPrev");
  const nextButton = document.getElementById("announcementNext");

  if (!featuredContainer) return;

  const items = announcementState.homepageItems;
  const total = items.length;

  if (!total) return;

  announcementState.homepageIndex =
    ((announcementState.homepageIndex % total) + total) % total;

  const currentItem = items[announcementState.homepageIndex];

  featuredContainer.classList.remove("announcement-changing");
  void featuredContainer.offsetWidth;
  featuredContainer.classList.add("announcement-changing");
  featuredContainer.innerHTML = announcementCard(currentItem, true);

  if (counter) {
    counter.textContent = `${announcementState.homepageIndex + 1} / ${total}`;
  }

  if (dots) {
    dots.innerHTML = items.map((item, index) => `
      <button
        class="announcement-dot ${index === announcementState.homepageIndex ? "active" : ""}"
        type="button"
        aria-label="Show announcement ${index + 1}"
        aria-current="${index === announcementState.homepageIndex ? "true" : "false"}"
        data-announcement-index="${index}"
      ></button>
    `).join("");

    dots.querySelectorAll(".announcement-dot").forEach(button => {
      button.addEventListener("click", () => {
        announcementState.homepageIndex =
          Number(button.dataset.announcementIndex || 0);
        renderHomepageAnnouncement();
        restartHomepageAnnouncementTimer();
      });
    });
  }

  const disableControls = total <= 1;

  if (previousButton) {
    previousButton.disabled = disableControls;
    previousButton.hidden = disableControls;
  }

  if (nextButton) {
    nextButton.disabled = disableControls;
    nextButton.hidden = disableControls;
  }
}

function changeHomepageAnnouncement(direction) {
  if (!announcementState.homepageItems.length) return;

  announcementState.homepageIndex += direction;
  renderHomepageAnnouncement();
  restartHomepageAnnouncementTimer();
}

function restartHomepageAnnouncementTimer() {
  // Auto-advance disabled by request.
  window.clearInterval(announcementState.homepageTimer);
}

function setupHomepageAnnouncementControls() {
  const previousButton = document.getElementById("announcementPrev");
  const nextButton = document.getElementById("announcementNext");
  const carousel = document.querySelector(".homepage-announcement-carousel");

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      changeHomepageAnnouncement(-1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      changeHomepageAnnouncement(1);
    });
  }

  if (carousel) {
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener("mouseenter", () => {
      window.clearInterval(announcementState.homepageTimer);
    });

    carousel.addEventListener("mouseleave", () => {
      restartHomepageAnnouncementTimer();
    });

    carousel.addEventListener("touchstart", event => {
      touchStartX = event.changedTouches[0]?.screenX || 0;
    }, {passive: true});

    carousel.addEventListener("touchend", event => {
      touchEndX = event.changedTouches[0]?.screenX || 0;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) < 45) return;

      changeHomepageAnnouncement(distance > 0 ? -1 : 1);
    }, {passive: true});
  }
}

async function loadHomepageAnnouncements() {
  const featuredContainer = document.getElementById("featuredAnnouncement");
  const announcementStrip = document.getElementById("announcementStrip");

  if (!featuredContainer || !announcementStrip) return;

  try {
    const announcements = await fetchAnnouncements();

    if (!announcements.length) {
      featuredContainer.innerHTML = `
        <article class="announcement-card featured no-image">
          <div class="announcement-content">
            <h3>No announcements yet</h3>
            <p>Your first published Sanity announcement will appear here automatically.</p>
          </div>
        </article>
      `;
      announcementStrip.innerHTML = "";
      return;
    }

    const featuredItem =
      announcements.find(item => item.featured) || announcements[0];

    announcementState.homepageItems = [
      featuredItem,
      ...announcements.filter(item => item._id !== featuredItem._id)
    ];

    announcementState.homepageIndex = 0;

    setupHomepageAnnouncementControls();
    renderHomepageAnnouncement();
    restartHomepageAnnouncementTimer();

    announcementStrip.innerHTML = "";
  } catch (error) {
    console.error("Homepage announcement error:", error);

    featuredContainer.innerHTML = `
      <article class="announcement-card featured no-image">
        <div class="announcement-content">
          <h3>Announcements could not load</h3>
          <p>Please refresh the page and try again.</p>
        </div>
      </article>
    `;
    announcementStrip.innerHTML = "";
  }
}

function renderNewsArchive() {
  const archiveContainer = document.getElementById("newsArchive");
  if (!archiveContainer) return;

  const filteredAnnouncements =
    announcementState.category === "all"
      ? announcementState.all
      : announcementState.all.filter(
          item => item.category === announcementState.category
        );

  archiveContainer.innerHTML = filteredAnnouncements.length
    ? filteredAnnouncements.map(item => announcementCard(item)).join("")
    : `
      <div class="panel empty-news">
        <h2>No announcements found</h2>
      </div>
    `;
}

async function loadNewsArchive() {
  const archiveContainer = document.getElementById("newsArchive");
  if (!archiveContainer) return;

  try {
    announcementState.all = await fetchAnnouncements();
    renderNewsArchive();

    document.querySelectorAll(".news-filter").forEach(button => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll(".news-filter")
          .forEach(item => item.classList.remove("active"));

        button.classList.add("active");
        announcementState.category = button.dataset.category || "all";
        renderNewsArchive();
      });
    });
  } catch (error) {
    console.error("News archive error:", error);

    archiveContainer.innerHTML = `
      <div class="panel empty-news">
        <h2>Announcements could not load</h2>
      </div>
    `;
  }
}

loadHomepageAnnouncements();
loadNewsArchive();
