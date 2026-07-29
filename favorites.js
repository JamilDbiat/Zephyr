// =========================
// 🔐 PROTECTION
// =========================
if (!localStorage.getItem("currentUser")) {
  window.location.href = "login.html";
}

// =========================
// 💾 GET FAVORITES
// =========================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const container = document.getElementById("favoritesContainer");

// =========================
// 🎨 RENDER FAVORITES
// =========================
function renderFavorites() {
  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#aaa;'>No favorites yet 💔</p>";
    return;
  }

  favorites.forEach((product, index) => {
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <div class="tag">FAVORITE</div>
      <div class="heart active">♥</div>
      <img src="${product.image}">
      <h2>${product.name}</h2>
      <p>$${product.price}</p>
      <button>Add to Cart</button>
    `;

    // ❤️ REMOVE FROM FAVORITES
    const heart = div.querySelector(".heart");
    heart.onclick = () => {
      favorites.splice(index, 1);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      renderFavorites();
    };

    // 🛒 ADD TO CART
    div.querySelector("button").onclick = () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
    };

    container.appendChild(div);
  });
}

// =========================
// 🚀 INIT
// =========================
renderFavorites();
window.addEventListener("favoritesUpdated", () => {
  favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (typeof renderProducts === "function") {
    renderProducts(products);
  }

  if (typeof renderFavorites === "function") {
    renderFavorites();
  }
});
function removeFavorite(product, element) {
  const index = favorites.findIndex(p => p.name === product.name);

  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // 💔 animation
    element.classList.add("removing");

    setTimeout(() => {
      renderFavorites();
    }, 300);

    // ⚡ sync
    window.dispatchEvent(new Event("favoritesUpdated"));
  }
}