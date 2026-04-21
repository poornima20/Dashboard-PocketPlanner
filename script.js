/* ==========================================
     0. Template Data
  ========================================== */
const templatesData = {
  dated: {
    "Daily Planner": [
      {
        name: "Focus Grid",
        image: "./Icons/focusgrid.png",
        url: "https://poornima20.github.io/PocketPlanner-DailyPlanner-FocusGrid/"
      },
      {
        name: "10-Minute Planner",
        image: "./Icons/10minuteplanner.png",
        url: "https://poornima20.github.io/PocketPlanner-DailyPlanner-10MinutePlanner/"
      }
    ],

    "Weekly Planner": [
      {
        name: "Week Log",
        image: "./Icons/weeklog.png",
        url: "https://poornima20.github.io/PocketPlanner-WeeklyPlaner-WeekLog/"
      },
      {
        name: "Weekly Spread",
        image: "./Icons/weeklyspread.png",
        url: "https://poornima20.github.io/PocketPlanner-WeeklyPlanner-WeeklySpread/"
      }
    ],

    "Monthly Planner": [
      {
        name: "Task Log",
        image: "./Icons/tasklog.png",
        url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-TaskLog/"
      },
      {
        name: "Monthly Grid",
        image: "./Icons/monthlygrid.png",
        url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-MonthlyGrid/"
      }
    ],

    "Yearly Planner": [
      {
        name: "Time Progress",
        image: "./Icons/timeprogress.png",
        url: "https://poornima20.github.io/PocketPlanner-YearlyPlanner-TimeProgress/"
      },
      {
        name: "Year Overview",
        image: "./Icons/yearoverview.png",
        url: "https://poornima20.github.io/PocketPlanner-MonthlyPlanner-YearOverview/"
      }
    ],

    "Tracker": [
      {
        name: "Project Timeline",
        image: "./Icons/projecttimeline.png",
        url: "https://poornima20.github.io/PocketPlanner-Tracker-ProjectTimeline/"
      },
      {
        name: "Study Log",
        image: "./Icons/studylog.png",
        url: "https://poornima20.github.io/PocketPlanner-Tracker-StudyLog/"
      },
      {
        name: "Spend Log",
        image: "./Icons/spendlog.png",
        url: "https://poornima20.github.io/PocketPlanner-Tracker-SpendLog/"
      },
      {
        name: "Water Log",
        image: "./Icons/waterlog.png",
        url: "https://poornima20.github.io/PocketPlanner-Tracker-WaterLog/"
      }
    ]
  },

  undated: {
    "Goals": [],

    "Notes": [
      {
        name: "Cornell Notes",
        image: "./Icons/cornellnotes.png",
        url: "https://poornima20.github.io/PocketPlanner-Notes-Cornell-Notes//"
      }
    ],

    "Music": [
      {
        name: "Arirang",
        image: "./Icons/arirang.png",
        url: "https://poornima20.github.io/PocketPlanner-Music-Arirang/"
      }
    ],

    "Entertainment": [
      {
        name: "Bookshelf",
        image: "./Icons/bookshelf.png",
        url: "https://poornima20.github.io/PocketPlanner-Entertainment-Bookshelf/"
      }
    ]
  }
};

const categoryIcons = {
  "Daily Planner": "calendar-days",
  "Weekly Planner": "calendar",
  "Monthly Planner": "calendar-range",
  "Yearly Planner": "calendar-clock",
  "Tracker": "activity",

  "Goals": "target",
  "Notes": "notebook",
  "Music": "music",
  "Entertainment": "film"
};

let myTemplates = JSON.parse(localStorage.getItem("myTemplates")) || [];

/* ==========================================
     1. Render Data
  ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("toggleSidebar");
  const content = document.getElementById("content");
  const overlay = document.getElementById("overlay");

  const navItems = document.querySelectorAll(".nav-item");
  const resultItems = document.querySelectorAll(".result-item");

  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");

    
  /* ==========================================
     1. SIDEBAR TOGGLE
  ========================================== */
  toggle.onclick = () => {
  if (window.innerWidth <= 768) {

    const isOpen = sidebar.classList.contains("open");

    if (isOpen) {
      sidebar.classList.remove("open");
      sidebar.classList.add("collapsed");   // back to icon-only
      overlay.classList.remove("active");
    } else {
      sidebar.classList.remove("collapsed"); // 🔥 IMPORTANT
      sidebar.classList.add("open");         // full sidebar
      overlay.classList.add("active");
    }

  } else {
    sidebar.classList.toggle("collapsed");
  }
};

