document.addEventListener("DOMContentLoaded", () => {

  lucide.createIcons();

  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("toggleSidebar");
  const content = document.getElementById("content");

  const navItems = document.querySelectorAll(".nav-item");
  const resultItems = document.querySelectorAll(".result-item");

  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");

  /* ==========================================
     1. SIDEBAR TOGGLE
  ========================================== */
  toggle.onclick = () => {
    sidebar.classList.toggle("collapsed");
  };

  /* ==========================================
     2. PAGE + ACTIVE STATE (CORE FUNCTION)
  ========================================== */
  function loadPage(page, label) {

    // ---- CONTENT ----
    const titles = {
      all: "All Docs",
      dated: "Dated Planner",
      undated: "Undated Planner",
      templates: "Templates"
    };

    content.innerHTML = `<h2>${titles[page] || label}</h2>`;

    // ---- ACTIVE STATE ----
    navItems.forEach(item => {
      item.classList.remove("active");
    });

    const activeItem = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (activeItem) {
      activeItem.classList.add("active");
    }

    // ---- CLOSE SEARCH DROPDOWN ----
    searchBox.classList.remove("active");
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

});