function esc(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function durationLabel(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function compactViews(value) {
  if (value === undefined || value === null || value === "") return "";

  return Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(Number(value));
}

function videoCard(video, isShort = false) {
  const viewLabel =
    video.viewCount !== undefined && video.viewCount !== null
      ? `<span>${compactViews(video.viewCount)} views</span>`
      : "";

  const duration = isShort
    ? ""
    : `<span class="duration">${durationLabel(video.durationSeconds)}</span>`;

  return `
    <article class="${isShort ? "short-card" : "video-card"} premium-content-card">
      <a href="${video.url}" target="_blank" rel="noreferrer">
        <div class="thumb">
          <img src="${video.thumbnail}" alt="">
          ${duration}

          <div class="watch-overlay">
            <span class="watch-overlay-icon">▶</span>
            <strong>WATCH NOW</strong>
          </div>
        </div>

        <h3>${esc(video.title)}</h3>

        <div class="content-card-meta">
          <small>${formatDate(video.publishedAt)}</small>
          ${viewLabel}
        </div>
      </a>
    </article>
  `;
}

async function loadPageUploads() {
  const videosGrid = document.getElementById("videosGrid");
  const shortsGrid = document.getElementById("shortsGrid");

  if (!videosGrid && !shortsGrid) return;

  try {
    const response = await fetch("/api/youtube");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not load YouTube uploads.");
    }

    if (videosGrid) {
      videosGrid.innerHTML = (data.videos || [])
        .map(video => videoCard(video, false))
        .join("");
    }

    if (shortsGrid) {
      shortsGrid.innerHTML = (data.shorts || [])
        .map(video => videoCard(video, true))
        .join("");
    }
  } catch (error) {
    console.error("YouTube page loading error:", error);

    if (videosGrid) {
      videosGrid.innerHTML =
        "<p class='loading'>Videos could not load. Please refresh and try again.</p>";
    }

    if (shortsGrid) {
      shortsGrid.innerHTML =
        "<p class='loading'>Shorts could not load. Please refresh and try again.</p>";
    }
  }
}

loadPageUploads();
