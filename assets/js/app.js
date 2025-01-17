// Define variable & select elements
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// Let's cart
let cart = [];
let buttonsDOM = [];

// Product data
const productsData = [
  {
    sys: { id: "1" },
    fields: {
      title: "queen panel bed",
      price: 10.99,
      image: { fields: { file: { url: "./assets/img/product-1.jpeg" } } }
    }
  },
  {
    sys: { id: "2" },
    fields: {
      title: "king panel bed",
      price: 12.99,
      image: { fields: { file: { url: "./assets/img/product-2.jpeg" } } }
    }
  },
  {
    sys: { id: "3" },
    fields: {
      title: "single panel bed",
      price: 12.99,
      image: { fields: { file: { url: "./assets/img/product-3.jpeg" } } }
    }
  },
  {
    sys: { id: "4" },
    fields: {
      title: "twin panel bed",
      price: 22.99,
      image: { fields: { file: { url: "./assets/img/product-4.jpeg" } } }
    }
  },
  {
    sys: { id: "5" },
    fields: {
      title: "fridge",
      price: 88.99,
      image: { fields: { file: { url: "./assets/img/product-5.jpeg" } } }
    }
  },
  {
    sys: { id: "6" },
    fields: {
      title: "dresser",
      price: 32.99,
      image: { fields: { file: { url: "./assets/img/product-6.jpeg" } } }
    }
  },
  {
    sys: { id: "7" },
    fields: {
      title: "couch",
      price: 45.99,
      image: { fields: { file: { url: "./assets/img/product-7.jpeg" } } }
    }
  },
  {
    sys: { id: "8" },
    fields: {
      title: "table",
      price: 33.99,
      image: { fields: { file: { url: "./assets/img/product-8.jpeg" } } }
    }
  }
];

// Getting the products
class Products {
  getProducts() {
    try {
      let products = productsData.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log("Error getting products:", error);
    }
  }
}

// Display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
      <!-- single product start -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />

            <button class="bag-btn" data-id=${product.id}>
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
              add to cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>Price: $${product.price}</h4>
        </article>
        <!-- single product end -->`;
    });
    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    // Bag buttons
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;

    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } else {
        button.addEventListener("click", (event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;

          // Get product from products
          let cartItem = { ...Storage.getProduct(id), amount: 1 };

          // Add product to the cart
          cart = [...cart, cartItem];

          // Save cart in local storage
          Storage.saveCart(cart);

          // Set cart values
          this.setCartValues(cart);

          // Display cart item
          this.addCartItem(cartItem);

          // Show the cart
          this.showCart();
        });
      }
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `<img src=${item.image} alt="product" />

            <div>
              <h4>${item.title}</h4>
              <h5>Price: $${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>

            <div>
              <i class="fa fa-chevron-up" aria-hidden="true" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fa fa-chevron-down" aria-hidden="true" data-id=${item.id}></i>
            </div>`;

    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);

    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;

        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);

    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart"></i>add to cart`;
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupAPP();
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
  Storage.saveProducts(productsData);
  ui.getBagButtons();
  ui.cartLogic();
});

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupAPP();
  const productsData = products.getProducts();
  ui.displayProducts(productsData);
  Storage.saveProducts(productsData);
  ui.getBagButtons();
  ui.cartLogic();

  // Toggle navbar
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show-nav");
  });
});
