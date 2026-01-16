
// ===============================
// LOGIN PAGE LOGIC
// ===============================

console.log("login.js loaded");

const password = document.getElementById("password");
const toggleEye = document.getElementById("toggleEye");
const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");

// ===============================
// TOGGLE PASSWORD VISIBILITY
// ===============================
toggleEye.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    toggleEye.src = "./assets/humbleicons--eye-close.svg";
  } else {
    password.type = "password";
    toggleEye.src = "./assets/fluent--eye-20-filled.svg";
  }
});

// ===============================
// LOGIN HANDLER
// ===============================
loginBtn.addEventListener("click", async () => {
  console.log("Login button clicked");

  const email = emailInput.value.trim();
  const passwordValue = password.value.trim();

  if (!email || !passwordValue) {
    alert("Please enter email and password");
    return;
  }

  try {
    const response = await fetch(
      "https://shiftswap-backend-4w40.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: passwordValue
        })
      }
    );

    const data = await response.json();
    console.log("Login response:", data);

    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // ===============================
    // SAVE AUTH DATA
    // ===============================
    localStorage.setItem("token", data.token);
    localStorage.setItem("adminProfile", JSON.stringify(data));

    let data2 = JSON.stringify(data);


    console.log("I am here");
    console.log(data.data.user.role);

    // ===============================
    // ROLE CHECK
    // ===============================
    if (data.data.user.role !== "manager") {
      alert("Access denied. Managers only.");
      localStorage.clear();
      return;
    }

    // ===============================
    // REDIRECT TO DASHBOARD
    // ===============================
    console.log("Redirecting to dashboard...");
    window.location.replace("dashboard.html");

  } catch (error) {
    console.log("Login error:", error);
    alert("Something went wrong. Try again.");

  }
});
