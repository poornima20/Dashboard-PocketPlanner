/* ==========================================
     0. Template Data
  ========================================== */

console.log("SCRIPT VERSION 1.1 - 11 July 2026");

/* ==========================================
   CLEAN INVALID PLANNER IDS
========================================== */

const VALID_PLANNERS = [
  "10minute",
  "focusgrid",
  "mediahistory",
  "monthlygrid",
  "studylog",
  "tasklog",
  "templates",
  "waterlog",
  "weeklog",
  "weeklyspread",
  "yearlylog",
  "yearoverview",
  "cornellnotes",
  "spendlog",
];

function cleanPocketPlannerLocalStorage() {
  Object.keys(localStorage).forEach((key) => {
    if (!key.startsWith("fullmoon.pocketplanner.")) return;

    const plannerName = key.replace("fullmoon.pocketplanner.", "");

    if (!VALID_PLANNERS.includes(plannerName)) {
      console.log("Removing old local key:", key);

      localStorage.removeItem(key);
    }
  });
}

const templatesData = {
  dated: {
    "Daily Planner": [
      {
        name: "Focus Grid",
        image: "./Icons/focusgrid.png",
        url: "https://poornima20.github.io/PocketPlanner-DailyPlanner-FocusGrid/",
      },
      {
        name: "10-Minute Planner",
        image: "./Icons/10minuteplanner.png",
        url: "https://poornima20.github.io/PocketPlanner-DailyPlanner-10MinutePlanner/",
      },
    ],

    "Weekly Planner": [
      {
        name: "Week Log",
        image: "./Icons/weeklog.png",
        url: "https://poornima20.github.io/PocketPlanner-WeeklyPlaner-WeekLog/",
      },
      {
        name: "Weekly Spread",
        image: "./Icons/weeklyspread.png",
        url: "https://poornima20.github.io/PocketPlanner-WeeklyPlanner-WeeklySpread/",
      },
    ],

    "Monthly Planner": [
      {
        name: "Task Log",
        image: "./Icons/tasklog.png",
        url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-TaskLog/",
      },
      {
        name: "Monthly Grid",
        image: "./Icons/monthlygrid.png",
        url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-MonthlyGrid/",
      },
    ],

    "Yearly Planner": [
      {
        name: "Time Progress",
        image: "./Icons/timeprogress.png",
        url: "https://poornima20.github.io/PocketPlanner-YearlyPlanner-TimeProgress/",
      },
      {
        name: "Year Overview",
        image: "./Icons/yearoverview.png",
        url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-YearOverview/",
      },
      {
        name: "Yearly Log",
        image: "./Icons/yearlylog.png",
        url: "https://poornima20.github.io/PocketPlanner-YearlyPlanner-YearlyLog/",
      },
    ],

    Tracker: [
      {
        name: "Study Log",
        image: "./Icons/studylog.png",
        url: "https://poornima20.github.io/PocketPlanner-Tracker-StudyLog/",
      },
      {
        name: "Spend Log",
        image: "./Icons/spendlog.png",
        url: "https://poornima20.github.io/PocketPlanner-Tracker-SpendLog/",
      },
      {
        name: "Water Log",
        image: "./Icons/waterlog.png",
        url: "https://poornima20.github.io/PocketPlanner-Tracker-WaterLog/",
      },
    ],
  },

  undated: {
    Goals: [
      // {
      //   name: "Portfolio",
      //   image: "./Icons/cornellnotes.png",
      //   url: "https://poornima20.github.io/Fullmoon/",
      // },
    ],

    Notes: [
      {
        name: "Cornell Notes",
        image: "./Icons/cornellnotes.png",
        url: "https://poornima20.github.io/PocketPlanner-Notes-Cornell-Notes//",
      },
    ],

    Entertainment: [
      {
        name: "Bookshelf",
        image: "./Icons/bookshelf.png",
        url: "https://poornima20.github.io/PocketPlanner-Entertainment-Bookshelf/",
      },

      {
        name: "Media History",
        image: "./Icons/mediahistory.png",
        url: "https://poornima20.github.io/PocketPlanner-Entertainment-MediaHistory/",
      },
    ],

    Music: [
      {
        name: "Arirang",
        image: "./Icons/arirang.png",
        url: "https://poornima20.github.io/PocketPlanner-Music-Arirang/",
      },
    ],
  },
};

