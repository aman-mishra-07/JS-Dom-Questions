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
            // let args = arguments;
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
                const { id, title, thumbnail, price, rating } = product;
                let disabled = this.cart.find(x => x.id === +id) ? `disabled` : ``
                let text = disabled ? `Added` : `Add to Cart`
                let btnStyle = disabled ? `bg-blue-300` : `bg-blue-500`;
                return `
                    <li class="flex gap-4 sm:flex-col sm:gap-0 sm:w-60 p-2 border bg-white rounded-md space-y-2 group shadow-sm hover:shadow-xl" data-id='${id}'>
                        <div class="">
                            <img src="${thumbnail}" alt='${title}' class="w-24 sm:w-full aspect-square object-cover">
                        </div>
                        <div class="flex-1 flex flex-col justify-between gap-2">
                            <h2 class="font-medium sm:font-semibold">${title}</h2>
                            <p class="font-medium">$${price}</p>
                            <p class="text-sm">${rating}/5 stars</p>
                            <button type="button" data-addToCartBtn ${disabled} class="w-full ${btnStyle} p-1 sm:p-2  text-white font-medium sm:font-semibold rounded">${text}</button>
                        </div>
                    </li>
                    `
            }).join('');
            this.selectors.productCount.innerHTML = this.cart.length;
        },

        cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],

        updateLocalStorage: function () {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        addToCart: function (productId) {;
            let selectedProduct = this.products.find(x => x.id === +productId)
            selectedProduct.qty = 1;
            this.cart.push(selectedProduct)
            this.updateLocalStorage()
            this.selectors.productCount.innerHTML = this.cart.length;
        },

        selectors : {
            productList: document.querySelector('[data-productList]'),
            search : document.querySelector('#search'),
            productCount : document.querySelector('[data-productCount]')
        },

        bind : function(){
            this.selectors.productList.addEventListener('click', (e) => {
                if(e.target.hasAttribute('data-addToCartBtn')){
                    let productId = e.target.closest('li').getAttribute('data-id')
                    this.addToCart(productId);
                    e.target.classList.remove('bg-blue-500')
                    e.target.classList.add('bg-blue-300')
                    e.target.innerHTML = `Added`
                    e.target.setAttribute('disabled', 'true')
                }
            }) 
            this.selectors.search.addEventListener('input', useDebounce(async () => {
                let searchRes = await getData(`https://dummyjson.com/products/search?q=${this.selectors.search.value}`)
                this.renderProducts(searchRes.products)
            }, 500))
        },
        
        initStore : async function(){
            let productList = await getData(productsUrl)
            this.products = productList.products;
            this.renderProducts(productList.products)
        },
        render :function(){
            this.initStore()
            this.bind()
        }
    }
    Shopping.render();
})()

