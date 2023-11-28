(async function () {
    'use strict'
    const productsUrl = 'https://fakestoreapi.com/products';

    let products = [];

    const getData = async (apiUrl) => {
        try {
            const response = await fetch(apiUrl);
            if (response.status !== 200) {
                throw new Error('http error status ', response.status);
            }
            products = await response.json();
        } catch (error) {
            console.log('fetch error ', error);
        }
    }

    const useDebounce = (func, delay) => {
        let timer = null;
        return () => {
            clearTimeout(timer)
            let context = this;
            let args = arguments;
            timer = setTimeout(() => {
                func.apply(context, args)
            }, delay)
        }
    }

    const listProducts = document.querySelector('[data-productList]');
    const renderProducts = (productList) => {
        let prodList = productList ? productList : products
        listProducts.innerHTML = prodList.map((product) => {
            const { id, title, image, price, rating } = product;

            return `
                    <li class="flex gap-4 sm:flex-col sm:gap-0 sm:w-60 p-2 border bg-white rounded-md space-y-2 group shadow hover:shadow-xl" data-id='${id}'>
                        <div class="">
                            <img src="${image}" alt='${title}' class="w-40 h-40 sm:h-52 sm:w-52 object-cover">
                        </div>
                        <div class="flex-1 flex flex-col justify-between">
                            <h2 class="font-medium sm:font-semibold">${title}</h2>
                            <p class="font-medium">$${price}</p>
                            <p class="text-sm">${rating.rate}/5 stars over ${rating.count} users</p>
                            <button type="button" data-addToCartBtn class="w-full p-1 sm:p-2 bg-blue-500 text-white font-medium sm:font-semibold rounded">Add to cart</button>
                        </div>
                    </li>
                    `
        }).join('');
    }

    const productList = {
        cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],

        updateLocalStorage: function () {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        addToCart: function (productId) {
            let selectedProduct = products.find(x => x.id === +productId)
            selectedProduct.qty = 1;
          
            this.cart.push(selectedProduct)
            this.updateLocalStorage()
            this.renderCart()
        },

        removeFromCart: function (productId) {
            this.cart = this.cart.filter(item => item.id !== +productId)
            this.updateLocalStorage()
            this.renderCart()
        },

        clearCart: function () {
            this.cart = [];
            this.updateLocalStorage()
            this.renderCart();
        },

        updateCart : function(e){
            if(e.target.hasAttribute('data-btn')){
                const cartItemId = e.target.closest('li').getAttribute('data-id');
                let btn = e.target.dataset.btn;

                if(btn === 'incr') {
                    this.increaseQty(cartItemId)
                } 
                if(btn === 'decr'){
                    this.decreaseQty(cartItemId)
                }
            }
        },

        increaseQty : function(productId){
            const item = products.find(x => x.id === +productId)
            let itemAt = this.cart.indexOf(item);
            this.cart[itemAt].qty++;
            this.updateLocalStorage()
            this.renderCart()
        },
        decreaseQty : function(productId){
            const item = products.find(x => x.id === +productId)
            let itemAt = this.cart.indexOf(item);
            this.cart[itemAt].qty--;
            if(this.cart[itemAt].qty === 0){
                this.removeFromCart(productId)
            }
            this.updateLocalStorage()
            this.renderCart()
        },

        bind: function () {
            const selectors = {
                cartOpenBtn: document.querySelector('[data-openCart]'),
                cartCloseBtn: document.querySelector('[data-closeCart]'),
                cartPage: document.querySelector('[data-cartPage]'),
                productList: document.querySelector('[data-productList]'),
                cartList: document.querySelector('[data-cartList]'),
                search : document.querySelector('#search'),
            };

            selectors.cartOpenBtn.addEventListener('click', (e) => {
                selectors.cartPage.classList.remove('hidden');
            });
            selectors.cartCloseBtn.addEventListener('click', (e) => {
                selectors.cartPage.classList.add('hidden');
            })

            selectors.productList.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-addToCartBtn')) {
                    let productId = e.target.closest('li').getAttribute('data-id')
                    let item = this.cart.find(x => x.id === +productId)
                    if(this.cart.indexOf(item) == -1){
                        this.addToCart(productId);
                    }

                }
            })

            selectors.cartList.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-removeFromCart')) {
                    let productId = e.target.closest('li').getAttribute('data-id')
                    this.removeFromCart(productId);
                }

                if(e.target.hasAttribute('data-btn')){
                    this.updateCart(e)
                }
            })

            selectors.search.addEventListener('input', useDebounce(() => {
                let searchKeywords = selectors.search.value.toLowerCase();
                let searchRes = products.filter(product => {
                    return product.title.toLowerCase().includes(searchKeywords) 
                        || product.category.toLowerCase().includes(searchKeywords)
                        || product.description.toLowerCase().includes(searchKeywords)   
                })
                console.log(searchRes);
                renderProducts(searchRes);
            }, 500))
        },
        renderCart: function () {

            const cartList = document.querySelector('[data-cartList]');
            cartList.innerHTML = '';

            cartList.innerHTML = this.cart.map((product) => {
                const { id, title, image, price, qty } = product;

                const amount = price * qty;

                return `
                <li class="flex gap-4 bg-white p-4 border-b" data-id='${id}'>
                    <div class="w-24 aspect-square rounded-md overflow-hidden">
                        <img src="${image}" alt="${title}" class="h-full w-full object-cover" />
                    </div>
                    <div class="flex-1 flex flex-col">
                        <div class="flex justify-between text-base font-medium text-gray-900">
                            <h3>${title}</h3>
                            <p class="ml-4">${amount}</p>
                        </div>
                        <div class="items-end flex-1 flex justify-between text-sm">
                            <p class="text-gray-500 text-base border px-2">
                            <button type="button" data-btn="decr">&minus;</button>
                            <span>${qty}</span>
                            <button type="button" data-btn="incr">&plus;</button>
                            </p>
                            <button type="button" data-removeFromCart
                                class="font-medium text-indigo-600 hover:text-indigo-500">
                                Remove
                            </button>
                        </div>
                    </div>
                </li>
                `
            }).join('')

            let total = this.cart.map(item => {
                return item?.qty * item?.price
            })
            if(total.length != 0){
                total = total?.reduce((sum, nextitem) => {
                    return sum + nextitem
                })
                document.querySelector('[data-total]').innerHTML = Number.parseFloat(total).toFixed(2) ;
            }
        }


    }
    productList.renderCart()
    productList.bind()

    const initStore = () => {
        getData(productsUrl).then(renderProducts)
    }
    initStore()






})()