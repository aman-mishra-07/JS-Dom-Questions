(async () => {
    'use strict'

    const productsUrl = 'https://dummyjson.com/products'

    const getData = async (apiUrl) => {
        try {
            const response = await fetch(apiUrl);
            if (response.status == 200) {
                let data = await response.json();
                return data;
            }
        } catch (error) {
            console.log('fetch error ', error);
            return null;
        }
    }

    const useDebounce = (func, delay) => {
        let timer = null;
        return () => {
            clearTimeout(timer)
            let context = this;
            timer = setTimeout(() => {
                func.apply(context)
            }, delay)
        }
    }

    const Shopping = {
        products: [],

        renderProducts: function (productList) {
            const ListProducts = document.querySelector('[data-productList]');
            let prodList = productList ? productList : this.products
            ListProducts.innerHTML = prodList.map((product) => {
                const { id, title, thumbnail, price, rating, category,  brand } = product;
                let disabled = this.cart.find(x => x.id === +id) ? `disabled` : ``
                let text = disabled ? `Added` : `Add to Cart`
                let btnStyle = disabled ? `bg-blue-400` : `bg-blue-600`;
                return `
                    <li class="flex sm:flex-col  sm:w-60 border bg-white rounded-md overflow-hidden space-y-2 group shadow hover:shadow-md" data-id='${id}'>
                        <div class="shrink-0">
                            <img src="${thumbnail}" data-imageViewer alt='${title}' class="w-40 sm:w-full aspect-square sm:aspect-video object-cover">
                        </div>
                        <div class="flex-1 flex flex-col justify-between p-2">
                            <h2 class="font-medium sm:font-semibold">${title}</h2>
                            <p class="font-medium">$${price}</p>
                            <p class="text-sm">Brand : ${brand}</p>
                            <p class="text-sm flex items-center gap-2"><svg class="w-3 h-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                          </svg> ${rating.toFixed(1)}/5 </p>
                            <button type="button" data-addToCartBtn ${disabled} class=" ${btnStyle} p-1   text-white font-medium rounded">${text}</button>
                        </div>
                    </li>
                    `
            }).join('');
            if(productList.length === 0){
                ListProducts.innerHTML = `<li class="text-3xl font-extrabold ">Sorry :( <br> Not Found</li>`
            }
            this.selectors.productCount.innerHTML = this.cart.length;
            let allImageCont = document.querySelectorAll('[data-imageViewer]')
            allImageCont.forEach((item) => {
                let viewBox = new Viewer(item)
            })
        },

        cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],

        updateLocalStorage: function () {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        addToCart: function (productId) {
            let selectedProduct = this.products.find(x => x.id === +productId)
            selectedProduct.qty = 1;
            this.cart.push(selectedProduct)
            this.updateLocalStorage()
            this.selectors.productCount.innerHTML = this.cart.length;
        },

        selectors: {
            productList: document.querySelector('[data-productList]'),
            search: document.querySelector('#search'),
            productCount: document.querySelector('[data-productCount]'),
            scrollBtn : document.querySelector('[data-scrollTop]')
        },

        bind: function () {
            this.selectors.productList.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-addToCartBtn')) {
                    let productId = e.target.closest('li').getAttribute('data-id')
                    this.addToCart(productId);
                    e.target.classList.remove('bg-blue-600')
                    e.target.classList.add('bg-blue-400')
                    e.target.innerHTML = `Added`
                    e.target.setAttribute('disabled', 'true')
                }
            })
            this.selectors.search.addEventListener('input', useDebounce(async () => {
                let searchRes = await getData(`https://dummyjson.com/products/search?q=${this.selectors.search.value}`)
                let searchResCate = await getData(`https://dummyjson.com/products/category/${this.selectors.search.value}`)
                if(searchRes.products.length === 0){
                    this.products = searchResCate.products
                    this.renderProducts(searchResCate.products)
                    return;
                }
                this.products = searchRes.products
                this.renderProducts(searchRes.products)
                
            }, 300))

            this.selectors.scrollBtn.addEventListener('click', (e) =>{
                window.scrollTo(0,0)
            })



        },

        initStore: async function () {
            let productList = await getData(productsUrl)
            this.products = productList.products;
            this.renderProducts(productList.products)
            this.bind()
        },
    }
    Shopping.initStore()
})()

