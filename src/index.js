(async () => {
    'use strict'
    const productsUrl = 'http://localhost:5000/products'

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
    };

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
                let starRatingWidth = Math.round(rating) * 20;

                return `
                    <li class="flex sm:flex-col  sm:w-60 border bg-white rounded-md overflow-hidden space-y-2 group shadow hover:shadow-md" data-id='${id}'>
                        <div class="shrink-0">
                            <img src="${thumbnail}" data-imageViewer alt='${title}' class="w-40 sm:w-full aspect-square sm:aspect-video object-cover">
                        </div>
                        <div class="flex-1 flex flex-col justify-between p-2">
                            <h2 class="font-medium sm:font-semibold">${title}</h2>
                            <p class="font-medium">$${price}</p>
                            <p class="text-sm">Brand : ${brand}</p>
                            <div class="text-sm flex items-center">
                            <p class="w-fit relative">
                                <span class="absolute right-0 z-20 block inset-y-0 bg-black "></span>
                                <span class=" flex items-center">
                                    <svg class="w-3 h-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="16"
                                        height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                    <svg class="w-3 h-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="16"
                                        height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                    <svg class="w-3 h-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="16"
                                        height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                    <svg class="w-3 h-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="16"
                                        height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                    <svg class="w-3 h-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="16"
                                        height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path
                                            d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z">
                                        </path>
                                    </svg>
                                </span>
                            </p>
                            <p>${rating.toFixed(1)}</p>
                        </div>
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
            scrollBtn : document.querySelector('[data-scrollTop]'),
            pageinationContainor : document.querySelector('[data-paginationCont]'),
            pageinationList : document.querySelector('[data-paginationList]'),
        },

        pageinate :async function() {           
            const dataSource = Math.ceil(100/20);
            let pageinationHtml = "";
            for (let i = 1; i <= dataSource; ++i) {
                pageinationHtml += `<li><button type="button" class="w-8 h-8 hover:border text-center" data-pageNo="${i}">${i}</button></li>`
            }
            this.selectors.pageinationList.innerHTML = pageinationHtml
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
                let searchRes = await getData(`http://localhost:5000/products?q=${this.selectors.search.value}`)
                this.products = searchRes
                this.renderProducts(searchRes)
            }, 300))

            this.selectors.pageinationContainor.addEventListener('click',async (e) => {
                if(e.target.hasAttribute('data-pageNo')){
                    let pageNo = e.target.getAttribute('data-pageNo')
                    let data = await getData(`${productsUrl}?_page=${pageNo}&_limit=20`)
                    this.products = data;
                    this.renderProducts(this.products)
                    // window.scrollTo(0,0)
                }
                if(e.target.closest('button').hasAttribute('data-previousBtn')){
                    this.selectors.pageinationList.scrollBy(e.target.getBoundingClientRect().width * 2,0)
                };
                if(e.target.closest('button').hasAttribute('data-nextBtn')){
                    this.selectors.pageinationList.scrollBy(-(e.target.getBoundingClientRect().width * 2),0)
                };
            })

            this.selectors.scrollBtn.addEventListener('click', (e) =>{
                window.scrollTo(0,0)
            })
        },

        initStore: async function () {
            let productList = await getData(`${productsUrl}?_page=1&_limit=20`)
            this.products = productList;
            this.renderProducts(this.products)
            this.pageinate()
            this.bind()
        },
    }
    Shopping.initStore()
})()

