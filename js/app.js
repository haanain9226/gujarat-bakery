// =============================================
// Gujarat Bakery - Product Catalogue and Checkout
// =============================================
// Supabase Connection
// =============================================

const SUPABASE_URL = "https://ohuwsxeoqkzcilpnkpjv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY ="sb_publishable_d3Dyv4KI3Jo2OkznfFu5pw_NZExHAs9";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

const SHOP_WHATSAPP = "919723133486";

const STORAGE_KEY = "gujarat_bakery_products_v1";

// Initial sample products
const seed = [
  {
    id: 1,
    name: "Chocolate Birthday Cake",
    category: "Birthday Cakes",
    price: 650,
    unit: "Starting price",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85",
    description: "Rich chocolate layers for birthdays",
  },
  {
    id: 2,
    name: "Black Forest Cake",
    category: "Birthday Cakes",
    price: 600,
    unit: "Starting price",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=700&q=85",
    description: "Cream, chocolate and cherry",
  },
  {
    id: 3,
    name: "Vanilla Celebration Cake",
    category: "Birthday Cakes",
    price: 550,
    unit: "Starting price",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=85",
    description: "A classic celebration favourite",
  },
  {
    id: 4,
    name: "Custom Photo Cake",
    category: "Photo Cakes",
    price: 850,
    unit: "Starting price",
    image:
      "https://images.unsplash.com/photo-1557979619-445218f326b9?auto=format&fit=crop&w=700&q=85",
    description: "Personalise with your picture",
  },
  {
    id: 5,
    name: "Fresh Cream Pastry",
    category: "Pastries",
    price: 50,
    unit: "Per piece",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=85",
    description: "A little treat for any time",
  },
  {
    id: 6,
    name: "Chocolate Pastry",
    category: "Pastries",
    price: 60,
    unit: "Per piece",
    image:
      "https://images.unsplash.com/photo-1551024506-0?auto=format&fit=crop&w=700&q=85",
    description: "Chocolatey and creamy",
  },
  {
    id: 7,
    name: "Fresh Bread",
    category: "Bread, Biscuits & Toast",
    price: 40,
    unit: "Per loaf",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=85",
    description: "Soft bread for everyday meals",
  },
  {
    id: 8,
    name: "Butter Biscuits",
    category: "Bread, Biscuits & Toast",
    price: 80,
    unit: "Per pack",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=85",
    description: "Crunchy tea-time favourite",
  },
  {
    id: 9,
    name: "Toast Pack",
    category: "Bread, Biscuits & Toast",
    price: 60,
    unit: "Per pack",
    image:
      "https://images.unsplash.com/photo-1534620808146-d33bb39128b2?auto=format&fit=crop&w=700&q=85",
    description: "Crispy toast for chai time",
  },
  {
    id: 10,
    name: "Khari",
    category: "Khari, Puffs & Patties",
    price: 70,
    unit: "Per pack",
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484f2?auto=format&fit=crop&w=700&q=85",
    description: "Light and flaky tea-time snack",
  },
  {
    id: 11,
    name: "Veg Puff",
    category: "Khari, Puffs & Patties",
    price: 25,
    unit: "Per piece",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85",
    description: "Crispy savoury pastry",
  },
  {
    id: 12,
    name: "Veg Patties",
    category: "Khari, Puffs & Patties",
    price: 30,
    unit: "Per piece",
    image:
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=85",
    description: "A tasty bakery snack",
  },
];

// Application state
let products = [];
let cart = new Map();
let active = "All";

const cats = [
  "All",
  "Birthday Cakes",
  "Photo Cakes",
  "Pastries",
  "Bread, Biscuits & Toast",
  "Khari, Puffs & Patties",
];

const $ = (id) => document.getElementById(id);

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

