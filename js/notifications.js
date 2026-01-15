/************************************************
 * CONFIG / DATA SOURCE
 ************************************************/

// MOCK DATA (FAKE BACKEND – SAFE TO REMOVE LATER)
let notifications = [
  {
    id: "1",
    message: "Shift swap request pending approval",
    requiresAction: true,
    status: "new",
    createdAt: Date.now() - 10 * 60 * 1000,
    readAt: null
  },
  {
    id: "2",
    message: "Agnes' shift swap request was approved",
    requiresAction: false,
    status: "read",
    createdAt: Date.now() - 60 * 60 * 1000,
    readAt: Date.now() - 50 * 60 * 1000
  }
];

// SINGLE ENTRY POINT (fake now → real API later)
async function loadNotifications() {
  // 🔹 CURRENT (mock)
  return Promise.resolve(notifications);

  // 🔹 LATER (backend)
  /*
  const res = await fetch(`${CONFIG.API_BASE_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await res.json();
  return data.notifications;
  */
}

let activeTab = "all";

/************************************************
 * TAB SWITCHING
 ************************************************/
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t =>
      t.classList.remove("active")
    );
    tab.classList.add("active");

    document.querySelectorAll(".tab-panel").forEach(p =>
      p.classList.remove("active")
    );
    document.getElementById(tab.dataset.tab).classList.add("active");

    activeTab = tab.dataset.tab;
    renderNotifications();
  });
});

/************************************************
 * FILTER PER TAB
 ************************************************/
function getFilteredNotifications() {
  if (activeTab === "all") return notifications;

  if (activeTab === "unread") {
    return notifications.filter(n => n.status === "new");
  }

  if (activeTab === "action") {
    return notifications.filter(
      n => n.requiresAction && n.status === "new"
    );
  }

  return [];
}

/************************************************
 * RENDER NOTIFICATIONS
 ************************************************/
function renderNotifications() {
  const panel = document.getElementById(activeTab);
  const list = panel.querySelector(".notification-list");
  const emptyState = document.querySelector(".empty-state");

  list.innerHTML = "";
  list.classList.remove("has-items");

  const filtered = getFilteredNotifications();

  // EMPTY STATE
  if (
    (activeTab === "all" && notifications.length === 0) ||
    (activeTab !== "all" && filtered.length === 0)
  ) {
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach(notification => {
    const item = document.createElement("div");
    item.classList.add("notification-item");

    if (notification.status === "new") {
      item.classList.add("new");
    }

    item.innerHTML = `
      <p>${notification.message}</p>
      <span class="time" data-time="${notification.createdAt}">
        ${formatTime(notification.createdAt)}
      </span>
      <span class="badge ${notification.status}">
        ${getBadgeText(notification)}
      </span>
    `;

    item.addEventListener("click", () =>
      openNotification(notification.id, item)
    );

    list.appendChild(item);
  });

  if (filtered.length > 0) {
    list.classList.add("has-items");
  }
}

/************************************************
 * OPEN / READ / APPROVE
 ************************************************/
function openNotification(id, element) {
  const notification = notifications.find(n => n.id === id);
  if (!notification) return;

  element.classList.add("animate-open");

  setTimeout(() => {
    if (notification.requiresAction) {
      notification.status = "approved";
    } else {
      notification.status = "read";
    }

    notification.readAt = Date.now();
    renderNotifications();
  }, 300);
}

/************************************************
 * BADGE TEXT
 ************************************************/
function getBadgeText(n) {
  if (n.status === "new") return "New";
  if (n.status === "read") return "Read";
  if (n.status === "approved") return "Approved";
  return "";
}

/************************************************
 * TIME FORMAT
 ************************************************/
function formatTime(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";

  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

/************************************************
 * LIVE TIME UPDATE
 ************************************************/
setInterval(() => {
  document.querySelectorAll(".time").forEach(el => {
    el.textContent = formatTime(Number(el.dataset.time));
  });
}, 60000);

/************************************************
 * DEV HELPER (OPTIONAL)
 ************************************************/
function simulateNotification() {
  notifications.unshift({
    id: crypto.randomUUID(),
    message: "New shift swap request submitted",
    requiresAction: true,
    status: "new",
    createdAt: Date.now(),
    readAt: null
  });

  renderNotifications();
}

/************************************************
 * INIT
 ************************************************/
loadNotifications().then(data => {
  notifications = data;
  renderNotifications();
});
