// ==================== index.js ====================

// ==================================================
// 0️⃣ SIMULATE TOKEN (REMOVE WHEN LOGIN IS READY)
// ==================================================
//if (!localStorage.getItem("token")) {
//  localStorage.setItem("token", "SIMULATED_JWT_TOKEN_FOR_TESTING");
  //console.log("Simulated token added for testing.");
//}//

// ==================================================
// 0️⃣a SIMULATE ADMIN PROFILE (TEMP – FOR TESTING)
// ==================================================
if (!localStorage.getItem("adminProfile")) {
  const tempAdminProfile = {
    name: "Kemi Adebayo",
    role: "Hospital Manager",
    avatar: "https://www.gravatar.com/avatar/?d=mp&s=150"
  };

  localStorage.setItem("adminProfile", JSON.stringify(tempAdminProfile));
  console.log("Simulated admin profile added for testing.");
}

// ==================================================
// 1️⃣ HELPER: GET TOKEN
// ==================================================
function getToken() {
  return localStorage.getItem("token");
}

// ==================================================
// 2️⃣ LOAD SIDEBAR HTML INTO PAGE
// IMPORTANT: sidebar.html contains avatars & names
// ==================================================
async function loadSidebar() {
  const sidebarContainer = document.getElementById("sidebar-placeholder");
  if (!sidebarContainer) return;

  try {
    const response = await fetch("sidebar.html");
    const html = await response.text();
    sidebarContainer.innerHTML = html;

    // Sidebar is now in DOM — safe to run these
    loadAdminProfile();
    setupAvatarUpload();
  } catch (error) {
    console.error("Failed to load sidebar:", error);
  }
}

// ==================================================
// 3️⃣ ADMIN PROFILE (SIDEBAR HEADER + FOOTER)
// ==================================================
async function loadAdminProfile() {
  const token = getToken();
  if (!token) return;

  let adminData = null;

  // Try backend first
  try {
    const response = await fetch(
      "https://shiftswap-backend-4w40.onrender.com/api/admin/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.ok) {
      adminData = await response.json();
    }
  } catch {
    console.warn("Backend not available, using local admin profile.");
  }

  // Fallback to localStorage
  if (!adminData) {
    adminData = JSON.parse(localStorage.getItem("adminProfile"));
  }

  if (!adminData) return;

  const avatarUrl =
    adminData.avatar && adminData.avatar !== ""
      ? adminData.avatar
      : "https://www.gravatar.com/avatar/?d=mp&s=150";

  // Sidebar HEADER
  const sidebarAvatar = document.getElementById("sidebar-avatar");
  const sidebarName = document.getElementById("admin-name");

  if (sidebarAvatar) sidebarAvatar.src = avatarUrl;
  if (sidebarName) sidebarName.textContent = "Admin";

  // Sidebar FOOTER
  const footerAvatar = document.getElementById("footer-avatar");
  const footerName = document.getElementById("footer-name");
  const footerRole = document.getElementById("footer-role");

  if (footerAvatar) footerAvatar.src = avatarUrl;
  if (footerName) footerName.textContent = adminData.name || "";
  if (footerRole) footerRole.textContent = adminData.role || "";
}

// ==================================================
// 4️⃣ AVATAR UPLOAD / CHANGE (FRONTEND ONLY)
// ==================================================
function setupAvatarUpload() {
  const sidebarAvatar = document.getElementById("sidebar-avatar");
  const footerAvatar = document.getElementById("footer-avatar");
  const fileInput = document.getElementById("avatar-upload");

  if (!fileInput) return;

  [sidebarAvatar, footerAvatar].forEach(avatar => {
    if (!avatar) return;
    avatar.style.cursor = "pointer";
    avatar.addEventListener("click", () => fileInput.click());
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;

      if (sidebarAvatar) sidebarAvatar.src = imageUrl;
      if (footerAvatar) footerAvatar.src = imageUrl;

      const adminProfile =
        JSON.parse(localStorage.getItem("adminProfile")) || {};

      adminProfile.avatar = imageUrl;
      localStorage.setItem("adminProfile", JSON.stringify(adminProfile));
    };

    reader.readAsDataURL(file);
  });
}

// ==================================================
// 5️⃣ DATA FOR TABLE & FILTERS
// ==================================================
const departmentsList = [
  "Pediatrics",
  "OB-GYN",
  "Pharmacy",
  "Radiology",
  "Emergency",
  "Surgery",
  "Physiotherapy",
  "ICU",
  "Laboratory"
];

