// =========================
// 🔐 SAFE PAGE PROTECTION
// =========================
const currentUser = localStorage.getItem("currentUser");

const isProtectedPage =
  window.location.pathname.includes("index.html") ||
  window.location.pathname.includes("cart.html");

if (isProtectedPage && !currentUser) {
  window.location.href = "login.html";
}

// =========================
// 🛍 PRODUCTS
// =========================
const products = [
  { name: "The World / Dio Set + F", price: 1.99, image: "images/dio.png" },
  { name: "Ice Queen Set + F", price: 4.98, image: "images/IceQueenSet+F.png" },
  { name: "Anti Magic", price: 11.99, image: "images/AntiMagic.png" },
  { name: "300X Cosmetic Crate", price: 6.99, image: "images/300XCosmeticCrate.png" },
  { name: "Friren / Great Mage + F Materials", price: 9.99, image: "images/mage.png" },
  { name: "Easter Key 500X", price: 5.99, image: "images/EasterKey500X.png" },
  { name: "Easter Egg 500X", price: 5.99, image: "images/EasterEgg500X.png" }
];

// =========================
// 💾 STORAGE
// =========================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// =========================
// 🎯 ELEMENTS
// =========================
const cartDisplay = document.getElementById("cart");
const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const userDisplay = document.getElementById("userDisplay");
const logoutBtn = document.getElementById("logoutBtn");

// =========================
// 👤 USER DISPLAY
// =========================
if (userDisplay && currentUser) {
  userDisplay.innerText = "👤 " + currentUser;
}

// =========================
// 🛒 CART
// =========================
function updateCartUI() {
  if (cartDisplay) {
    cartDisplay.innerText = cart.length;
  }
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// =========================
// ❤️ FAVORITES
// =========================
function toggleFavorite(product) {
  const index = favorites.findIndex(p => p.name === product.name);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(product);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// =========================
// 🎨 RENDER PRODUCTS
// =========================
function renderProducts(list) {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  list.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";

    const isFav = favorites.some(p => p.name === product.name);

    div.innerHTML = `
      <div class="tag">LIMITED</div>
      <div class="heart ${isFav ? "active" : ""}">
        ${isFav ? "❤️" : "🤍"}
      </div>
      <img src="${product.image}">
      <h2>${product.name}</h2>
      <p>$${product.price}</p>
      <button>Add to Cart</button>
    `;

    // ❤️ favorite
    const heart = div.querySelector(".heart");

    heart.onclick = () => {
      toggleFavorite(product);

      favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      const isNowFav = favorites.some(p => p.name === product.name);

      heart.classList.toggle("active", isNowFav);
      heart.innerHTML = isNowFav ? "❤️" : "🤍";

      heart.style.transform = "scale(1.3)";
      setTimeout(() => {
        heart.style.transform = "scale(1)";
      }, 150);
    };

    // 🛒 cart
    div.querySelector("button").onclick = () => {
      addToCart(product);
    };

    // 🔥 hover tilt effect
    div.addEventListener("mousemove", (e) => {
      const rect = div.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (y - rect.height / 2) / 12;
      const rotateY = (rect.width / 2 - x) / 12;

      div.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.05)
      `;
    });

    div.addEventListener("mouseleave", () => {
      div.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
    });

    productsContainer.appendChild(div);
  });
}

// =========================
// 🔍 SEARCH
// =========================
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(value)
    );
    renderProducts(filtered);
  });
}

// =========================
// 🔐 LOGOUT
// =========================
if (logoutBtn) {
  logoutBtn.onclick = () => {
    localStorage.clear();
    window.location.href = "login.html";
  };
}

// =========================
// ✨ CURSOR EFFECTS (SAFE)
// =========================
function initCursorEffects() {
  if (document.querySelector(".cursor-glow")) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";

    const trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = e.clientX + "px";
    trail.style.top = e.clientY + "px";

    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 250);
  });
}

// =========================
// 🚀 INIT (SAFE)
// =========================
updateCartUI();

if (productsContainer) {
  renderProducts(products);
}

window.addEventListener("load", () => {
  initCursorEffects();
});

window.addEventListener("favoritesUpdated", () => {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (typeof renderProducts === "function") {
    renderProducts(products);
  }

  if (typeof renderFavorites === "function") {
    renderFavorites();
  }
});