/* close when clicking overlay */
overlay.onclick = () => {
  sidebar.classList.remove("open");
  sidebar.classList.add("collapsed");   // 🔥 THIS IS MISSING
  overlay.classList.remove("active");
};

  /* ==========================================
     2. PAGE + ACTIVE STATE (CORE FUNCTION)
  ========================================== */
  function loadPage(page, label) {

  // ---- PAGE MAP ----
  const pages = {
    all: renderMySpace,
    dated: () => renderFilteredTemplates("dated"),
    undated: () => renderFilteredTemplates("undated"),
    templates: renderTemplates   
  };

  // ---- RENDER ----
  if (pages[page]) {
    content.innerHTML = pages[page]();
  } else {
    content.innerHTML = `<h2>${label}</h2>`;
  }

  // ---- ACTIVE STATE ----
  navItems.forEach(item => {
    item.classList.remove("active");
  });

  const activeItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (activeItem) {
    activeItem.classList.add("active");
  }

  // ---- CLOSE SEARCH ----
  searchBox.classList.remove("active");

  // ---- AFTER RENDER (IMPORTANT) ----
  setTimeout(() => {

  if (page === "templates") {
    setupTemplateButtons();
    setupTemplateToggle();
  }

  if (page === "all" || page === "dated" || page === "undated") {
    setupAllCardActions();
  }

  lucide.createIcons();

}, 0);
}

  /* ==========================================
     3. NAV CLICK
  ========================================== */
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      loadPage(item.dataset.page, item.innerText);
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
  resultItems.forEach(item => {
    item.addEventListener("click", () => {
      loadPage(item.dataset.page, item.innerText);
    });
  });
  loadPage("all", "My Space");

});

/* ==========================================
     5. Service Worker Registration
  ========================================== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("SW registered"))
    .catch(err => console.log("SW error", err));
}

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
  for (let section in templatesData) {

    if (filter !== "all" && section !== filter) continue;

    const categories = templatesData[section];

    for (let category in categories) {   
  const icon = categoryIcons[category] || "folder";  

  html += `
    <div class="template-group">

      <div class="template-category">
        <i data-lucide="${icon}" class="category-icon"></i>
        <span>${category}</span>
      </div>
      <div class="divider"></div>

      <div class="template-grid">
  `;

  categories[category].forEach(template => {
    html += `
      <div class="template-card">
        <img src="${template.image}" />
        
        <div class="template-info">
          <span>${template.name}</span>
          <button class="add-btn" data-url="${template.url}">
            Add
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
     6. Render Templates : Inside TOggle 
  ========================================== */

function setupTemplateToggle() {
  const buttons = document.querySelectorAll(".toggle-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      // active state
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      // re-render
      document.getElementById("content").innerHTML = renderTemplates(filter);

      // re-bind buttons again (important)
      setupTemplateButtons();
      setupTemplateToggle();
      lucide.createIcons(); // 🔥 ADD THIS
    });
  });
}

/* ==========================================
     6. Render Templates : Add Button Logic
  ========================================== */
function setupTemplateButtons() {
  const buttons = document.querySelectorAll(".add-btn");

  buttons.forEach(btn => {

    const url = btn.dataset.url;

    // 🔥 Set initial state (VERY IMPORTANT)
    const exists = myTemplates.some(t => t.url === url);

    if (exists) {
      btn.classList.add("added");
      btn.textContent = "Added";
    }

    // 🔥 Click handler
    btn.addEventListener("click", () => {

  if (btn.classList.contains("added")) return;

  const url = btn.dataset.url;

  let selectedTemplate = null;

  for (let section in templatesData) {
    for (let category in templatesData[section]) {
      templatesData[section][category].forEach(t => {
        if (t.url === url) {
          selectedTemplate = {
            id: Date.now(),
            ...t,
            type: section
          };
        }
      });
    }
  }

  if (!selectedTemplate) return;

  const exists = myTemplates.some(t => t.url === url);

  if (!exists) {
    myTemplates.push(selectedTemplate);
    localStorage.setItem("myTemplates", JSON.stringify(myTemplates));
  }

  // get current active filter
const activeBtn = document.querySelector(".toggle-btn.active");
const currentFilter = activeBtn ? activeBtn.dataset.filter : "all";

// re-render with SAME filter
document.getElementById("content").innerHTML = renderTemplates(currentFilter);

setTimeout(() => {
  setupTemplateButtons();
  setupTemplateToggle();
  lucide.createIcons();
}, 0);

});
  });
}


/* ==========================================
     6. Render MySpace (called from index.html)
  ========================================== */