const categoryMeta = {
  "Daily Planner": {
    icon: "calendar-days",
    desc: "Plan your day with clarity and focus",
  },
  "Weekly Planner": {
    icon: "calendar",
    desc: "Organize your entire week efficiently",
  },
  "Monthly Planner": {
    icon: "calendar-range",
    desc: "Track long-term goals and events",
  },
  "Yearly Planner": {
    icon: "calendar-clock",
    desc: "Visualize your year at a glance",
  },
  Tracker: {
    icon: "activity",
    desc: "Track habits, mood, and progress",
  },
  Goals: {
    icon: "target",
    desc: "Define and crush your goals",
  },
  Notes: {
    icon: "notebook",
    desc: "Capture thoughts and ideas quickly",
  },
  Entertainment: {
    icon: "film",
    desc: "Track shows, movies, and fun stuff",
  },
  Music: {
    icon: "music",
    desc: "Organize playlists and inspiration",
  },
};
const savedTemplates = JSON.parse(
  localStorage.getItem("fullmoon.pocketplanner.templates"),
);

let myTemplates = Array.isArray(savedTemplates?.data)
  ? savedTemplates.data
  : [];

let currentView = "grid";
let stickyHandler = null;

/* ==========================================
    Reload templates from Storage
  ========================================== */
function reloadTemplatesFromStorage() {
  const savedTemplates = JSON.parse(
    localStorage.getItem("fullmoon.pocketplanner.templates"),
  );

  myTemplates = Array.isArray(savedTemplates?.data) ? savedTemplates.data : [];
}

window.refreshPlannerState = function () {
  reloadTemplatesFromStorage();
  updatePlannerCounter();

  const activePage =
    document.querySelector(".nav-item.active")?.dataset.page || "all";

  const pageMap = {
    all: () => renderMySpace(currentView),
    dated: () => renderFilteredTemplates("dated"),
    undated: () => renderFilteredTemplates("undated"),
    templates: () => renderTemplates(),
  };

  document.getElementById("content").innerHTML = pageMap[activePage]();

  setTimeout(() => {
    lucide.createIcons();

    setupAllCardActions();

    setupViewToggle();
  }, 0);
};

/* ==========================================
     Saved Templates Structure in localStorage:
  ========================================== */

function saveTemplates() {
  localStorage.setItem(
    "fullmoon.pocketplanner.templates",

    JSON.stringify({
      data: myTemplates,
      updatedAt: Date.now(),
    }),
  );

  notifyDashboardSync();
}

function notifyDashboardSync() {
  if (window.parent !== window) {
    window.parent.postMessage(
      {
        type: "plannerChanged",
        planner: "fullmoon.pocketplanner.templates",
      },
      "*",
    );
  }
}

/* ==========================================
     5. Service Worker Registration
  ========================================== */
if ("serviceWorker" in navigator) {
  // ❌ Disable SW on localhost
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    console.log("SW disabled on localhost");

    // also remove any existing SW
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    });
  } else {
    // ✅ Enable only in production
    navigator.serviceWorker
      .register("sw.js")
      .then(() => console.log("SW registered"))
      .catch((err) => console.log("SW error", err));
  }
}

/* ==========================================
     1. Render Data
  ========================================== */

