function showPending() {
  document.getElementById("pendingList").classList.remove("hidden");
  document.getElementById("priorityList").classList.add("hidden");
  document.getElementById("detailsView").classList.add("hidden");
}

function showHighPriority() {
  document.getElementById("pendingList").classList.add("hidden");
  document.getElementById("priorityList").classList.remove("hidden");
  document.getElementById("detailsView").classList.add("hidden");
}

function openDetails() {
  document.getElementById("detailsView").classList.remove("hidden");
}s

function goBack() {
  showPending();
}

function toggle(btn) {
  const panel = btn.nextElementSibling;
  panel.style.display = panel.style.display === "block" ? "none" : "block";
}
