const announcementState = {
  all: [],
  category: "all"
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

    const featuredAnnouncement =
      announcements.find(item => item.featured) || announcements[0];

    featuredContainer.innerHTML =
      announcementCard(featuredAnnouncement, true);

    announcementStrip.innerHTML = announcements
      .filter(item => item._id !== featuredAnnouncement._id)
      .slice(0, 3)
      .map(item => announcementCard(item))
      .join("");
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