document.addEventListener("DOMContentLoaded", () => {
  // one time old planner local cleanup
  cleanPocketPlannerLocalStorage();

  lucide.createIcons();

  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("toggleSidebar");
  const content = document.getElementById("content");

  const navItems = document.querySelectorAll(".nav-item");
  const resultItems = document.querySelectorAll(".result-item");

  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");
  const syncCloudBtn = document.getElementById("syncCloudBtn");

  /* ==========================================
     1. SIDEBAR TOGGLE
  ========================================== */
  toggle.onclick = () => {
    const expanded = sidebar.classList.toggle("expanded");

    // desktop/tablet body states
    document.body.classList.toggle("sidebar-expanded", expanded);

    document.body.classList.toggle("sidebar-collapsed", !expanded);

    // mobile overlay
    if (window.innerWidth <= 768) {
      overlay.classList.toggle("active", expanded);
    }
  };

  window.addEventListener("resize", () => {
    const width = window.innerWidth;

    // desktop
    if (width > 1024) {
      sidebar.classList.add("expanded");

      document.body.classList.add("sidebar-expanded");

      document.body.classList.remove("sidebar-collapsed");
    }

    // tablet
    else if (width > 768) {
      document.body.classList.remove("sidebar-expanded");

      if (!sidebar.classList.contains("expanded")) {
        document.body.classList.add("sidebar-collapsed");
      }
    }

    // mobile
    else {
      document.body.classList.remove("sidebar-expanded", "sidebar-collapsed");
    }

    // remove overlay outside mobile
    if (width > 768) {
      overlay.classList.remove("active");
    }
  });

  (function initSidebar() {
    // desktop default expanded
    if (window.innerWidth > 1024) {
      sidebar.classList.add("expanded");

      document.body.classList.add("sidebar-expanded");
    }

    // tablet default collapsed
    else if (window.innerWidth > 768) {
      sidebar.classList.remove("expanded");

      document.body.classList.add("sidebar-collapsed");
    }
  })();

  /* ==========================================
    FAB home toggle 
  ========================================== */
  const fabHome = document.getElementById("fabHome");

  if (fabHome) {
    fabHome.onclick = () => {
      // go back to My Space
      loadPage("all", "My Space");
    };
  }

  /* ==========================================
   Sync Status
========================================== */
  function showSyncStatus(text) {
    const btn = document.getElementById("syncCloudBtn");

    if (!btn) return;

    btn.textContent = text;
  }

  syncCloudBtn?.addEventListener("click", async () => {
    try {
      if (!window.syncTemplatesToFirestore) {
        showSyncStatus("Login First");

        setTimeout(() => {
          showSyncStatus("Sync");
        }, 2000);

        return;
      }

      showSyncStatus("Syncing...");

      await window.syncTemplatesToFirestore();

      showSyncStatus("Synced to Cloud !");

      setTimeout(() => {
        showSyncStatus("Sync");
      }, 2000);
    } catch (err) {
      console.error(err);

      showSyncStatus("Failed to Sync / Login First");

      setTimeout(() => {
        showSyncStatus("Sync");
      }, 2000);
    }
  });

  /* ==========================================
    MObiel onclick toggle
  ========================================== */

  const mobileMenuBtn = document.getElementById("mobileMenuBtn");

  mobileMenuBtn.onclick = () => {
    sidebar.classList.toggle("expanded");

    overlay.classList.toggle("active", sidebar.classList.contains("expanded"));
  };

  /* ==========================================
     2. PAGE + ACTIVE STATE (CORE FUNCTION)
  ========================================== */
  function loadPage(page, label) {
    if (stickyHandler) {
      window.removeEventListener("scroll", stickyHandler);
      stickyHandler = null;
    }
    document.body.classList.remove("viewer-active");
    content.classList.remove("planner-mode");

    const topbar = document.getElementById("topbar");
    const viewerTopbar = document.getElementById("viewerTopbar");

    topbar.classList.remove("viewer-mode");
    viewerTopbar.innerHTML = "";

    // ---- PAGE MAP ----
    const pages = {
      all: renderMySpace,
      dated: () => renderFilteredTemplates("dated"),
      undated: () => renderFilteredTemplates("undated"),
      templates: renderTemplates,
      analytics: renderAnalytics,
      guide: renderGuide,
    };

    // ---- RENDER ----
    if (pages[page]) {
      content.innerHTML = pages[page]();
    } else {
      content.innerHTML = `<h2>${label}</h2>`;
    }

    // 🔥 clear all first
    navItems.forEach((item) => item.classList.remove("active"));

    // 🔥 set only one
    const activeItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeItem) activeItem.classList.add("active");

    // ---- CLOSE SEARCH ----
    searchBox.classList.remove("active");

    // ---- AFTER RENDER (IMPORTANT) ----
    setTimeout(() => {
      if (page === "templates") {
        setupTemplateButtons();
        setupTemplateToggle();
        setupTemplateCategories();
        setupTemplateSticky();
        lucide.createIcons();
      }

      if (page === "dated" || page === "undated") {
        content.classList.add("planner-mode");
      }

      if (page === "all" || page === "dated" || page === "undated") {
        setupAllCardActions();
        setupViewToggle();
      }

      if (page === "analytics") {
        lucide.createIcons();
        drawYearChart();
      }

      lucide.createIcons();
    }, 0);
  }

  /* ==========================================
     3. NAV CLICK
  ========================================== */
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      // 1️⃣ Navigate
      loadPage(item.dataset.page, item.innerText);

      // 2️⃣ Close sidebar ONLY on mobile
      if (window.innerWidth <= 768) {
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("overlay");

        sidebar.classList.remove("expanded");
        overlay.classList.remove("active");
      }
    });
  });

  /* ==========================================
     4. SEARCH DROPDOWN
  ========================================== */

  // Open
  searchInput.addEventListener("focus", () => {
    searchBox.classList.add("active");
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target)) {
      searchBox.classList.remove("active");
    }
  });

  // Click result
  resultItems.forEach((item) => {
    item.addEventListener("click", () => {
      loadPage(item.dataset.page, item.innerText);
    });
  });

  //Open Guide page
  document.getElementById("guideBtn").addEventListener("click", () => {
    loadPage("guide", "Guide");
  });

  loadPage("all", "My Space");
  updatePlannerCounter();
});

