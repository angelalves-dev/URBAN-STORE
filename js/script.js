/* =========================================================
   URBAN STORE - SCRIPT FINAL
   IMAGENS LOCAIS
========================================================= */


/* =========================================================
   PRODUTOS
========================================================= */

const defaultProducts = [

    {
        id: 1,
        name: "Camiseta Basic Black",
        price: 79.90,
        category: "camisetas",
        image: "img/camiseta-basic-black.jpg",
        description: "Camiseta preta básica com visual moderno.",
        stock: 10
    },

    {
        id: 2,
        name: "Camiseta Urban White",
        price: 79.90,
        category: "camisetas",
        image: "img/camiseta-urban-white.jpg",
        description: "Camiseta branca minimalista para qualquer ocasião.",
        stock: 10
    },

    {
        id: 3,
        name: "Camiseta Oversized Gray",
        price: 99.90,
        category: "camisetas",
        image: "img/camiseta-oversized-gray.jpg",
        description: "Camiseta oversized cinza com estilo urbano.",
        stock: 10
    },

    {
        id: 4,
        name: "Calça Jeans Classic",
        price: 159.90,
        category: "calcas",
        image: "img/calca-jeans-classic.jpg",
        description: "Calça jeans clássica com corte moderno.",
        stock: 10
    },

    {
        id: 5,
        name: "Calça Cargo Urban",
        price: 179.90,
        category: "calcas",
        image: "img/calca-cargo-urban.jpg",
        description: "Calça cargo inspirada no streetwear.",
        stock: 10
    },

    {
        id: 6,
        name: "Calça Jogger Black",
        price: 149.90,
        category: "calcas",
        image: "img/calca-jogger-black.jpg",
        description: "Calça jogger preta confortável e versátil.",
        stock: 10
    },

    {
        id: 7,
        name: "Urban Runner",
        price: 299.90,
        category: "tenis",
        image: "img/urban-runner.jpg",
        description: "Tênis esportivo com design urbano.",
        stock: 10
    },

    {
        id: 8,
        name: "Street Classic",
        price: 279.90,
        category: "tenis",
        image: "img/street-classic.jpg",
        description: "Tênis clássico para composições urbanas.",
        stock: 10
    },

    {
        id: 9,
        name: "Sport Motion",
        price: 349.90,
        category: "tenis",
        image: "img/sport-motion.jpg",
        description: "Tênis esportivo de alta performance.",
        stock: 10
    },

    {
        id: 10,
        name: "Boné Urban",
        price: 69.90,
        category: "acessorios",
        image: "img/bone-urban.jpg",
        description: "Boné urbano com design minimalista.",
        stock: 10
    },

    {
        id: 11,
        name: "Mochila Street",
        price: 129.90,
        category: "acessorios",
        image: "img/mochila-street.jpg",
        description: "Mochila prática para rotina e viagens.",
        stock: 10
    },

    {
        id: 12,
        name: "Relógio Classic",
        price: 199.90,
        category: "acessorios",
        image: "img/relogio-classic.jpg",
        description: "Relógio clássico com acabamento moderno.",
        stock: 10
    }

];


/* =========================================================
   UTILIDADES
========================================================= */

function formatPrice(value) {

    return Number(value || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function getCategoryName(category) {

    const categories = {

        camisetas: "Camisetas",
        calcas: "Calças",
        tenis: "Tênis",
        acessorios: "Acessórios",
        outros: "Outros"

    };

    return categories[category] || "Outros";

}


/* =========================================================
   PRODUTOS
========================================================= */

function normalizeProduct(product) {

    return {

        id: product.id,

        name: product.name || "Produto",

        price: Number(product.price) || 0,

        category: product.category || "outros",

        image: product.image || "img/produto.jpg",

        description:
            product.description ||
            "Produto Urban Store.",

        stock:
            product.stock === undefined
                ? 10
                : Math.max(
                    0,
                    Number(product.stock) || 0
                )

    };

}


function getProducts() {

    let products = [...defaultProducts];

    let savedProducts = [];

    let deletedProducts = [];

    try {

        savedProducts =
            JSON.parse(
                localStorage.getItem("urbanProducts")
            ) || [];

    } catch {

        savedProducts = [];

    }


    try {

        deletedProducts =
            JSON.parse(
                localStorage.getItem(
                    "urbanDeletedProducts"
                )
            ) || [];

    } catch {

        deletedProducts = [];

    }


    savedProducts.forEach(saved => {

        const normalized =
            normalizeProduct(saved);

        const index =
            products.findIndex(
                product =>
                    String(product.id) ===
                    String(normalized.id)
            );

        if (index !== -1) {

            products[index] =
                normalized;

        } else {

            products.push(
                normalized
            );

        }

    });


    products =
        products.filter(
            product =>
                !deletedProducts.includes(
                    Number(product.id)
                )
        );


    return products;

}


function getProductById(id) {

    return getProducts().find(
        product =>
            String(product.id) ===
            String(id)
    );

}


/* =========================================================
   CARRINHO
========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem("urbanCart")
        ) || [];

    } catch {

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        "urbanCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


function updateCartCount() {

    const cart =
        getCart();

    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                (Number(item.quantity) || 0),
            0
        );

    document
        .querySelectorAll("#cart-count")
        .forEach(element => {

            element.textContent =
                total;

        });

}


/* =========================================================
   CORRIGIR CARRINHO
========================================================= */

function sanitizeCart() {

    const products =
        getProducts();

    let cart =
        getCart();

    cart =
        cart
            .map(item => {

                const product =
                    products.find(
                        p =>
                            String(p.id) ===
                            String(item.id)
                    );

                if (!product) {
                    return null;
                }

                const stock =
                    Number(product.stock) || 0;

                if (stock <= 0) {
                    return null;
                }

                const quantity =
                    Math.min(
                        Math.max(
                            1,
                            Number(item.quantity) || 1
                        ),
                        stock
                    );

                return {

                    id: product.id,

                    quantity

                };

            })
            .filter(Boolean);

    localStorage.setItem(
        "urbanCart",
        JSON.stringify(cart)
    );

    updateCartCount();

    return cart;

}


/* =========================================================
   ADICIONAR AO CARRINHO
========================================================= */

function addToCart(id) {

    const product =
        getProductById(id);

    if (!product) {

        alert(
            "Produto não encontrado."
        );

        return;

    }

    const stock =
        Number(product.stock) || 0;

    if (stock <= 0) {

        alert(
            "Este produto está esgotado."
        );

        return;

    }

    let cart =
        getCart();

    const existing =
        cart.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if (existing) {

        if (
            Number(existing.quantity) >=
            stock
        ) {

            alert(
                `Limite de estoque atingido. Há apenas ${stock} unidade(s) disponível(is).`
            );

            return;

        }

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            quantity: 1

        });

    }

    saveCart(cart);

    alert(
        "Produto adicionado ao carrinho!"
    );

}


