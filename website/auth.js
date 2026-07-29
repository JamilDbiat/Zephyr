let isLogin = true;

function toggleMode() {
  console.log("toggle clicked"); // debug

  isLogin = !isLogin;

  const title = document.getElementById("title");
  const button = document.querySelector(".auth-btn");
  const switchText = document.getElementById("switchText");

  if (isLogin) {
    title.innerText = "Login";
    button.innerText = "Login";
    switchText.innerHTML =
      `Don't have an account? <span class="link" onclick="toggleMode()">Sign up</span>`;
  } else {
    title.innerText = "Sign Up";
    button.innerText = "Create Account";
    switchText.innerHTML =
      `Already have an account? <span class="link" onclick="toggleMode()">Login</span>`;
  }
}

function handleAuth() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (isLogin) {
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid login");
      return;
    }

    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";

  } else {
    const exists = users.find(u => u.username === username);

    if (exists) {
      alert("User already exists");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created! Now login.");
    toggleMode();
  }
}