/* ==========================================
     6. Render Templates (called from index.html)
  ========================================== */
function renderTemplates(filter = "all") {
  let html = `
  <div class="templates-header">
    <h2 class="templates-title">Templates</h2>

    <div class="template-toggle">
      <button class="toggle-btn ${filter === "all" ? "active" : ""}" data-filter="all">All</button>
      <button class="toggle-btn ${filter === "dated" ? "active" : ""}" data-filter="dated">Dated</button>
      <button class="toggle-btn ${filter === "undated" ? "active" : ""}" data-filter="undated">Undated</button>
    </div>
  </div>
`;

  /* ==========================================
   TEMPLATE CATEGORY NAVIGATION
========================================== */

  let navCategories = {};

  if (filter === "dated") {
    navCategories = templatesData.dated;
  } else if (filter === "undated") {
    navCategories = templatesData.undated;
  } else {
    navCategories = {
      ...templatesData.dated,
      ...templatesData.undated,
    };
  }

  html += `
<div class="template-nav-wrap">
  <div class="template-categories">
`;

  Object.keys(navCategories).forEach((category) => {
    const meta = categoryMeta[category] || {};

    const sectionId = category.toLowerCase().replace(/\s+/g, "-");

    const label = category.replace(" Planner", "");

    html += `
    <button
      class="cat-btn"
      data-target="${sectionId}"
    >
      <i
        data-lucide="${meta.icon || "folder"}"
        class="cat-icon"
      ></i>

      <span>${label}</span>
    </button>
  `;
  });

  html += `
  </div>
</div>

<div class="template-nav-placeholder"></div>
`;
  for (let section in templatesData) {
    if (filter !== "all" && section !== filter) continue;

    const categories = templatesData[section];

    for (let category in categories) {
      const meta = categoryMeta[category] || {};
      const icon = meta.icon || "folder";
      const desc = meta.desc || "";

      const sectionId = category.toLowerCase().replace(/\s+/g, "-");

      html += `<div class="template-group" id="${sectionId}">

      <div class="template-category">
      <div class="category-left">
        <i data-lucide="${icon}" class="category-icon"></i>
        <div class="category-text">
          <span class="category-title">${category}</span>
          <p class="category-desc">${desc}</p>
        </div>
      </div>
    </div>
      <div class="divider"></div>

      <div class="template-grid">
  `;

      categories[category].forEach((template) => {
        html += `
      <div class="template-card">
        <img src="${template.image}" />
        
        <div class="template-info">
          <span>${template.name}</span>
          <button class="add-btn" data-url="${template.url}">
            <i data-lucide="plus" class="btn-icon"></i>
            <span class="btn-text">Add</span>
          </button>
        </div>
      </div>
    `;
      });

      html += `
      </div> <!-- grid -->
    </div> <!-- group -->
  `;
    }

    html += `</div>`;
  }

  return html;
}

/* ==========================================
  Template Categories Scroll Logic
  ========================================== */

function setupTemplateCategories() {
  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;

      const section = document.getElementById(target);

      if (!section) return;

      const y = section.getBoundingClientRect().top + window.scrollY - 80;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    });
  });
}

/* ==========================================
  Template Categories Sticky Logic
  ========================================== */
function setupTemplateSticky() {
  const wrap = document.querySelector(".template-nav-wrap");

  if (!wrap) return;

  // Remove previous listener
  if (stickyHandler) {
    window.removeEventListener("scroll", stickyHandler);
  }

  const start = wrap.getBoundingClientRect().top + window.scrollY;

  stickyHandler = function () {
    // Page changed
    if (!wrap.isConnected) {
      window.removeEventListener("scroll", stickyHandler);
      stickyHandler = null;
      return;
    }

    if (window.scrollY >= start) {
      wrap.classList.add("fixed-nav");

      if (wrap.parentElement) {
        wrap.style.width = wrap.parentElement.clientWidth + "px";
        wrap.style.left =
          wrap.parentElement.getBoundingClientRect().left + "px";
      }
    } else {
      wrap.classList.remove("fixed-nav");
      wrap.style.width = "";
      wrap.style.left = "";
    }
  };

  window.addEventListener("scroll", stickyHandler);
}

