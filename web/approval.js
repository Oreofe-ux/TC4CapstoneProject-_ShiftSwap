// ===============================
// APPROVAL FILTER + VIEW LOGIC
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  setupApprovalFilters();
  setupBackNavigation();
});

// ===============================
// FILTER + VIEW SWITCHING
// ===============================
function setupApprovalFilters() {
  const buttons = document.querySelectorAll(".stat-btn");
  const items = document.querySelectorAll(".approval-item");

  const filters = document.getElementById("approval-filters");
  const stats = document.getElementById("approval-stats");
  const approvalList = document.querySelector(".approval-list");
  const requestDetails = document.getElementById("request-details");
  const headerTitle = document.querySelector(".dashboard-header h2");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      // ===============================
      // ACTIVE BUTTON STATE
      // ===============================
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // ===============================
      // TIME OFF REQUEST VIEW
      // ===============================
      if (filter === "timeoff") {
        filters?.classList.add("hidden");
        stats?.classList.add("hidden");
        approvalList?.classList.add("hidden");
        requestDetails?.classList.remove("hidden");

        if (headerTitle) {
          headerTitle.textContent = "← Back to Pending Approvals";
          headerTitle.classList.add("clickable");
        }

        return; // ⛔ stop normal filtering
      }

      // ===============================
      // NORMAL APPROVAL LIST VIEW
      // ===============================
      filters?.classList.remove("hidden");
      stats?.classList.remove("hidden");
      approvalList?.classList.remove("hidden");
      requestDetails?.classList.add("hidden");

      if (headerTitle) {
        headerTitle.textContent = "Pending Approvals";
        headerTitle.classList.remove("clickable");
      }

      // ===============================
      // FILTER ITEMS + HIGH PRIORITY ALERT
      // ===============================
      items.forEach(item => {
        const type = item.dataset.type;
        const statusBadge = item.querySelector(".status");

        // Reset state
        statusBadge?.classList.remove("high-alert");

        if (filter === "all") {
          item.style.display = "flex";
        } else if (type === filter) {
          item.style.display = "flex";

          if (filter === "high") {
            statusBadge?.classList.add("high-alert");
          }
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// ===============================
// BACK NAVIGATION (HEADER CLICK)
// ===============================
function setupBackNavigation() {
  const headerTitle = document.querySelector(".dashboard-header h2");

  if (!headerTitle) return;

  headerTitle.addEventListener("click", () => {
    if (!headerTitle.textContent.includes("Back")) return;

    document.getElementById("request-details")?.classList.add("hidden");
    document.querySelector(".approval-list")?.classList.remove("hidden");
    document.getElementById("approval-filters")?.classList.remove("hidden");
    document.getElementById("approval-stats")?.classList.remove("hidden");

    headerTitle.textContent = "Pending Approvals";
    headerTitle.classList.remove("clickable");

    // Reset to Total Pending
    document.querySelectorAll(".stat-btn").forEach(btn =>
      btn.classList.remove("active")
    );

    document
      .querySelector('[data-filter="all"]')
      ?.classList.add("active");

    document.querySelectorAll(".approval-item").forEach(item => {
      item.style.display = "flex";
      item.querySelector(".status")?.classList.remove("high-alert");
    });
  });
}