/* =========================================================
   PÁGINA DE PRODUTOS
========================================================= */

function initProductsPage() {

    const grid =
        document.getElementById(
            "products-grid"
        );

    if (!grid) {
        return;
    }

    const categoryFilter =
        document.getElementById(
            "category-filter"
        );

    const priceFilter =
        document.getElementById(
            "price-filter"
        );

    const searchInput =
        document.getElementById(
            "product-search"
        );

    const sortSelect =
        document.getElementById(
            "sort-filter"
        );

    const countElement =
        document.getElementById(
            "products-count"
        );

    const noProducts =
        document.getElementById(
            "no-products"
        );

    const clearFilters =
        document.getElementById(
            "clear-filters"
        );


    const products =
        getProducts();


    function renderProducts() {

        let filtered =
            [...products];


        /* CATEGORIA */

        if (
            categoryFilter &&
            categoryFilter.value !== "todos"
        ) {

            filtered =
                filtered.filter(
                    product =>
                        product.category ===
                        categoryFilter.value
                );

        }


        /* PREÇO */

        if (
            priceFilter &&
            priceFilter.value !== "todos"
        ) {

            const range =
                priceFilter.value;

            filtered =
                filtered.filter(product => {

                    const price =
                        Number(product.price);

                    if (range === "0-100") {

                        return price <= 100;

                    }

                    if (range === "100-200") {

                        return (
                            price > 100 &&
                            price <= 200
                        );

                    }

                    if (range === "200-999") {

                        return price > 200;

                    }

                    return true;

                });

        }


        /* BUSCA */

        if (searchInput) {

            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();

            if (search) {

                filtered =
                    filtered.filter(
                        product =>
                            product.name
                                .toLowerCase()
                                .includes(search)
                    );

            }

        }


        /* ORDENAÇÃO */

        if (sortSelect) {

            const sort =
                sortSelect.value;

            if (sort === "low") {

                filtered.sort(
                    (a, b) =>
                        a.price - b.price
                );

            }

            if (sort === "high") {

                filtered.sort(
                    (a, b) =>
                        b.price - a.price
                );

            }

            if (sort === "name") {

                filtered.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name
                        )
                );

            }

        }


        /* CONTADOR */

        if (countElement) {

            countElement.textContent =
                filtered.length;

        }


        /* SEM PRODUTOS */

        if (!filtered.length) {

            grid.innerHTML = "";

            if (noProducts) {

                noProducts.style.display =
                    "block";

            }

            return;

        }


        if (noProducts) {

            noProducts.style.display =
                "none";

        }


        /* RENDER */

        grid.innerHTML =
            filtered.map(product => {

                const stock =
                    Number(product.stock) || 0;

                return `

                    <article
                        class="product-card shop-product"
                        data-name="${product.name}"
                        data-category="${product.category}"
                        data-price="${product.price}"
                    >

                        <a
                            href="produto.html?id=${product.id}"
                            class="product-image-link"
                        >

                            <div class="product-image">

                                <img
                                    src="${product.image}"
                                    alt="${product.name}"
                                    onerror="this.onerror=null;this.src='img/produto.jpg';"
                                >

                            </div>

                        </a>


                        <div class="product-info">

                            <span class="product-category">
                                ${getCategoryName(product.category)}
                            </span>


                            <h3>
                                <a
                                    href="produto.html?id=${product.id}"
                                >
                                    ${product.name}
                                </a>
                            </h3>


                            <strong>
                                ${formatPrice(product.price)}
                            </strong>


                            <p
                                style="
                                    margin:8px 0;
                                    font-size:14px;
                                    color:#666;
                                "
                            >
                                Estoque:
                                <strong>
                                    ${stock}
                                </strong>
                                unidade(s)
                            </p>


                            <div
                                class="product-card-actions"
                            >

                                <a
                                    href="produto.html?id=${product.id}"
                                    class="btn btn-outline"
                                >
                                    Ver produto
                                </a>


                                <button
                                    class="add-cart"
                                    data-id="${product.id}"
                                    ${stock <= 0 ? "disabled" : ""}
                                >

                                    <i
                                        class="fa-solid fa-cart-plus"
                                    ></i>

                                </button>

                            </div>


                            ${
                                stock <= 0
                                    ? `
                                        <small
                                            style="
                                                color:#d00000;
                                                font-weight:600;
                                            "
                                        >
                                            Produto esgotado
                                        </small>
                                    `
                                    : stock <= 5
                                        ? `
                                            <small
                                                style="
                                                    color:#b06a00;
                                                    font-weight:600;
                                                "
                                            >
                                                Últimas ${stock} unidades
                                            </small>
                                        `
                                        : ""
                            }

                        </div>

                    </article>

                `;

            }).join("");


        grid
            .querySelectorAll(".add-cart")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        addToCart(
                            button.dataset.id
                        );

                    }
                );

            });

    }


    [
        categoryFilter,
        priceFilter,
        searchInput,
        sortSelect
    ]
        .filter(Boolean)
        .forEach(element => {

            element.addEventListener(
                "input",
                renderProducts
            );

            element.addEventListener(
                "change",
                renderProducts
            );

        });


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            () => {

                if (categoryFilter) {
                    categoryFilter.value = "todos";
                }

                if (priceFilter) {
                    priceFilter.value = "todos";
                }

                if (searchInput) {
                    searchInput.value = "";
                }

                if (sortSelect) {
                    sortSelect.value = "default";
                }

                renderProducts();

            }
        );

    }


    renderProducts();

}