/* ==========================================
     6. Render Templates : Inside TOggle 
  ========================================== */

function setupTemplateToggle() {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // active state
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      // re-render
      document.getElementById("content").innerHTML = renderTemplates(filter);

      // re-bind buttons again (important)
      setupTemplateButtons();
      setupTemplateToggle();
      setupTemplateCategories();
      setupTemplateSticky();
      lucide.createIcons(); // 🔥 ADD THIS
    });
  });
}

/* ==========================================
     6. Render Templates : Add Button Logic
  ========================================== */
function setupTemplateButtons() {
  const buttons = document.querySelectorAll(".add-btn");

  buttons.forEach((btn) => {
    const url = btn.dataset.url;

    // 🔥 Set initial state (VERY IMPORTANT)
    const exists = myTemplates.some((t) => t.url === url);

    if (exists) {
      btn.classList.add("added");
      btn.innerHTML = `
        <i data-lucide="check" class="btn-icon"></i>
        <span class="btn-text">Added</span>
      `;
    }

    // 🔥 Click handler
    btn.addEventListener("click", () => {
      if (btn.classList.contains("added")) return;

      const url = btn.dataset.url;

      let selectedTemplate = null;

      for (let section in templatesData) {
        for (let category in templatesData[section]) {
          templatesData[section][category].forEach((t) => {
            if (t.url === url) {
              selectedTemplate = {
                id: Date.now(),
                ...t,
                type: section,
              };
            }
          });
        }
      }

      if (!selectedTemplate) return;

      const exists = myTemplates.some((t) => t.url === url);

      if (!exists) {
        myTemplates.push(selectedTemplate);
        saveTemplates();
        updatePlannerCounter();
      }

      // get current active filter
      const activeBtn = document.querySelector(".toggle-btn.active");
      const currentFilter = activeBtn ? activeBtn.dataset.filter : "all";

      // re-render with SAME filter
      document.getElementById("content").innerHTML =
        renderTemplates(currentFilter);

      setTimeout(() => {
        setupTemplateButtons();
        setupTemplateToggle();
        setupTemplateCategories();
        setupTemplateSticky();
        lucide.createIcons();
      }, 0);
    });
  });
}

/* ==========================================
     6. Render MySpace (called from index.html)
  ========================================== */