// Load saved products from this browser; use sample products on first visit.
// Load products from Supabase database.
async function loadProducts() {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Supabase product loading error:", error.message);
    $("productGrid").innerHTML =
      "<p>Unable to load products. Please try again later.</p>";
    return [];
  }

  return data.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    unit: product.unit || "",
    image: product.image_url,
    description: product.description || "",
  }));
}

// Display product categories and products.
function drawProducts() {
  $("categories").innerHTML = cats
    .map(
      (category) => `
        <button
          class="category ${active === category ? "active" : ""}"
          data-cat="${category}"
        >
          ${category}
        </button>
      `,
    )
    .join("");

  const productList =
    active === "All"
      ? products
      : products.filter((product) => product.category === active);

  $("productGrid").innerHTML =
    productList
      .map(
        (product) => `
          <article class="product">
            <img
              src="${esc(product.image)}"
              alt="${esc(product.name)}"
              loading="lazy"
            >
            <div class="product-info">
              <small>${esc(product.category)}</small>
              <h3>${esc(product.name)}</h3>
              <p>${esc(product.description || "Fresh from our bakery")}</p>
              <div class="product-foot">
                <b>
                  ${money(+product.price)}
                  <small>${esc(product.unit || "")}</small>
                </b>
                <button class="add" data-add="${product.id}">
                  ＋ Add to basket
                </button>
              </div>
            </div>
          </article>
        `,
      )
      .join("") || "<p>No products in this category yet.</p>";
}

// Update the shopping basket.
function drawCart() {
  const items = [...cart.values()];
  const count = items.reduce((total, product) => total + product.qty, 0);

  $("cartCount").textContent = count;
  $("floatCount").textContent = count;

  $("basketItems").innerHTML = items.length
    ? items
        .map(
          (product) => `
            <div class="basket-row">
              <img src="${esc(product.image)}" alt="">
              <div>
                <h4>${esc(product.name)}</h4>
                <small>${money(+product.price)} each</small>
                <div class="qty">
                  <button data-qty="-1" data-id="${product.id}">−</button>
                  ${product.qty}
                  <button data-qty="1" data-id="${product.id}">+</button>
                </div>
              </div>
              <div>
                <b>${money(product.price * product.qty)}</b><br>
                <button class="remove" data-remove="${product.id}">
                  Remove
                </button>
              </div>
            </div>
          `,
        )
        .join("")
    : '<div class="empty">Your basket is empty. Add something delicious!</div>';

  const total = items.reduce(
    (sum, product) => sum + product.price * product.qty,
    0,
  );
  $("basketTotal").textContent = money(total);
}

// Escape text before inserting it into HTML.
function esc(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

// Open and close the basket drawer.
function showCart() {
  $("backdrop").classList.add("show");
  $("cartDrawer").classList.add("show");
}

function hideCart() {
  $("backdrop").classList.remove("show");
  $("cartDrawer").classList.remove("show");
}

// Category filter.
$("categories").addEventListener("click", (event) => {
  const button = event.target.closest("[data-cat]");

  if (button) {
    active = button.dataset.cat;
    drawProducts();
  }
});

// Add products, change quantities and remove products from the basket.
document.addEventListener("click", (event) => {
  let button = event.target.closest("[data-add]");

  if (button) {
    const product = products.find((item) => item.id == button.dataset.add);
    if (!product) return;

    const existingItem = cart.get(product.id);
    cart.set(product.id, {
      ...product,
      qty: (existingItem?.qty || 0) + 1,
    });

    drawCart();
    button.textContent = "Added ✓";
    setTimeout(() => {
      button.textContent = "＋ Add to basket";
    }, 700);
  }

  button = event.target.closest("[data-qty]");

  if (button) {
    const product = cart.get(+button.dataset.id);
    if (!product) return;

    product.qty += +button.dataset.qty;
    if (product.qty < 1) {
      cart.delete(product.id);
    }
    drawCart();
  }

  button = event.target.closest("[data-remove]");

  if (button) {
    cart.delete(+button.dataset.remove);
    drawCart();
  }
});

// Basket controls and Escape key.
["cartOpen", "floatCart"].forEach((id) => {
  $(id).onclick = showCart;
});

$("cartClose").onclick = hideCart;
$("backdrop").onclick = hideCart;

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideCart();
    $("adminModal").classList.remove("show");
  }
});

