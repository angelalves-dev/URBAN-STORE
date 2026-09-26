/* =========================================================
   URBAN STORE - CHECKOUT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initCheckoutPage();

    initPaymentFields();

    initPixButton();

    initMasks();

});


/* =========================================================
   CHECKOUT
========================================================= */

function initCheckoutPage() {

    const finishButton =
        document.getElementById("finish-order");

    const checkoutItems =
        document.getElementById("checkout-items");

    if (!finishButton || !checkoutItems) {
        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("urbanCart")
        ) || [];


    const products =
        typeof getProducts === "function"
            ? getProducts()
            : [];


    function getProduct(id) {

        return products.find(
            product =>
                String(product.id) === String(id)
        );

    }


    function formatMoney(value) {

        return Number(value || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    function cleanCart() {

        cart = cart
            .map(item => {

                const product =
                    getProduct(item.id);

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
                    quantity: quantity
                };

            })
            .filter(Boolean);


        localStorage.setItem(
            "urbanCart",
            JSON.stringify(cart)
        );

    }


    cleanCart();


    function calculateSubtotal() {

        let subtotal = 0;

        cart.forEach(item => {

            const product =
                getProduct(item.id);

            if (!product) {
                return;
            }

            subtotal +=
                Number(product.price) *
                Number(item.quantity);

        });

        return subtotal;

    }


    function renderItems() {

        if (!cart.length) {

            checkoutItems.innerHTML = `

                <div class="checkout-empty">

                    <i class="fa-solid fa-bag-shopping"></i>

                    <p>
                        Seu carrinho está vazio.
                    </p>

                    <a href="produtos.html">
                        Ver produtos
                    </a>

                </div>

            `;

            finishButton.disabled = true;

            return;

        }


        finishButton.disabled = false;


        checkoutItems.innerHTML =
            cart.map(item => {

                const product =
                    getProduct(item.id);

                if (!product) {
                    return "";
                }

                const quantity =
                    Number(item.quantity) || 1;

                const price =
                    Number(product.price) || 0;

                const total =
                    price * quantity;


                return `

                    <div class="checkout-item">

                        <div class="checkout-item-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                            >

                        </div>

                        <div class="checkout-item-info">

                            <h3>
                                ${product.name}
                            </h3>

                            <span>
                                ${quantity} unidade(s)
                            </span>

                            <div class="checkout-item-bottom">

                                <strong>
                                    ${formatMoney(price)}
                                </strong>

                            </div>

                        </div>

                        <div class="checkout-item-total">

                            ${formatMoney(total)}

                        </div>

                    </div>

                `;

            }).join("");

    }


    renderItems();


    /* =====================================================
       FRETE
    ===================================================== */

    const shippingInputs =
        document.querySelectorAll(
            'input[name="shipping"]'
        );


    function updateTotal() {

        const subtotal =
            calculateSubtotal();


        const selectedShipping =
            document.querySelector(
                'input[name="shipping"]:checked'
            );


        let shipping =
            selectedShipping
                ? Number(selectedShipping.value) || 0
                : 19.90;


        const freeShipping =
            document.querySelector(
                'input[name="shipping"][value="0"]'
            );


        if (freeShipping) {

            if (subtotal >= 250) {

                freeShipping.disabled = false;

            } else {

                freeShipping.disabled = true;

                if (freeShipping.checked) {

                    const standard =
                        document.querySelector(
                            'input[name="shipping"][value="19.90"]'
                        );

                    if (standard) {
                        standard.checked = true;
                        shipping = 19.90;
                    }

                }

            }

        }


        const total =
            subtotal + shipping;


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


        if (subtotalElement) {

            subtotalElement.textContent =
                formatMoney(subtotal);

        }


        if (shippingElement) {

            shippingElement.textContent =
                shipping === 0
                    ? "GRÁTIS"
                    : formatMoney(shipping);

        }


        if (totalElement) {

            totalElement.textContent =
                formatMoney(total);

        }

    }


    shippingInputs.forEach(input => {

        input.addEventListener(
            "change",
            updateTotal
        );

    });


    updateTotal();


    /* =====================================================
       FINALIZAR PEDIDO
    ===================================================== */

    finishButton.addEventListener(
        "click",
        function () {


            cart =
                JSON.parse(
                    localStorage.getItem("urbanCart")
                ) || [];


            if (!cart.length) {

                alert(
                    "Seu carrinho está vazio."
                );

                return;

            }


            /* =============================================
               DADOS PESSOAIS
            ============================================= */

            const name =
                document
                    .getElementById("name")
                    ?.value.trim();


            const email =
                document
                    .getElementById("email")
                    ?.value.trim();


            const phone =
                document
                    .getElementById("phone")
                    ?.value.trim();


            if (!name || !email || !phone) {

                alert(
                    "Preencha todos os dados pessoais."
                );

                return;

            }


            /* =============================================
               ENDEREÇO
            ============================================= */

            const cep =
                document
                    .getElementById("cep")
                    ?.value.trim();


            const street =
                document
                    .getElementById("street")
                    ?.value.trim();


            const number =
                document
                    .getElementById("number")
                    ?.value.trim();


            const complement =
                document
                    .getElementById("complement")
                    ?.value.trim();


            const neighborhood =
                document
                    .getElementById("neighborhood")
                    ?.value.trim();


            const city =
                document
                    .getElementById("city")
                    ?.value.trim();


            const state =
                document
                    .getElementById("state")
                    ?.value;


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


            /* =============================================
               PAGAMENTO
            ============================================= */

            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!payment) {

                alert(
                    "Escolha uma forma de pagamento."
                );

                return;

            }


            const paymentMethod =
                payment.value;


            /* =============================================
               VALIDAÇÃO DO CARTÃO
            ============================================= */

            if (
                paymentMethod === "card"
            ) {

                const cardName =
                    document
                        .getElementById("card-name")
                        ?.value.trim();


                const cardNumber =
                    document
                        .getElementById("card-number")
                        ?.value.replace(/\s/g, "");


                const cardExpiry =
                    document
                        .getElementById("card-expiry")
                        ?.value.trim();


                const cardCVV =
                    document
                        .getElementById("card-cvv")
                        ?.value.trim();


                if (
                    !cardName ||
                    !cardNumber ||
                    !cardExpiry ||
                    !cardCVV
                ) {

                    alert(
                        "Preencha todos os dados do cartão."
                    );

                    return;

                }


                if (
                    cardNumber.length < 13
                ) {

                    alert(
                        "Digite um número de cartão válido."
                    );

                    return;

                }


                if (
                    cardCVV.length < 3
                ) {

                    alert(
                        "Digite um CVV válido."
                    );

                    return;

                }

            }


            /* =============================================
               PIX
            ============================================= */

            if (
                paymentMethod === "pix"
            ) {

                alert(
                    "Pedido registrado com pagamento via PIX."
                );

            }


            /* =============================================
               DINHEIRO
            ============================================= */

            let changeFor = null;


            if (
                paymentMethod === "cash"
            ) {

                const cashChange =
                    document
                        .getElementById("cash-change")
                        ?.value;


                if (cashChange) {

                    changeFor =
                        Number(cashChange);

                }

            }


            /* =============================================
               FRETE
            ============================================= */

            const shippingInput =
                document.querySelector(
                    'input[name="shipping"]:checked'
                );


            if (!shippingInput) {

                alert(
                    "Escolha uma forma de entrega."
                );

                return;

            }


            const shipping =
                Number(
                    shippingInput.value
                ) || 0;


            const subtotal =
                calculateSubtotal();


            if (
                shipping === 0 &&
                subtotal < 250
            ) {

                alert(
                    "O frete grátis está disponível apenas para compras acima de R$ 250,00."
                );

                return;

            }


            /* =============================================
               VALIDAR ESTOQUE
            ============================================= */

            for (const item of cart) {

                const product =
                    getProduct(item.id);


                if (!product) {

                    alert(
                        "Um dos produtos não está mais disponível."
                    );

                    return;

                }


                const stock =
                    Number(product.stock) || 0;


                if (
                    Number(item.quantity) >
                    stock
                ) {

                    alert(
                        `O produto "${product.name}" possui apenas ${stock} unidade(s) disponível(is).`
                    );

                    return;

                }

            }


            /* =============================================
               CRIAR PEDIDO
            ============================================= */

            const orders =
                JSON.parse(
                    localStorage.getItem(
                        "urbanOrders"
                    )
                ) || [];


            const items =
                cart.map(item => {

                    const product =
                        getProduct(item.id);

                    return {

                        id:
                            product.id,

                        name:
                            product.name,

                        price:
                            Number(product.price),

                        quantity:
                            Number(item.quantity),

                        image:
                            product.image

                    };

                });


            const total =
                subtotal + shipping;


            const order = {

                id:
                    "PED-" +
                    Date.now(),

                date:
                    new Date().toLocaleString(
                        "pt-BR"
                    ),

                customer: {

                    name:
                        name,

                    email:
                        email,

                    phone:
                        phone

                },

                address: {

                    cep:
                        cep,

                    street:
                        street,

                    number:
                        number,

                    complement:
                        complement,

                    neighborhood:
                        neighborhood,

                    city:
                        city,

                    state:
                        state

                },

                items:
                    items,

                subtotal:
                    subtotal,

                shipping:
                    shipping,

                total:
                    total,

                payment:
                    paymentMethod,

                changeFor:
                    changeFor,

                status:
                    "Pedido recebido"

            };


            orders.push(order);


            localStorage.setItem(
                "urbanOrders",
                JSON.stringify(orders)
            );


            /* =============================================
               BAIXAR ESTOQUE
            ============================================= */

            const savedProducts =
                JSON.parse(
                    localStorage.getItem(
                        "urbanProducts"
                    )
                ) || [];


            cart.forEach(item => {

                const product =
                    getProduct(item.id);


                if (!product) {
                    return;
                }


                const newStock =
                    Math.max(
                        0,
                        Number(product.stock) -
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
                JSON.stringify(savedProducts)
            );


            /* =============================================
               LIMPAR CARRINHO
            ============================================= */

            localStorage.removeItem(
                "urbanCart"
            );


            if (
                typeof updateCartCount ===
                "function"
            ) {

                updateCartCount();

            }


            /* =============================================
               USUÁRIO
            ============================================= */

            localStorage.setItem(
                "urbanLoggedIn",
                "true"
            );


            localStorage.setItem(
                "urbanUserName",
                name
            );


            alert(
                "Pedido realizado com sucesso!"
            );


            window.location.href =
                "pedidos.html";

        }
    );

}


/* =========================================================
   PAGAMENTO
========================================================= */

function initPaymentFields() {

    const paymentInputs =
        document.querySelectorAll(
            'input[name="payment"]'
        );


    const cardFields =
        document.getElementById(
            "card-fields"
        );


    const pixFields =
        document.getElementById(
            "pix-fields"
        );


    const cashFields =
        document.getElementById(
            "cash-fields"
        );


    if (!paymentInputs.length) {
        return;
    }


    function updatePayment() {

        if (cardFields) {
            cardFields.classList.remove("active");
        }

        if (pixFields) {
            pixFields.classList.remove("active");
        }

        if (cashFields) {
            cashFields.classList.remove("active");
        }


        const selected =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        if (!selected) {
            return;
        }


        if (
            selected.value === "card" &&
            cardFields
        ) {

            cardFields.classList.add("active");

        }


        if (
            selected.value === "pix" &&
            pixFields
        ) {

            pixFields.classList.add("active");

        }


        if (
            selected.value === "cash" &&
            cashFields
        ) {

            cashFields.classList.add("active");

        }

    }


    paymentInputs.forEach(input => {

        input.addEventListener(
            "change",
            updatePayment
        );

    });


    updatePayment();

}


/* =========================================================
   COPIAR PIX
========================================================= */

function initPixButton() {

    const button =
        document.getElementById(
            "copy-pix"
        );


    const pixCode =
        document.getElementById(
            "pix-code"
        );


    if (!button || !pixCode) {
        return;
    }


    button.addEventListener(
        "click",
        async function () {

            const text =
                pixCode.textContent.trim();


            try {

                await navigator.clipboard.writeText(
                    text
                );


                button.innerHTML =
                    '<i class="fa-solid fa-check"></i> Chave copiada!';


                setTimeout(
                    () => {

                        button.innerHTML =
                            '<i class="fa-regular fa-copy"></i> Copiar chave PIX';

                    },
                    2000
                );

            } catch (error) {

                alert(
                    "Chave PIX: " + text
                );

            }

        }
    );

}


/* =========================================================
   MÁSCARAS
========================================================= */

function initMasks() {

    const cardNumber =
        document.getElementById(
            "card-number"
        );


    if (cardNumber) {

        cardNumber.addEventListener(
            "input",
            function () {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 16);


                value =
                    value.replace(
                        /(\d{4})(?=\d)/g,
                        "$1 "
                    );


                this.value =
                    value;

            }
        );

    }


    const cardExpiry =
        document.getElementById(
            "card-expiry"
        );


    if (cardExpiry) {

        cardExpiry.addEventListener(
            "input",
            function () {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 4);


                if (value.length >= 3) {

                    value =
                        value.substring(0, 2) +
                        "/" +
                        value.substring(2);

                }


                this.value =
                    value;

            }
        );

    }


    const cardCVV =
        document.getElementById(
            "card-cvv"
        );


    if (cardCVV) {

        cardCVV.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 4);

            }
        );

    }


    const cep =
        document.getElementById(
            "cep"
        );


    if (cep) {

        cep.addEventListener(
            "input",
            function () {

                let value =
                    this.value
                        .replace(/\D/g, "")
                        .substring(0, 8);


                if (value.length > 5) {

                    value =
                        value.substring(0, 5) +
                        "-" +
                        value.substring(5);

                }


                this.value =
                    value;

            }
        );

    }

}