function renderMySpace(view = "grid") {
  let html = `
    <div class="myspace-header">

      <h2 class="menu-title">My Space</h2>

      <div class="view-toggle">
        <button class="view-btn ${view === "grid" ? "active" : ""}" data-view="grid">
          <i data-lucide="layout-grid" class="view-icon"></i>
          <span>Grid</span>
        </button>

        <button class="view-btn ${view === "list" ? "active" : ""}" data-view="list">
          <i data-lucide="list" class="view-icon"></i>
          <span>List</span>
        </button>
      </div>

    </div>
    `;

  if (myTemplates.length === 0) {
    return (
      html +
      `<div class="empty-message"> No planners added yet . Go to 'Templates' to add Planner</div>`
    );
  }

  html += `<div class="myspace-container ${view}-view">`;

  if (view === "list") {
    html += `
          <div class="list-header">
            <span>#</span>
            <span>Name</span>
            <span>Move</span>
            <span>Edit</span>
            <span>Delete</span>
          </div>
        `;
  }

  if (view === "grid") {
    html += `<div class="template-grid">`;

    myTemplates.forEach((template) => {
      html += `
      <div class="template-card" draggable="true" data-id="${template.id}">
        <img src="${template.image}" />

        <div class="template-info">
           <span class="template-name">${template.name}</span>

          <div class="card-actions">
            <button class="edit-btn">
              <i data-lucide="pencil"></i>
            </button>
            <button class="delete-btn">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    });

    html += `</div>`;
  }

  if (view === "list") {
    html += `<div class="list-container">`;

    myTemplates.forEach((template, index) => {
      html += `
      <div class="list-row" data-id="${template.id}">

        <div class="serial-col">${index + 1}</div>

        <div class="name-col">
          <div class="template-name">${template.name}</div>
          <div class="template-category-label">
            ${template.type === "dated" ? "Dated Planner" : "Undated Planner"}
          </div>
        </div>

        <div class="move-col">
          <button class="move-up" data-id="${template.id}">
            <i data-lucide="arrow-up"></i>
          </button>
          <button class="move-down" data-id="${template.id}">
            <i data-lucide="arrow-down"></i>
          </button>
        </div>

        <div class="edit-col edit-btn">
          <i data-lucide="pencil"></i>
        </div>

        <div class="delete-col delete-btn">
          <i data-lucide="trash-2"></i>
        </div>

      </div>
    `;
    });

    html += `</div>`;
  }
  return html;
}

/* ==========================================
     6. Dated and Undated Pages (called from index.html)
  ========================================== */

function renderFilteredTemplates(type) {
  const filtered = myTemplates.filter((t) => t.type === type);

  let html = `
    <div class="craft-grid">

      <div class="planner-indicator">
        ${type === "dated" ? "Dated Planner" : "Undated Planner"}
      </div>
  `;

  if (filtered.length === 0) {
    html += `
      <div class="empty-message">
        No planners added yet
      </div>
    `;
  }

  filtered.forEach((template) => {
    html += `
      <div class="craft-card" data-id="${template.id || ""}">
        <iframe
          class="craft-iframe"
          src="${template.url}"
          loading="lazy">
        </iframe>
      </div>
    `;
  });

  html += `</div>`;

  return html;
}

/* ==========================================
     6. delete button logic in MySpace (called from index.html)
  ========================================== */

function setupDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      const card = btn.closest(".template-card, .list-row");
      const id = Number(card.dataset.id);
      if (!id) return;

      // remove from state
      myTemplates = myTemplates.filter((t) => t.id !== id);
      saveTemplates();
      updatePlannerCounter();

      // 🔥 RE-RENDER CURRENT PAGE
      const activePage =
        document.querySelector(".nav-item.active")?.dataset.page;

      if (activePage === "dated") {
        document.getElementById("content").innerHTML =
          renderFilteredTemplates("dated");
      } else if (activePage === "undated") {
        document.getElementById("content").innerHTML =
          renderFilteredTemplates("undated");
      } else {
        document.getElementById("content").innerHTML =
          renderMySpace(currentView);
      }

      setTimeout(() => {
        lucide.createIcons();

        setupAllCardActions();
        setupViewToggle(); // 🔥 THIS FIXES YOUR ISSUE
      }, 0);
    });
  });
}

/* ==========================================
     6. edit button logic in MySpace (called from index.html)
  ========================================== */

function setupReorderButtons() {
  document.querySelectorAll(".move-up").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = Number(btn.dataset.id);
      const index = myTemplates.findIndex((t) => t.id === id);

      if (index <= 0) return;

      // swap with previous
      [myTemplates[index - 1], myTemplates[index]] = [
        myTemplates[index],
        myTemplates[index - 1],
      ];

      saveTemplates();

      // re-render SAME view
      document.getElementById("content").innerHTML = renderMySpace(currentView);

      setTimeout(() => {
        lucide.createIcons();
        setupAllCardActions();
        setupViewToggle();
      }, 0);
    });
  });

  document.querySelectorAll(".move-down").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();

      const id = Number(btn.dataset.id);
      const index = myTemplates.findIndex((t) => t.id === id);

      if (index >= myTemplates.length - 1) return;

      // swap with next
      [myTemplates[index + 1], myTemplates[index]] = [
        myTemplates[index],
        myTemplates[index + 1],
      ];

      saveTemplates();

      // re-render SAME view
      document.getElementById("content").innerHTML = renderMySpace(currentView);

      setTimeout(() => {
        lucide.createIcons();
        setupAllCardActions();
        setupViewToggle();
      }, 0);
    });
  });
}
/* ==========================================
     6. edit button logic in MySpace (called from index.html)
  ========================================== */
function setupEditButtons() {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.currentTarget.closest(".template-card, .list-row");
      const id = Number(card.dataset.id);
      if (!id) return;

      const template = myTemplates.find((t) => t.id === id);
      if (!template) return;

      const nameEl = card.querySelector(".template-name");

      // prevent duplicate inputs
      if (card.querySelector(".edit-input")) return;

      // create input
      const input = document.createElement("input");
      input.type = "text";
      input.value = template.name;
      input.className = "edit-input";

      // replace span with input
      nameEl.replaceWith(input);
      input.focus();
      input.select();

      // 🔥 SAVE FUNCTION
      const save = () => {
        const newName = input.value.trim();

        if (!newName) {
          cancel();
          return;
        }

        template.name = newName;
        saveTemplates();

        const newSpan = document.createElement("span");
        newSpan.className = "template-name";
        newSpan.textContent = newName;

        input.replaceWith(newSpan);
      };

      // 🔥 CANCEL FUNCTION
      const cancel = () => {
        const newSpan = document.createElement("span");
        newSpan.className = "template-name";
        newSpan.textContent = template.name;

        input.replaceWith(newSpan);
      };

      // events
      input.addEventListener("blur", save);

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") cancel();
      });
    });
  });
}

/* ==========================================
     6. drag and drop logic in MySpace (called from index.html)
  ========================================== */

let draggedId = null;

function setupDrag() {
  const cards = document.querySelectorAll(".template-card");

  cards.forEach((card) => {
    card.addEventListener("dragstart", () => {
      draggedId = Number(card.dataset.id);
    });

    card.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    card.addEventListener("drop", (e) => {
      e.preventDefault();

      const targetId = Number(card.dataset.id);

      const fromIndex = myTemplates.findIndex((t) => t.id === draggedId);
      const toIndex = myTemplates.findIndex((t) => t.id === targetId);

      // swap
      const temp = myTemplates[fromIndex];
      myTemplates[fromIndex] = myTemplates[toIndex];
      myTemplates[toIndex] = temp;

      saveTemplates();

      // re-render
      document.getElementById("content").innerHTML = renderMySpace(currentView);
      setTimeout(() => {
        lucide.createIcons();

        setupAllCardActions();
        setupViewToggle(); // 🔥 THIS FIXES YOUR ISSUE
      }, 0);
    });
  });
}

/* ==========================================
     List view in myspace
  ========================================== */

function setupViewToggle() {
  const buttons = document.querySelectorAll(".view-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentView = btn.dataset.view; // 🔥 STORE VIEW

      document.getElementById("content").innerHTML = renderMySpace(currentView);

      setTimeout(() => {
        lucide.createIcons();
        setupAllCardActions();
        setupViewToggle();
      }, 0);
    });
  });
}

/* ==========================================
     6. After rendering MySpace, we need to setup delete, edit and drag actions again (called from index.html)
  ========================================== */
function setupAllCardActions() {
  setupDeleteButtons();
  setupEditButtons();
  setupDrag();
  setupReorderButtons();
  setupCardOpen(); // 🔥 ADD THIS
}

/* ==========================================
     Main workspace viewer function (called from index.html)
  ========================================== */

let currentIndex = 0;
let currentList = [];

function openViewer(index, list) {
  document.body.classList.add("viewer-active");
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("expanded");

  document.body.classList.remove("sidebar-expanded");

  document.body.classList.add("sidebar-collapsed");

  currentIndex = index;
  currentList = list;

  const item = currentList[currentIndex];
  const content = document.getElementById("content");
  const topbar = document.getElementById("topbar");
  const viewerTopbar = document.getElementById("viewerTopbar");

  topbar.classList.add("viewer-mode");

  viewerTopbar.innerHTML = `
    <button class="nav-btn" id="prevBtn">
      <i data-lucide="circle-arrow-left"></i>
    </button>

    <h2 class="viewer-title">${item.name}</h2>

    <button class="nav-btn" id="nextBtn">
      <i data-lucide="circle-arrow-right"></i>
    </button>
  `;

  content.innerHTML = `
    <div class="viewer-page">
      <iframe class="viewer-frame" src="${item.url}"></iframe>
    </div>
  `;

  lucide.createIcons();

  document.getElementById("nextBtn").onclick = nextTemplate;
  document.getElementById("prevBtn").onclick = prevTemplate;
}

function closeViewer() {
  document.getElementById("viewer").classList.remove("active");
  document.getElementById("viewerFrame").src = "";
}

function nextTemplate() {
  currentIndex = (currentIndex + 1) % currentList.length;
  openViewer(currentIndex, currentList);
}

function prevTemplate() {
  currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
  openViewer(currentIndex, currentList);
}

/* ==========================================
     Main workspace card open logic (called from index.html)
  ========================================== */

function setupCardOpen() {
  const items = document.querySelectorAll(".template-card, .list-row");

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      // ❌ ignore clicks on buttons
      if (
        e.target.closest(".edit-btn") ||
        e.target.closest(".delete-btn") ||
        e.target.closest(".move-up") ||
        e.target.closest(".move-down")
      )
        return;

      const id = Number(item.dataset.id);
      if (!id) return;

      const activePage =
        document.querySelector(".nav-item.active")?.dataset.page;

      let list = [];

      if (activePage === "dated") {
        list = myTemplates.filter((t) => t.type === "dated");
      } else if (activePage === "undated") {
        list = myTemplates.filter((t) => t.type === "undated");
      } else {
        list = myTemplates;
      }

      const index = list.findIndex((t) => t.id === id);
      if (index === -1) return;

      openViewer(index, list);
    });
  });
}

/* ==========================================
   CLOUD ACCOUNT MODAL
========================================== */

const cloudBtn = document.getElementById("cloudAccountBtn");
const authModal = document.getElementById("authModal");
const closeAuth = document.getElementById("closeAuth");

const authTabs = document.querySelectorAll(".auth-tab");
const authForms = document.querySelectorAll(".auth-form");

/* OPEN */
cloudBtn.onclick = () => {
  // DON'T OPEN IF LOGGED IN
  if (cloudBtn.classList.contains("logged-in")) return;

  authModal.classList.add("active");
};

/* CLOSE */
closeAuth.onclick = () => {
  authModal.classList.remove("active");
};

/* OUTSIDE CLICK */
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) {
    authModal.classList.remove("active");
  }
});

/* TAB SWITCH */
authTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = tab.dataset.tab;

    authTabs.forEach((t) => t.classList.remove("active"));

    authForms.forEach((f) => f.classList.remove("active"));

    tab.classList.add("active");

    if (selected === "login") {
      document.getElementById("loginForm").classList.add("active");
    }

    if (selected === "signup") {
      document.getElementById("signupForm").classList.add("active");
    }
  });
});

/* ==========================================
   Footer Planner Counter
========================================== */

function updatePlannerCounter() {
  let totalTemplates = 0;

  Object.values(templatesData).forEach((section) => {
    Object.values(section).forEach((category) => {
      totalTemplates += category.length;
    });
  });

  const addedCount = myTemplates.length;

  const usageText = document.getElementById("usageText");

  if (!usageText) return;

  usageText.textContent = `${addedCount} / ${totalTemplates} planners added`;
}

/* ==========================================
   Anaytics Page render
========================================== */
let yearChart = null;

function drawYearChart() {
  const isMobile = window.innerWidth <= 768;
  const isSmall = window.innerWidth <= 380;
  const canvas = document.getElementById("yearChart");
  if (!canvas) return;

  if (yearChart) {
    yearChart.destroy();
  }

  const monthLabels = isSmall
    ? ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]
    : [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

  const values = [12, 18, 26, 21, 34, 42, 48, 37, 29, 35, 44, 46];

  const highest = Math.max(...values);

  // Round to nearest 10
  const maxY = Math.ceil(highest / 10) * 10;

  // Five major divisions
  const step = maxY / 5;

  yearChart = new Chart(canvas, {
    type: "line",

    data: {
      labels: monthLabels,

      datasets: [
        {
          data: values,

          borderColor: "#b66dff",

          pointRadius: isSmall ? 2 : isMobile ? 3 : 5,
          pointHoverRadius: isSmall ? 3 : isMobile ? 4 : 7,
          borderWidth: isSmall ? 2 : 3,
          pointBorderWidth: isSmall ? 2 : isMobile ? 2 : 3,

          tension: 0.4,

          pointBackgroundColor: "#ffffff",

          pointBorderColor: "#b66dff",

          fill: true,

          backgroundColor(context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) return;

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );

            gradient.addColorStop(0, "rgba(182,109,255,.35)");
            gradient.addColorStop(0.55, "rgba(182,109,255,.12)");
            gradient.addColorStop(1, "rgba(182,109,255,0)");

            return gradient;
          },
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      animation: false,

      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#181818",
          borderColor: "#333",
          borderWidth: 1,
          titleFont: {
            size: isMobile ? 10 : 13,
          },
          bodyFont: {
            size: isMobile ? 10 : 12,
          },
        },
      },

      layout: {
        padding: {
          left: isSmall ? 0 : 8,
          right: isSmall ? 0 : 8,
          top: 8,
          bottom: 0,
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          ticks: {
            color: "#888",
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,

            font: {
              size: isSmall ? 8 : isMobile ? 9 : 11,
            },
          },
        },

        y: {
          beginAtZero: true,

          min: 0,

          max: maxY,

          ticks: {
            color: "#888",
            autoSkip: false,
            maxRotation: 0,
            minRotation: 0,

            font: {
              size: isSmall ? 8 : isMobile ? 9 : 11,
            },
          },

          grid: {
            color: "rgba(255,255,255,.06)",
          },

          border: {
            display: false,
          },
        },
      },
    },
  });
}

let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    if (document.getElementById("yearChart")) {
      drawYearChart();
    }
  }, 150);
});