// Show or hide the delivery address field based on order type.
$("orderType").onchange = () => {
  const isDelivery = $("orderType").value === "Home delivery";
  $("addressWrap").style.display = isDelivery ? "grid" : "none";
  $("buyerAddress").required = isDelivery;
};

// Prevent selecting a date in the past and set the copyright year.
const now = new Date();
const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
$("requiredDate").min = localToday.toISOString().slice(0, 10);
$("year").textContent = new Date().getFullYear();

// Send the completed order to the bakery through WhatsApp.
$("orderForm").onsubmit = (event) => {
  event.preventDefault();

  const items = [...cart.values()];
  const status = $("orderStatus");

  if (!items.length) {
    status.textContent = "Please add products first.";
    return;
  }

  const orderType = $("orderType").value;
  const address = $("buyerAddress").value.trim();

  if (orderType === "Home delivery" && !address) {
    status.textContent = "Please enter delivery address.";
    return;
  }

  // Prepare order items in Gujarati.
  const orderRows = items
    .map(
      (product, index) => `${index + 1}. ${product.name} — ${product.qty} નંગ`,
    )
    .join("\n");

  // Calculate total order amount.
  const total = items.reduce(
    (sum, product) => sum + product.price * product.qty,
    0,
  );

  // Create Gujarati WhatsApp order message.
  const message = [
    " નવો ઓર્ડર — ગુજરાત બેકરી",
    "",
    "ગ્રાહકની માહિતી:",
    `નામ: ${$("buyerName").value}`,
    `મોબાઇલ નંબર: ${$("buyerPhone").value}`,
    "",
    "ઓર્ડરની વિગતો:",
    orderRows,
    "",
    `કિંમત: ${money(total)}`,
    "",
    `ઓર્ડર પ્રકાર: ${
      orderType === "Home delivery" ? "હોમ ડિલિવરી" : "બેકરી પરથી લઈ જવું"
    }`,
    ...(orderType === "Home delivery" ? [`સરનામું: ${address}`] : []),
    `તારીખ: ${$("requiredDate").value}`,
    `સમય: ${$("requiredTime").value || "નક્કી નથી"}`,
    "",
    `કેક પર લખવાનો મેસેજ: ${$("cakeText").value || "નથી"}`,
    `ખાસ સૂચનાઓ: ${$("orderNotes").value || "નથી"}`,
    "",
    "કૃપા કરીને ઓર્ડર કન્ફર્મ કરો.",
  ].join("\n");

  window.open(
    `https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );

  cart.clear();
  drawCart();

  // Reset all customer and checkout fields.
  $("orderForm").reset();

  status.textContent =
    "WhatsApp opened. Press Send there to submit your order.";
};

// Open and close the Admin Panel.
$("adminOpen").onclick = () => {
  $("adminModal").classList.add("show");
  $("adminModal").setAttribute("aria-hidden", "false");
};

$("adminClose").onclick = () => {
  $("adminModal").classList.remove("show");
  $("adminModal").setAttribute("aria-hidden", "true");
};

// Authorized admin user ID.
const ADMIN_USER_ID = "30c27663-e30e-4b7e-8a0d-0f7fedd347bc";

// Show Admin Panel after successful authentication.
function showAdminPanel() {
  $("adminLogin").hidden = true;
  $("adminTools").hidden = false;
  $("loginStatus").textContent = "";
  drawAdmin();
}

// Supabase Admin Login.
$("loginBtn").onclick = async () => {
  const email = $("adminEmail").value.trim();
  const password = $("adminPassword").value;
  const status = $("loginStatus");

  if (!email || !password) {
    status.textContent = "Please enter email and password.";
    return;
  }

  status.textContent = "Signing in...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    status.textContent = error.message;
    return;
  }

  if (data.user.id !== ADMIN_USER_ID) {
    await supabaseClient.auth.signOut();
    status.textContent = "This account is not authorized as bakery admin.";
    return;
  }

  showAdminPanel();
};

// Admin Logout.
$("logoutBtn").onclick = async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Logout failed: " + error.message);
    return;
  }

  $("adminTools").hidden = true;
  $("adminLogin").hidden = false;
  $("adminEmail").value = "";
  $("adminPassword").value = "";
  $("loginStatus").textContent = "";
};

// Display the product list inside the Admin Panel.
function drawAdmin() {
  $("adminProductList").innerHTML = products
    .map(
      (product) => `
        <div class="admin-list-row">
          <img src="${esc(product.image)}" alt="">
          <div class="grow">
            <b>${esc(product.name)}</b><br>
            ${money(+product.price)} · ${esc(product.category)}
          </div>
          <button data-edit="${product.id}">Edit</button>
          <button data-del="${product.id}">Delete</button>
        </div>
      `,
    )
    .join("");
}

// Start adding a new product.
$("newProduct").onclick = () => {
  $("productForm").hidden = false;
  $("formTitle").textContent = "Add product";
  $("productForm").reset();
  $("editId").value = "";
};

// Cancel product entry.
$("cancelProduct").onclick = () => {
  $("productForm").hidden = true;
};

// Edit or delete products from the Admin Panel.
$("adminProductList").onclick = async (event) => {
  let button = event.target.closest("[data-edit]");

  if (button) {
    const product = products.find((item) => item.id == button.dataset.edit);

    if (product) {
      $("productForm").hidden = false;
      $("formTitle").textContent = "Edit product";
      $("editId").value = product.id;
      $("pName").value = product.name;
      $("pCategory").value = product.category;
      $("pPrice").value = product.price;
      $("pUnit").value = product.unit || "";
      $("pImage").value = product.image;
      $("pImageFile").value = "";
      $("imageUploadStatus").textContent = "";
      $("pDescription").value = product.description || "";
    }
  }

   button = event.target.closest("[data-del]");

  if (button && confirm("Delete this product?")) {
    const productId = Number(button.dataset.del);

    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    // Delete product from database
    const { error: dbError } = await supabaseClient
      .from("products")
      .delete()
      .eq("id", productId);

    if (dbError) {
      alert("Product deletion failed: " + dbError.message);
      return;
    }

    // Delete image from Supabase Storage
    let imageWarning = "";

    try {
      const imageUrl = new URL(product.image);
      const marker = "/storage/v1/object/public/product-images/";

      if (
        imageUrl.origin === SUPABASE_URL &&
        imageUrl.pathname.includes(marker)
      ) {
        const filePath = decodeURIComponent(
          imageUrl.pathname.split(marker)[1]
        );

        const { error: storageError } = await supabaseClient
          .storage
          .from("product-images")
          .remove([filePath]);

        if (storageError) {
          imageWarning = "Image deletion failed: " + storageError.message;
        }
      }
    } catch (error) {
      imageWarning = "Image cleanup failed: " + error.message;
    }

    products = products.filter(
      (item) => item.id !== productId
    );

    drawProducts();
    drawAdmin();

    alert(
      imageWarning ||
      "Product and its image deleted successfully."
    );
  }
};

// Save a new product or update an existing product in Supabase.
$("productForm").onsubmit = async (event) => {
  event.preventDefault();

  const editId = $("editId").value;
  const imageFile = $("pImageFile").files[0];
  const status = $("imageUploadStatus");

  let imageUrl = $("pImage").value.trim();

  const item = {
    name: $("pName").value.trim(),
    category: $("pCategory").value,
    price: Number($("pPrice").value),
    unit: $("pUnit").value.trim(),
    description: $("pDescription").value.trim(),
  };

  if (!item.name || !Number.isFinite(item.price) || item.price <= 0) {
    alert("Please enter valid product details.");
    return;
  }

  // Validate selected image.
  if (imageFile) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(imageFile.type)) {
      alert("Please select a JPG, PNG or WebP image.");
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5 MB.");
      return;
    }

    status.textContent = "Uploading image...";

    const safeName = imageFile.name.toLowerCase().replace(/[^a-z0-9.-]/g, "-");

    const filePath = Date.now() + "-" + crypto.randomUUID() + "-" + safeName;

    const { error: uploadError } = await supabaseClient.storage
      .from("product-images")
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      status.textContent = "";
      alert("Image upload failed: " + uploadError.message);
      return;
    }

    const { data: publicData } = supabaseClient.storage
      .from("product-images")
      .getPublicUrl(filePath);

    imageUrl = publicData.publicUrl;
  }

  if (!imageUrl) {
    status.textContent = "";
    alert("Please select a product image.");
    return;
  }

  item.image_url = imageUrl;

  status.textContent = "Saving product...";

  let result;

  if (editId) {
    result = await supabaseClient
      .from("products")
      .update(item)
      .eq("id", Number(editId))
      .select()
      .single();
  } else {
    result = await supabaseClient
      .from("products")
      .insert(item)
      .select()
      .single();
  }

  if (result.error) {
    status.textContent = "";
    alert("Product save failed: " + result.error.message);
    return;
  }

  const savedProduct = {
    id: result.data.id,
    name: result.data.name,
    category: result.data.category,
    price: Number(result.data.price),
    unit: result.data.unit || "",
    image: result.data.image_url,
    description: result.data.description || "",
  };

  const existingIndex = products.findIndex(
    (product) => product.id === savedProduct.id,
  );

  if (existingIndex >= 0) {
    products[existingIndex] = savedProduct;
  } else {
    products.push(savedProduct);
  }

  drawProducts();
  drawAdmin();

  $("productForm").hidden = true;
  event.target.reset();
  $("pImage").value = "";
  status.textContent = "";

  alert("Product saved successfully!");
};

// Export the product catalogue as a JSON file.
$("exportProducts").onclick = () => {
  download(
    "gujarat-bakery-products.json",
    JSON.stringify(products, null, 2),
    "application/json",
  );
};

// Import catalogue into Supabase.
$("importProducts").onchange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const data = JSON.parse(await file.text());

    const isValidCatalogue =
      Array.isArray(data) &&
      data.every(
        (product) =>
          product.name &&
          product.category &&
          product.image &&
          Number.isFinite(+product.price) &&
          +product.price > 0,
      );

    if (!isValidCatalogue) {
      throw new Error("Invalid catalogue");
    }

    const rows = data.map((product) => ({
      name: product.name,
      category: product.category,
      price: Number(product.price),
      unit: product.unit || "",
      image_url: product.image.replace(/\\/g, "/"),
      description: product.description || "",
    }));

    const { error } = await supabaseClient.from("products").insert(rows);

    if (error) {
      throw error;
    }

    const { data: refreshedProducts, error: fetchError } = await supabaseClient
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (fetchError) {
      throw fetchError;
    }

    products = refreshedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      unit: product.unit || "",
      image: product.image_url,
      description: product.description || "",
    }));

    drawProducts();
    drawAdmin();

    alert("Catalogue imported successfully!");
  } catch (error) {
    console.error("Catalogue import error:", error);
    alert("Import failed: " + error.message);
  }

  event.target.value = "";
};

// Create and download a file.
function download(name, data, type) {
  const anchor = document.createElement("a");
  const url = URL.createObjectURL(new Blob([data], { type }));

  anchor.href = url;
  anchor.download = name;
  anchor.click();

  URL.revokeObjectURL(url);
}

// Initialize website with products from Supabase.
async function initializeApp() {
  products = await loadProducts();

  drawProducts();
  drawCart();
}

initializeApp();
