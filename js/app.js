// app.js
// Generic helper function to fetch JSON
function fetchJson(url, options = {}) {
  return fetch(url, options)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .catch(err => console.error("API ERROR:", err));
}