const mockShifts = [
  {
    staffName: "Alice Johnson",
    date: "12/01/2026",
    time: "9am - 4pm",
    department: "Emergency",
    status: "Pending",
    reviewStatus: "Review"
  },
  {
    staffName: "Bob Smith",
    date: "12/01/2026",
    time: "4pm - 12am",
    department: "ICU",
    status: "Approved",
    reviewStatus: "Reviewed"
  },
  {
    staffName: "Clara Lee",
    date: "12/01/2026",
    time: "9am - 4pm",
    department: "Pediatrics",
    status: "Risk",
    reviewStatus: "Review"
  }
];

// ==================================================
// 6️⃣ POPULATE FILTER DROPDOWNS
// ==================================================
function populateDepartments() {
  const dropdown = document.getElementById("filter-department");
  if (!dropdown) return;

  dropdown.innerHTML = `<option disabled selected>Department</option>`;
  departmentsList.forEach(dept => {
    dropdown.innerHTML += `<option value="${dept}">${dept}</option>`;
  });
}

function populateStatusAndDateDropdowns() {
  const statusDropdown = document.getElementById("filter-status");
  const dateDropdown = document.getElementById("filter-date");

  if (statusDropdown) {
    statusDropdown.innerHTML =
      `<option disabled selected>Status</option>
       <option>Pending</option>
       <option>Risk</option>
       <option>Approved</option>`;
  }

  if (dateDropdown) {
    dateDropdown.innerHTML = `<option disabled selected>Date</option>`;
    [...new Set(mockShifts.map(s => s.date))].forEach(date => {
      dateDropdown.innerHTML += `<option>${date}</option>`;
    });
  }
}

// ==================================================
// 7️⃣ POPULATE TABLE
// ==================================================
function populateTable(shifts) {
  const tbody = document.getElementById("shift-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  shifts.forEach(shift => {
    const statusClass =
      shift.status === "Pending"
        ? "status-pending"
        : shift.status === "Approved"
        ? "status-approved"
        : "status-risk";

    const reviewClass =
      shift.reviewStatus === "Reviewed"
        ? "review-done"
        : "review-pending";

    tbody.innerHTML += `
      <tr>
        <td>${shift.staffName}</td>
        <td>${shift.date} ${shift.time}</td>
        <td>${shift.department}</td>
        <td><span class="${statusClass}">${shift.status}</span></td>
        <td><span class="${reviewClass}">${shift.reviewStatus}</span></td>
      </tr>
    `;
  });
}

// ==================================================
// 8️⃣ FILTER LOGIC
// ==================================================
function filterShifts() {
  const date = document.getElementById("filter-date")?.value;
  const dept = document.getElementById("filter-department")?.value;
  const status = document.getElementById("filter-status")?.value;

  let filtered = mockShifts;

  if (date && date !== "Date") filtered = filtered.filter(s => s.date === date);
  if (dept && dept !== "Department")
    filtered = filtered.filter(s => s.department === dept);
  if (status && status !== "Status")
    filtered = filtered.filter(s => s.status === status);

  populateTable(filtered);
}

// ==================================================
// 🔁 FETCH DASHBOARD DATA FROM BACKEND
// ==================================================
async function fetchDashboardShifts() {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(
      "https://shiftswap-backend-4w40.onrender.com/api/shifts",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) throw new Error("Fetch failed");

    const result = await response.json();
    const adaptedShifts = result.data.map(adaptBackendShift);

    populateTable(adaptedShifts);
  } catch (error) {
    console.warn("Backend unavailable, using mock data");
    populateTable(mockShifts);
  }
}

// ==================================================
// 🔁 BACKEND → FRONTEND ADAPTER
// ==================================================
function adaptBackendShift(shift) {
  return {
    staffName: shift.staff?.name || "—",
    date: formatDate(shift.date),
    time: formatTimeRange(shift.startTime, shift.endTime),
    department: shift.department?.name || "—",
    status: mapShiftStatus(shift.status),
    reviewStatus: shift.reviewed ? "Reviewed" : "Review"
  };
}

// ==================================================
// 🔁 STATUS NORMALIZATION
// ==================================================
function mapShiftStatus(status) {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Risk";
    default:
      return "Pending";
  }
}

// ==================================================
// 🕒 FORMATTERS
// ==================================================
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB");
}

function formatTimeRange(start, end) {
  return `${start} - ${end}`;
}


// ==================================================
// 9️⃣ INIT
// ==================================================
document.addEventListener("DOMContentLoaded", () => {
  populateDepartments();
  populateStatusAndDateDropdowns();
  fetchDashboardShifts();
  loadSidebar();

  document
    .getElementById("apply-filter")
    ?.addEventListener("click", filterShifts);
});
