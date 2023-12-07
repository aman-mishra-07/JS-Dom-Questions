(function () {
    'use strict'

    const createOrderApi = (user) => {
        let options = {
            "key": "rzp_test_JiQyi8g2zjhFQM", // Enter the Key ID generated from the Dashboard
            "amount": user.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "FillCarts shopping", //your business name
            "description": "Test Transaction",
            "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8fQtEe4MlPujDg1bldoket_m-mgbUwRGThA&usqp=CAU",
            "order_id": "order_N9SWAty2aFVhnM", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "callback_url": "https://eneqd3r9zrjok.x.pipedream.net/",
            "prefill": { 
                "name": `${user.firstName} ${user.lastName}`, //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": user.phone //Provide the customer's phone number for better conversion rates 
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        document.getElementById('rzp-button1').onclick = function (e) {
            rzp1.open();
            e.preventDefault();
        }
    }

    const validation = (user) => {
        const validate = {
            isValid: false,
            errors: [],
        }
        if (!user instanceof Object) return;
        if (!(/^[A-Za-z]+$/.test(user.firstName?.trim()))) {
            validate.errors.push({
                name: 'firstName',
                message: '*special characters not allowed'
            })
        }
        if (!(/^[A-Za-z]+$/.test(user.lastName?.trim()))) {
            validate.errors.push({
                name: 'lastName',
                message: '*special characters not allowed'
            })
        }

        if (!/^[A-Za-z]+$/.test(user.city?.trim())) {
            validate.errors.push({
                name: 'city',
                message: '*enter correct city '
            })
        }
        if (user.address?.trim() == "") {
            validate.errors.push({
                name: 'address',
                message: '*enter correct address'
            })
        }
        if (!/^[A-Za-z]+$/.test(user.state?.trim())) {
            validate.errors.push({
                name: 'state',
                message: '*enter correct State'
            })
        }
        if (!/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(user.phone?.trim())) {
            validate.errors.push({
                name: 'phone',
                message: '*enter correct phone'
            })
        }
        if (user.zip?.length < 4 || user.zip?.length > 6) {
            validate.errors.push({
                name: 'zip',
                message: '*enter correct zip code'
            })
        }

        if (validate.errors.length === 0) {
            validate.isValid = true
        }
        return validate;
    };


    const productCart = {
        cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],

        updateLocalStorage: function () {
            localStorage.setItem('cart', JSON.stringify(this.cart));
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

        updateCart: function (e) {
            if (e.target.hasAttribute('data-btn')) {
                const cartItemId = e.target.closest('li').getAttribute('data-id');
                let btn = e.target.dataset.btn;

                if (btn === 'incr') {
                    this.increaseQty(cartItemId)
                }
                if (btn === 'decr') {
                    this.decreaseQty(cartItemId)
                }
                this.renderCart()
            }
        },

        increaseQty: function (productId) {
            let item = this.cart.find(item => item.id === +productId)
            let itemAt = this.cart.indexOf(item)
            this.cart[itemAt].qty++
            this.updateLocalStorage()
           
        },
        decreaseQty: function (productId) {
            let item = this.cart.find(item => item.id === +productId)
            let itemAt = this.cart.indexOf(item)
            this.cart[itemAt].qty--
            if (this.cart[itemAt].qty === 0) {
                this.removeFromCart(productId)
            }
            this.updateLocalStorage()

        },

        setError: function (errors) {
            errors.map(error => {
                document.querySelector(`[data-${error.name}Error]`).innerHTML = error.message
            })
        },

        bind: function () {
            const selectors = {
                cartList: document.querySelector('[data-cartList]'),
                clearCartList : document.querySelector('[data-clearCart]'),
                delivaryform : document.querySelector('#delivaryForm') 
            };

            selectors.cartList.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-btn')) {
                    this.updateCart(e)
                }
                if (e.target.hasAttribute('data-removeFromCart')) {
                    let productId = e.target.closest('li').getAttribute('data-id')
                    this.removeFromCart(productId);
                }
            })
            selectors.clearCartList.addEventListener('click', () => {
                if(this.cart.length === 0) return;
                if(confirm('Are you sure?')){
                    this.clearCart()
                    this.renderCart()
                }
            })

            selectors.delivaryform.addEventListener('submit', (e) => {
                e.preventDefault()
                let delivaryAddress = new FormData(selectors.delivaryform)
                let user = Object.fromEntries(delivaryAddress);
                if (validation(user).isValid) {
                    let totalAmount = this.cart.map(item => item?.qty * item?.price).reduce((sum, nextitem) => sum + nextitem)
                    user.amount = totalAmount;
                    createOrderApi(user)
                    return;
                }
                let errors = validation(user).errors;
                this.setError(errors)
            
            })

        },
        renderCart: function () {

            const cartList = document.querySelector('[data-cartList]');
            cartList.innerHTML = '';

            cartList.innerHTML = this.cart.map((product) => {
                const { id, title, thumbnail, price, qty } = product;

                const amount = price * qty;

                return `
                <li class="flex gap-4 bg-white p-4 shadow rounded" data-id='${id}'>
                    <div class="w-24 aspect-square rounded overflow-hidden">
                        <img src="${thumbnail}" alt="${title}" class="h-full w-full object-cover" />
                    </div>
                    <div class="flex-1 flex flex-col">
                        <div class="flex justify-between gap-2 text-base font-medium text-gray-900">
                            <h3>${title}</h3>
                            <p class="ml-4">$${amount}</p>
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
            }).join('');

             

            let total = this.cart.map(item => {
                return item?.qty * item?.price
            })
            if(total.length != 0){
                total = total?.reduce((sum, nextitem) => {
                    return sum + nextitem
                })
                document.querySelector('[data-total]').innerHTML =  Number.parseFloat(total).toFixed(2)
            }
            if(total.length == 0){
                document.querySelector('[data-total]').innerHTML =  0;
            }
            this.bind()
        }
    }
    productCart.renderCart()

})()