function renderMySpace() {
  
  let html = `<h2 class="menu-title">My Space</h2>`;

  if (myTemplates.length === 0) {
    return html + `<p>No templates added yet</p>`;
  }

  html += `<div class="template-grid">`;

  myTemplates.forEach(template => {
    html += `
  <div class="template-card" draggable="true" data-id="${template.id || ''}">
    
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

  return html;
}

/* ==========================================
     6. Dated and Undated Pages (called from index.html)
  ========================================== */

function renderFilteredTemplates(type) {
  let html = `<h2 class="menu-title">${type === "dated" ? "Dated Planner" : "Undated Planner"}</h2>`;

  const filtered = myTemplates.filter(t => t.type === type);

  if (filtered.length === 0) {
    return html + `<p>No templates added</p>`;
  }

  html += `<div class="template-grid">`;

  filtered.forEach(template => {
    html += `
  <div class="template-card" data-id="${template.id || ''}">
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

  return html;
}

/* ==========================================
     6. delete button logic in MySpace (called from index.html)
  ========================================== */

function setupDeleteButtons() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {

      const btn = e.currentTarget;
      const card = btn.closest(".template-card");
      const id = Number(card.dataset.id);
      if (!id) return;

      // remove from state
      myTemplates = myTemplates.filter(t => t.id !== id);
      localStorage.setItem("myTemplates", JSON.stringify(myTemplates));

      // 🔥 RE-RENDER CURRENT PAGE
      const activePage = document.querySelector(".nav-item.active")?.dataset.page;

      if (activePage === "dated") {
        document.getElementById("content").innerHTML = renderFilteredTemplates("dated");
      } 
      else if (activePage === "undated") {
        document.getElementById("content").innerHTML = renderFilteredTemplates("undated");
      } 
      else {
        document.getElementById("content").innerHTML = renderMySpace();
      }

      // re-bind
      setTimeout(() => {
        setupAllCardActions();
        lucide.createIcons();
      }, 0);

    });
  });
}

/* ==========================================
     6. edit button logic in MySpace (called from index.html)
  ========================================== */
function setupEditButtons() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {

      const card = e.currentTarget.closest(".template-card");
      const id = Number(card.dataset.id);
      if (!id) return;

      const template = myTemplates.find(t => t.id === id);
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
        localStorage.setItem("myTemplates", JSON.stringify(myTemplates));

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

  cards.forEach(card => {

    card.addEventListener("dragstart", () => {
      draggedId = Number(card.dataset.id);
    });

    card.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    card.addEventListener("drop", (e) => {
      e.preventDefault();

      const targetId = Number(card.dataset.id);

      const fromIndex = myTemplates.findIndex(t => t.id === draggedId);
      const toIndex = myTemplates.findIndex(t => t.id === targetId);

      // swap
      const temp = myTemplates[fromIndex];
      myTemplates[fromIndex] = myTemplates[toIndex];
      myTemplates[toIndex] = temp;

      localStorage.setItem("myTemplates", JSON.stringify(myTemplates));

      // re-render
      document.getElementById("content").innerHTML = renderMySpace();
      setTimeout(() => {
        setupAllCardActions();
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
  setupCardOpen(); // 🔥 ADD THIS
}


/* ==========================================
     Main workspace viewer function (called from index.html)
  ========================================== */

 let currentIndex = 0;
let currentList = [];

function openViewer(index, list) {
  currentIndex = index;
  currentList = list;

  const item = currentList[currentIndex];

  const content = document.getElementById("content");

  content.innerHTML = `
  <div class="viewer-page">

    <div class="viewer-header">
      <button class="nav-btn" id="prevBtn">
        <i data-lucide="chevron-left"></i>
      </button>

      <h2 class="viewer-title">${item.name}</h2>

      <button class="nav-btn" id="nextBtn">
        <i data-lucide="chevron-right"></i>
      </button>
    </div>

    <iframe class="viewer-frame" src="${item.url}"></iframe>

  </div>
`;
lucide.createIcons();
  // re-bind navigation
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
  const cards = document.querySelectorAll(".template-card");

  cards.forEach(card => {
    card.addEventListener("click", (e) => {

      if (
        e.target.closest(".edit-btn") ||
        e.target.closest(".delete-btn")
      ) return;

      const id = Number(card.dataset.id);

      const activePage = document.querySelector(".nav-item.active")?.dataset.page;

      let list = [];

      if (activePage === "dated") {
        list = myTemplates.filter(t => t.type === "dated");
      } 
      else if (activePage === "undated") {
        list = myTemplates.filter(t => t.type === "undated");
      } 
      else {
        list = myTemplates;
      }

      const index = list.findIndex(t => t.id === id);

      if (index === -1) return;

      openViewer(index, list);
    });
  });
}