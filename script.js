// API URL to fetch products
const API_URL = 'https://dummyjson.com/products';

// DOM elements
const cartBtn = document.getElementById('cartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const productsContainer = document.querySelector('.products');
const cartSection = document.querySelector('.cart');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const header  = document.getElementById('header');
let cart = [];

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const products = data.products; // The products array from the API response
    console.log("products", products);
    
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Render products on the page
function renderProducts(products) {
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product'; // Using the class "product"

    let currentImageIndex = 0;
     // Function to update the image based on the current index
     const updateImage = () => {
        const imageElement = productDiv.querySelector('.product-image');
        imageElement.src = product.images[currentImageIndex]; // Update the image
      };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % product.images.length;
        updateImage();
      };
    
      // Function to go to the previous image
      const prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
        updateImage();
      };
      

    

    productDiv.innerHTML = `
      <div class="img_con">
      
       <button class="prevBtn">&#10094;</button> <!-- Left arrow button -->
        
       
        <img class="product-image" src="${product.images[currentImageIndex]}" alt="${product.title}" />
        
   
       <button class="nextBtn">&#10095;</button> <!-- Right arrow button -->
      </div>

      <div class="card_footer">
        <h3>${product.title}</h3>
        <p>Price : $${product.price}</p>
        <p>Rating: ${product.rating}</p>
        <button class="addToCartBtn" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
      </div>
    `;

    const prevBtn = productDiv.querySelector('.prevBtn');
    const nextBtn = productDiv.querySelector('.nextBtn');

    
    prevBtn.addEventListener('click', prevImage); // Attach prevImage function to prev button
    nextBtn.addEventListener('click', nextImage); // Attach nextImage function to next button

    productsContainer.appendChild(productDiv);
  });
}

// Function to add products to the cart
function addToCart(product) {
  
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        
        existingProduct.quantity += 1;
    } else {
        
        cart.push({...product, quantity: 1});
    }

    console.log('Cart:', cart);  // Log to check the cart
    updateCartDisplay();         // Update the cart UI
}



function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.innerHTML = '';  // Clear the current cart items

    // Loop through the cart and create the HTML for each item
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart_item';  // Add a class for styling
        
        // Display product details, quantity, and price, and only show the "Decrease" button
        cartItemDiv.innerHTML = `
            <span>${item.title}</span>
            <span>Quantity: ${item.quantity}</span>
            <span>Price: $${(item.quantity * item.price).toFixed(2)}</span>
            <button onclick="decreaseQuantity(${item.id})">-</button>
        `;

        // If quantity is 0, remove the item from the cart
        if (item.quantity === 0) {
            removeFromCart(item.id);
        }

        cartItemsContainer.appendChild(cartItemDiv);  // Add the new div to the container
    });
}


function decreaseQuantity(productId) {
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        if (product.quantity > 1) {
            // Decrease the quantity if it's greater than 1
            product.quantity -= 1;
        } else {
            // If the quantity is 1, remove the product from the cart
            removeFromCart(productId);
        }
    }

    updateCartDisplay();  // Re-render the cart after decreasing the quantity
}

function removeFromCart(productId) {
    // Remove the product from the cart array
    cart = cart.filter(item => item.id !== productId);

    updateCartDisplay();  // Re-render the cart after removal
}



  // Toggle between Cart and Products pages
  cartBtn.addEventListener('click', () => {
    cartSection.classList.toggle('show');
    productsContainer.style.display = cartSection.classList.contains('show') ? 'none' : 'flex';
  });
  
  // Handle checkout button
  checkoutBtn.addEventListener('click', () => {
    let totalPrice = 0;
    cart.forEach(item => {
      totalPrice += item.quantity * item.price;
    });
  
    alert(`Total Price: $${totalPrice.toFixed(2)}\nThank you for shopping with us!`);
    cart = []; // Clear the cart after checkout
    updateCartDisplay();
  });
  
// Initial page load
fetchProducts();