/* =========================================================
   PÁGINA DO PRODUTO
========================================================= */

function initProductPage() {

    const productContainer =
        document.getElementById("product-details") ||
        document.getElementById("product-page");

    if (!productContainer) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {

        productContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Produto não encontrado</h2>

                <p>
                    Nenhum produto foi selecionado.
                </p>

                <a href="produtos.html" class="btn btn-primary">
                    Voltar para produtos
                </a>
            </div>
        `;

        return;
    }

    const product =
        getProductById(id);

    if (!product) {

        productContainer.innerHTML = `
            <div class="product-not-found">

                <h2>
                    Produto não encontrado
                </h2>

                <p>
                    O produto solicitado não existe ou foi removido.
                </p>

                <a
                    href="produtos.html"
                    class="btn btn-primary"
                >
                    Voltar para produtos
                </a>

            </div>
        `;

        return;
    }

    const stock =
        Number(product.stock) || 0;

    productContainer.innerHTML = `

        <div class="product-detail">

            <div class="product-detail-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    onerror="this.onerror=null;this.src='img/produto.jpg'"
                >

            </div>


            <div class="product-detail-info">

                <span class="product-category">
                    ${getCategoryName(product.category)}
                </span>


                <h1>
                    ${product.name}
                </h1>


                <strong>
                    ${formatPrice(product.price)}
                </strong>


                <p>
                    ${product.description}
                </p>


                ${
                    stock <= 0
                    ? `
                        <div class="stock-out">
                            Produto esgotado
                        </div>
                    `
                    : `
                        <div class="stock-info">
                            <strong>
                                ${stock}
                            </strong>
                            unidade(s) disponível(is)
                        </div>

                        <button
                            type="button"
                            id="product-add-cart"
                            class="add-cart-button"
                        >

                            Adicionar ao carrinho

                            <i class="fa-solid fa-bag-shopping"></i>
                        </button>
                    `
                }

            </div>

        </div>

    `;


    const addButton =
        document.getElementById(
            "product-add-cart"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                addToCart(product.id);

            }
        );

    }

}


/* =========================================================
   CARRINHO
========================================================= */

function initCartPage() {

    const container =
        document.getElementById(
            "cart-items"
        );

    if (!container) {
        return;
    }


    function renderCart() {

        let cart =
            sanitizeCart();


        if (!cart.length) {

            container.innerHTML = `

                <div class="cart-empty">

                    <i
                        class="fa-solid fa-bag-shopping"
                    ></i>

                    <h2>
                        Seu carrinho está vazio
                    </h2>

                    <p>
                        Adicione produtos para continuar.
                    </p>

                    <a
                        href="produtos.html"
                        class="btn btn-primary"
                    >
                        Ver produtos
                    </a>

                </div>

            `;

            setCartTotals(0);

            return;

        }


        let subtotal = 0;


        container.innerHTML =
            cart.map((item, index) => {

                const product =
                    getProductById(item.id);

                if (!product) {
                    return "";
                }

                const quantity =
                    Number(item.quantity) || 1;

                const price =
                    Number(product.price) || 0;

                const total =
                    price * quantity;

                subtotal += total;


                return `

                    <div class="cart-item">

                        <div class="cart-item-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                onerror="this.onerror=null;this.src='img/produto.jpg';"
                            >

                        </div>


                        <div class="cart-item-info">

                            <span class="product-category">
                                ${getCategoryName(product.category)}
                            </span>

                            <h3>
                                ${product.name}
                            </h3>

                            <strong>
                                ${formatPrice(price)}
                            </strong>


                            <p>
                                Estoque disponível:
                                ${product.stock}
                            </p>


                            <div
                                class="cart-item-controls"
                            >

                                <button
                                    class="quantity-button decrease"
                                    data-index="${index}"
                                >
                                    −
                                </button>

                                <span>
                                    ${quantity}
                                </span>

                                <button
                                    class="quantity-button increase"
                                    data-index="${index}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <div class="cart-item-total">

                            <strong>
                                ${formatPrice(total)}
                            </strong>

                            <button
                                class="remove-cart-item"
                                data-index="${index}"
                                title="Remover"
                            >
                                <i
                                    class="fa-solid fa-trash"
                                ></i>
                            </button>

                        </div>

                    </div>

                `;

            }).join("");


        setCartTotals(subtotal);


        container
            .querySelectorAll(".decrease")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        cart =
                            getCart();

                        if (
                            cart[index] &&
                            cart[index].quantity > 1
                        ) {

                            cart[index].quantity--;

                            saveCart(cart);

                            renderCart();

                        }

                    }
                );

            });


        container
            .querySelectorAll(".increase")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        cart =
                            getCart();

                        const item =
                            cart[index];

                        if (!item) {
                            return;
                        }

                        const product =
                            getProductById(
                                item.id
                            );

                        if (!product) {
                            return;
                        }

                        if (
                            item.quantity >=
                            product.stock
                        ) {

                            alert(
                                `Há apenas ${product.stock} unidade(s) disponível(is).`
                            );

                            return;

                        }

                        item.quantity++;

                        saveCart(cart);

                        renderCart();

                    }
                );

            });


        container
            .querySelectorAll(
                ".remove-cart-item"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        cart =
                            getCart();

                        cart.splice(
                            index,
                            1
                        );

                        saveCart(cart);

                        renderCart();

                    }
                );

            });

    }


    function setCartTotals(subtotal) {

        const subtotalElement =
            document.getElementById(
                "cart-subtotal"
            );

        const totalElement =
            document.getElementById(
                "cart-total"
            );

        if (subtotalElement) {

            subtotalElement.textContent =
                formatPrice(subtotal);

        }

        if (totalElement) {

            totalElement.textContent =
                formatPrice(subtotal);

        }

    }


    renderCart();

}


/* =========================================================
   LOGIN
========================================================= */

function initLogin() {

    const form =
        document.getElementById(
            "login-form"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const email =
                document
                    .getElementById(
                        "login-email"
                    )
                    ?.value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById(
                        "login-password"
                    )
                    ?.value;

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "urbanUser"
                    )
                );


            if (!user) {

                alert(
                    "Nenhuma conta cadastrada. Crie sua conta primeiro."
                );

                return;

            }


            if (
                email !==
                String(user.email).toLowerCase()
            ) {

                alert(
                    "E-mail não encontrado."
                );

                return;

            }


            if (
                password !==
                user.password
            ) {

                alert(
                    "Senha incorreta."
                );

                return;

            }


            localStorage.setItem(
                "urbanLoggedIn",
                "true"
            );

            localStorage.setItem(
                "urbanUserName",
                user.name
            );


            window.location.href =
                "conta.html";

        }
    );

}


/* =========================================================
   CADASTRO
========================================================= */

function initRegister() {

    const form =
        document.getElementById(
            "register-form"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name =
                document
                    .getElementById(
                        "register-name"
                    )
                    ?.value
                    .trim();

            const email =
                document
                    .getElementById(
                        "register-email"
                    )
                    ?.value
                    .trim()
                    .toLowerCase();

            const password =
                document
                    .getElementById(
                        "register-password"
                    )
                    ?.value;

            const confirmPassword =
                document
                    .getElementById(
                        "register-confirm-password"
                    )
                    ?.value;


            if (
                !name ||
                !email ||
                !password
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "As senhas não coincidem."
                );

                return;

            }


            const user = {

                name,

                email,

                password

            };


            localStorage.setItem(
                "urbanUser",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "urbanLoggedIn",
                "true"
            );

            localStorage.setItem(
                "urbanUserName",
                name
            );


            window.location.href =
                "conta.html";

        }
    );

}


/* =========================================================
   CONTA
========================================================= */

function initAccount() {

    const page =
        document.getElementById(
            "account-page"
        );

    if (!page) {
        return;
    }


    const loggedIn =
        localStorage.getItem(
            "urbanLoggedIn"
        );


    const user =
        JSON.parse(
            localStorage.getItem(
                "urbanUser"
            )
        );


    if (
        loggedIn !== "true" ||
        !user
    ) {

        window.location.href =
            "login.html";

        return;

    }


    document
        .querySelectorAll(
            "[data-user-name]"
        )
        .forEach(element => {

            element.textContent =
                user.name;

        });


    document
        .querySelectorAll(
            "[data-user-email]"
        )
        .forEach(element => {

            element.textContent =
                user.email;

        });


    document
        .querySelectorAll(
            "[data-logout]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    localStorage.removeItem(
                        "urbanLoggedIn"
                    );

                    localStorage.removeItem(
                        "urbanUserName"
                    );

                    window.location.href =
                        "login.html";

                }
            );

        });

}


/* =========================================================
   PEDIDOS
========================================================= */

function initOrders() {

    const ordersContainer =
        document.getElementById("orders-list");

    if (!ordersContainer) {
        return;
    }

    let orders = [];

    try {

        orders =
            JSON.parse(
                localStorage.getItem("urbanOrders")
            ) || [];

    } catch {

        orders = [];

    }


    let user = null;

    try {

        user =
            JSON.parse(
                localStorage.getItem("urbanUser")
            );

    } catch {

        user = null;

    }


    if (!user) {

        ordersContainer.innerHTML = `

            <div class="orders-empty">

                <i class="fa-regular fa-user"></i>

                <h3>
                    Faça login para ver seus pedidos
                </h3>

                <p>
                    Entre na sua conta para consultar suas compras.
                </p>

                <a
                    href="login.html"
                    class="btn btn-primary"
                >
                    Fazer login
                </a>

            </div>

        `;

        return;

    }


    const userName =
        String(
            user.name ||
            user.nome ||
            user.username ||
            ""
        )
        .trim()
        .toLowerCase();


    const userEmail =
        String(
            user.email ||
            ""
        )
        .trim()
        .toLowerCase();


    const myOrders =
        orders.filter(order => {

            const orderName =
                String(
                    order.userName ||
                    order.name ||
                    order.customer?.name ||
                    ""
                )
                .trim()
                .toLowerCase();


            const orderEmail =
                String(
                    order.userEmail ||
                    order.email ||
                    order.customer?.email ||
                    order.customer?.emailAddress ||
                    ""
                )
                .trim()
                .toLowerCase();


            return (

                (
                    userName &&
                    orderName === userName
                )

                ||

                (
                    userEmail &&
                    orderEmail === userEmail
                )

            );

        });


    if (!myOrders.length) {

        ordersContainer.innerHTML = `

            <div class="orders-empty">

                <i class="fa-solid fa-box-open"></i>

                <h3>
                    Nenhum pedido encontrado
                </h3>

                <p>
                    Você ainda não realizou nenhuma compra.
                </p>

                <a
                    href="produtos.html"
                    class="btn btn-primary"
                >
                    Ver produtos
                </a>

            </div>

        `;

        return;

    }


    let html = "";


    myOrders
        .slice()
        .reverse()
        .forEach(order => {

            const orderProducts =
                Array.isArray(order.products)
                    ? order.products
                    : Array.isArray(order.items)
                        ? order.items
                        : [];


            const subtotal =
                Number(order.subtotal) || 0;


            const shipping =
                Number(order.shipping) || 0;


            const total =
                Number(order.total) ||
                (subtotal + shipping);


            let productsHTML = "";


            orderProducts.forEach(item => {

                const catalogProduct =
                    getProductById(item.id);


                const productName =
                    item.name ||
                    catalogProduct?.name ||
                    "Produto";


                const productImage =
                    item.image ||
                    catalogProduct?.image ||
                    "img/produto.jpg";


                const productPrice =
                    Number(
                        item.price ??
                        catalogProduct?.price ??
                        0
                    );


                const quantity =
                    Number(item.quantity) || 1;


                const productTotal =
                    productPrice *
                    quantity;


                productsHTML += `

                    <div class="order-product">

                        <div class="order-product-image">

                            <img
                                src="${productImage}"
                                alt="${productName}"
                                onerror="
                                    this.onerror=null;
                                    this.src='img/produto.jpg';
                                "
                            >

                        </div>


                        <div class="order-product-info">

                            <strong>
                                ${productName}
                            </strong>


                            ${
                                item.size
                                    ? `
                                        <span>
                                            Tamanho: ${item.size}
                                        </span>
                                    `
                                    : ""
                            }


                            <span>
                                Quantidade: ${quantity}
                            </span>


                            <span>
                                Preço:
                                ${formatPrice(productPrice)}
                            </span>

                        </div>


                        <strong
                            class="order-product-price"
                        >
                            ${formatPrice(productTotal)}
                        </strong>

                    </div>

                `;

            });


            const totalItems =
                orderProducts.reduce(
                    (sum, product) => {

                        return (
                            sum +
                            (
                                Number(
                                    product.quantity
                                ) || 1
                            )
                        );

                    },
                    0
                );


            html += `

                <article class="order-card">

                    <div class="order-header">

                        <div>

                            <span>
                                Pedido
                            </span>

                            <strong>
                                #${order.id || "000000"}
                            </strong>

                        </div>


                        <span class="order-status">

                            ${
                                order.status ||
                                "Pedido recebido"
                            }

                        </span>

                    </div>


                    <div class="order-date">

                        <i
                            class="fa-regular fa-calendar"
                        ></i>

                        ${order.date || "Data não informada"}

                    </div>


                    <div class="order-products">

                        ${productsHTML}

                    </div>


                    <div class="order-summary">

                        <div>

                            <span>

                                ${totalItems}

                                ${
                                    totalItems === 1
                                        ? "item"
                                        : "itens"
                                }

                            </span>

                        </div>


                        <div>

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${formatPrice(subtotal)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Frete
                            </span>

                            <strong>

                                ${
                                    shipping === 0
                                        ? "GRÁTIS"
                                        : formatPrice(
                                            shipping
                                        )
                                }

                            </strong>

                        </div>


                        <div class="order-total">

                            <span>
                                Total do pedido
                            </span>

                            <strong>
                                ${formatPrice(total)}
                            </strong>

                        </div>

                    </div>

                </article>

            `;

        });


    ordersContainer.innerHTML =
        html;

}


/* =========================================================
   ESTOQUE
========================================================= */

function decreaseStockForCart(cart) {

    const savedProducts =
        JSON.parse(
            localStorage.getItem(
                "urbanProducts"
            )
        ) || [];


    const products =
        getProducts();


    cart.forEach(item => {

        const product =
            products.find(
                p =>
                    String(p.id) ===
                    String(item.id)
            );

        if (!product) {
            return;
        }


        const currentStock =
            Number(product.stock) || 0;


        const newStock =
            Math.max(
                0,
                currentStock -
                Number(item.quantity)
            );


        const index =
            savedProducts.findIndex(
                p =>
                    String(p.id) ===
                    String(item.id)
            );


        if (index !== -1) {

            savedProducts[index].stock =
                newStock;

        } else {

            savedProducts.push({

                ...product,

                stock:
                    newStock

            });

        }

    });


    localStorage.setItem(
        "urbanProducts",
        JSON.stringify(
            savedProducts
        )
    );

}


/* =========================================================
   CHECKOUT
========================================================= */

function initCheckout() {

    const checkoutItems =
        document.getElementById(
            "checkout-items"
        );

    if (!checkoutItems) {
        return;
    }


    const subtotalElement =
        document.getElementById(
            "checkout-subtotal"
        );

    const shippingElement =
        document.getElementById(
            "checkout-shipping"
        );

    const totalElement =
        document.getElementById(
            "checkout-total"
        );

    const finishButton =
        document.getElementById(
            "finish-order"
        );


    let cart =
        sanitizeCart();


    function calculateSubtotal() {

        return cart.reduce(
            (total, item) => {

                const product =
                    getProductById(
                        item.id
                    );

                if (!product) {
                    return total;
                }

                return (
                    total +
                    (
                        Number(product.price) *
                        Number(item.quantity)
                    )
                );

            },
            0
        );

    }


    function renderItems() {

        cart =
            sanitizeCart();

        if (!cart.length) {

            checkoutItems.innerHTML = `

                <div class="checkout-empty">

                    <h2>
                        Seu carrinho está vazio.
                    </h2>

                    <a
                        href="produtos.html"
                        class="btn btn-primary"
                    >
                        Ver produtos
                    </a>

                </div>

            `;

            return;

        }


        checkoutItems.innerHTML =
            cart.map(item => {

                const product =
                    getProductById(
                        item.id
                    );

                if (!product) {
                    return "";
                }


                const quantity =
                    Number(item.quantity);


                const total =
                    Number(product.price) *
                    quantity;


                return `

                    <div
                        class="checkout-item"
                    >

                        <div
                            class="checkout-item-image"
                        >

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                onerror="this.onerror=null;this.src='img/produto.jpg';"
                            >

                        </div>


                        <div
                            class="checkout-item-info"
                        >

                            <h3>
                                ${product.name}
                            </h3>

                            <span>
                                ${getCategoryName(product.category)}
                            </span>

                            <p>
                                Quantidade:
                                ${quantity}
                            </p>

                        </div>


                        <strong>
                            ${formatPrice(total)}
                        </strong>

                    </div>

                `;

            }).join("");

    }


    function updateTotals() {

        const subtotal =
            calculateSubtotal();


        const selectedShipping =
            document.querySelector(
                'input[name="shipping"]:checked'
            );


        let shipping =
            selectedShipping
                ? Number(
                    selectedShipping.value
                ) || 0
                : 0;


        const freeOption =
            document.querySelector(
                'input[name="shipping"][value="0"]'
            );


        if (freeOption) {

            if (subtotal >= 250) {

                freeOption.disabled =
                    false;

            } else {

                freeOption.disabled =
                    true;

                if (
                    freeOption.checked
                ) {

                    const standard =
                        document.querySelector(
                            'input[name="shipping"][value="19.90"]'
                        );

                    if (standard) {

                        standard.checked =
                            true;

                        shipping =
                            19.90;

                    }

                }

            }

        }


        const total =
            subtotal +
            shipping;


        if (subtotalElement) {

            subtotalElement.textContent =
                formatPrice(
                    subtotal
                );

        }


        if (shippingElement) {

            shippingElement.textContent =
                shipping === 0
                    ? "GRÁTIS"
                    : formatPrice(
                        shipping
                    );

        }


        if (totalElement) {

            totalElement.textContent =
                formatPrice(
                    total
                );

        }

    }


    /* =====================================================
       PAGAMENTO
    ===================================================== */

    const paymentOptions =
        document.querySelectorAll(
            'input[name="payment"]'
        );


    const paymentDetails =
        document.getElementById(
            "payment-details"
        );


    function updatePaymentFields() {

        if (!paymentDetails) {
            return;
        }


        const selected =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        if (!selected) {

            paymentDetails.innerHTML = "";

            return;

        }


        if (
            selected.value === "card"
        ) {

            paymentDetails.innerHTML = `

                <div class="payment-box">

                    <h3>
                        Dados do cartão
                    </h3>

                    <label>
                        Número do cartão
                    </label>

                    <input
                        type="text"
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        maxlength="19"
                    >


                    <label>
                        Nome no cartão
                    </label>

                    <input
                        type="text"
                        id="card-name"
                        placeholder="Nome completo"
                    >


                    <div
                        style="
                            display:grid;
                            grid-template-columns:1fr 1fr;
                            gap:15px;
                        "
                    >

                        <div>

                            <label>
                                Validade
                            </label>

                            <input
                                type="text"
                                id="card-expiry"
                                placeholder="MM/AA"
                                maxlength="5"
                            >

                        </div>


                        <div>

                            <label>
                                CVV
                            </label>

                            <input
                                type="text"
                                id="card-cvv"
                                placeholder="123"
                                maxlength="4"
                            >

                        </div>

                    </div>

                </div>

            `;


            const number =
                document.getElementById(
                    "card-number"
                );


            if (number) {

                number.addEventListener(
                    "input",
                    () => {

                        let value =
                            number.value
                                .replace(
                                    /\D/g,
                                    ""
                                )
                                .substring(
                                    0,
                                    16
                                );

                        value =
                            value.replace(
                                /(.{4})/g,
                                "$1 "
                            )
                                .trim();

                        number.value =
                            value;

                    }
                );

            }


            const expiry =
                document.getElementById(
                    "card-expiry"
                );


            if (expiry) {

                expiry.addEventListener(
                    "input",
                    () => {

                        let value =
                            expiry.value
                                .replace(
                                    /\D/g,
                                    ""
                                )
                                .substring(
                                    0,
                                    4
                                );

                        if (
                            value.length > 2
                        ) {

                            value =
                                value.substring(
                                    0,
                                    2
                                ) +
                                "/" +
                                value.substring(
                                    2
                                );

                        }

                        expiry.value =
                            value;

                    }
                );

            }

        }


        if (
            selected.value === "pix"
        ) {

            paymentDetails.innerHTML = `

                <div class="payment-box">

                    <h3>
                        Pagamento via Pix
                    </h3>

                    <div
                        style="
                            text-align:center;
                            padding:20px;
                        "
                    >

                        <div
                            style="
                                font-size:70px;
                                margin-bottom:15px;
                            "
                        >
                            ▦
                        </div>

                        <p>
                            Ao finalizar o pedido,
                            será gerado o pagamento Pix.
                        </p>

                        <strong>
                            Pix
                        </strong>

                    </div>

                </div>

            `;

        }


        if (
            selected.value === "boleto"
        ) {

            paymentDetails.innerHTML = `

                <div class="payment-box">

                    <h3>
                        Boleto bancário
                    </h3>

                    <p>
                        O boleto será disponibilizado
                        após a confirmação do pedido.
                    </p>

                </div>

            `;

        }

    }


    paymentOptions.forEach(
        option => {

            option.addEventListener(
                "change",
                updatePaymentFields
            );

        }
    );


    document
        .querySelectorAll(
            'input[name="shipping"]'
        )
        .forEach(option => {

            option.addEventListener(
                "change",
                updateTotals
            );

        });


    /* =====================================================
       FINALIZAR PEDIDO
    ===================================================== */

    if (finishButton) {

        finishButton.addEventListener(
            "click",
            event => {

                event.preventDefault();


                cart =
                    sanitizeCart();


                if (!cart.length) {

                    alert(
                        "Seu carrinho está vazio."
                    );

                    return;

                }


                const name =
                    document
                        .getElementById("name")
                        ?.value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        ?.value
                        .trim();


                const phone =
                    document
                        .getElementById("phone")
                        ?.value
                        .trim();


                if (
                    !name ||
                    !email ||
                    !phone
                ) {

                    alert(
                        "Preencha seus dados pessoais."
                    );

                    return;

                }


                const cep =
                    document
                        .getElementById("cep")
                        ?.value
                        .trim();


                const street =
                    document
                        .getElementById("street")
                        ?.value
                        .trim();


                const number =
                    document
                        .getElementById("number")
                        ?.value
                        .trim();


                const neighborhood =
                    document
                        .getElementById("neighborhood")
                        ?.value
                        .trim();


                const city =
                    document
                        .getElementById("city")
                        ?.value
                        .trim();


                const state =
                    document
                        .getElementById("state")
                        ?.value;


                const complement =
                    document
                        .getElementById("complement")
                        ?.value
                        .trim();


                if (
                    !cep ||
                    !street ||
                    !number ||
                    !neighborhood ||
                    !city ||
                    !state
                ) {

                    alert(
                        "Preencha todos os dados de endereço."
                    );

                    return;

                }


                const payment =
                    document.querySelector(
                        'input[name="payment"]:checked'
                    );


                const shipping =
                    document.querySelector(
                        'input[name="shipping"]:checked'
                    );


                if (!payment) {

                    alert(
                        "Escolha uma forma de pagamento."
                    );

                    return;

                }


                if (!shipping) {

                    alert(
                        "Escolha uma forma de entrega."
                    );

                    return;

                }


                if (
                    payment.value ===
                    "card"
                ) {

                    const cardNumber =
                        document
                            .getElementById(
                                "card-number"
                            )
                            ?.value
                            .replace(
                                /\D/g,
                                ""
                            );


                    const cardName =
                        document
                            .getElementById(
                                "card-name"
                            )
                            ?.value
                            .trim();


                    const cardExpiry =
                        document
                            .getElementById(
                                "card-expiry"
                            )
                            ?.value
                            .trim();


                    const cardCvv =
                        document
                            .getElementById(
                                "card-cvv"
                            )
                            ?.value
                            .trim();


                    if (
                        !cardNumber ||
                        cardNumber.length < 13 ||
                        !cardName ||
                        !cardExpiry ||
                        !cardCvv
                    ) {

                        alert(
                            "Preencha corretamente os dados do cartão."
                        );

                        return;

                    }

                }


                const subtotal =
                    calculateSubtotal();


                const shippingValue =
                    Number(
                        shipping.value
                    ) || 0;


                if (
                    shippingValue === 0 &&
                    subtotal < 250
                ) {

                    alert(
                        "O frete grátis está disponível apenas para compras acima de R$ 250,00."
                    );

                    return;

                }


                const products =
                    getProducts();


                for (
                    const item of cart
                ) {

                    const product =
                        products.find(
                            p =>
                                String(p.id) ===
                                String(item.id)
                        );


                    if (!product) {

                        alert(
                            "Um produto não está mais disponível."
                        );

                        return;

                    }


                    if (
                        Number(item.quantity) >
                        Number(product.stock)
                    ) {

                        alert(
                            `O produto "${product.name}" possui apenas ${product.stock} unidade(s).`
                        );

                        return;

                    }

                }


                decreaseStockForCart(
                    cart
                );


                let orders = [];

                try {

                    orders =
                        JSON.parse(
                            localStorage.getItem(
                                "urbanOrders"
                            )
                        ) || [];

                } catch {

                    orders = [];

                }


                const total =
                    subtotal +
                    shippingValue;


                const order = {

                    id:
                        "PED-" +
                        Date.now(),

                    date:
                        new Date()
                            .toLocaleString(
                                "pt-BR"
                            ),

                    customer: {

                        name,

                        email,

                        phone

                    },

                    address: {

                        cep,

                        street,

                        number,

                        complement,

                        neighborhood,

                        city,

                        state

                    },

                    items:
                        cart.map(item => {

                            const product =
                                getProductById(
                                    item.id
                                );

                            return {

                                id:
                                    product.id,

                                name:
                                    product.name,

                                price:
                                    Number(
                                        product.price
                                    ),

                                quantity:
                                    Number(
                                        item.quantity
                                    ),

                                image:
                                    product.image

                            };

                        }),

                    subtotal,

                    shipping:
                        shippingValue,

                    total,

                    payment:
                        payment.value,

                    status:
                        "Pedido recebido"

                };


                orders.push(
                    order
                );


                localStorage.setItem(
                    "urbanOrders",
                    JSON.stringify(
                        orders
                    )
                );


                localStorage.removeItem(
                    "urbanCart"
                );


                updateCartCount();


                alert(
                    "Pedido realizado com sucesso!"
                );


                window.location.href =
                    "pedidos.html";

            }
        );

    }


    renderItems();

    updateTotals();

    updatePaymentFields();

}


/* =========================================================
   MENU MOBILE
========================================================= */

function initMobileMenu() {

    const button =
        document.getElementById(
            "menu-button"
        );

    const nav =
        document.getElementById(
            "nav"
        );

    if (
        !button ||
        !nav
    ) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "active"
            );

        }
    );

}


/* =========================================================
   LINK DA CONTA
========================================================= */

function updateAccountLink() {

    const loggedIn =
        localStorage.getItem(
            "urbanLoggedIn"
        ) === "true";


    document
        .querySelectorAll(
            '.header-actions a[href="conta.html"], .header-actions a[href="login.html"]'
        )
        .forEach(link => {

            link.href =
                loggedIn
                    ? "conta.html"
                    : "login.html";

        });

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        updateAccountLink();

        initProductsPage();

        initProductPage();

        initCartPage();

        initLogin();

        initRegister();

        initAccount();

        initOrders();

        initCheckout();

        initMobileMenu();

    }
);
