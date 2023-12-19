(function () {
    'use strict'

    const makePaymentApi = (user) => {
        let options = {
            "key": "rzp_test_JiQyi8g2zjhFQM", // Enter the Key ID generated from the Dashboard
            "amount": user.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": "INR",
            "name": "FillCarts shopping", //your business name
            "description": "Test Transaction",
            "image": 'https://t3.ftcdn.net/jpg/03/19/57/68/360_F_319576874_VN6uaMoGHMzbo6wBI5eFtBlIUaXvljH6.jpg',
            "order_id": "order_NBoZduoFrqRiaY", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": function (response) {
                window.location.href = `paymentSucces.html`
                localStorage.setItem('handlerRes', JSON.stringify(response))
            },
            "prefill": {
                "name": `${user.firstName} ${user.lastName}`, //your customer's name
                "email": "gaurav.kumar@example.com",
                "contact": user.phone, //Provide the customer's phone number for better conversion rates ,
                'address': user.address,
                'city': user.city,
                'state': user.state,
                'zip': user.zip
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        localStorage.setItem('paymentDetails', JSON.stringify(options))
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
        });
        rzp1.open();
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
        setQty: function (productId, val) {
            let item = this.cart.find(item => item.id === +productId)
            let itemAt = this.cart.indexOf(item)
            this.cart[itemAt].qty = val
            this.updateLocalStorage();
        },
        increaseQty: function (productId) {
            let item = this.cart.find(item => item.id === +productId)
            let itemAt = this.cart.indexOf(item)
            if (this.cart[itemAt].qty < this.cart[itemAt].stock) {
                this.cart[itemAt].qty++;
            }
            this.updateLocalStorage();
        },
        decreaseQty: function (productId) {
            let item = this.cart.find(item => item.id === +productId)
            let itemAt = this.cart.indexOf(item)
            this.cart[itemAt].qty--;
            if (this.cart[itemAt].qty === 0) {
                this.removeFromCart(productId)
            }
            this.updateLocalStorage();
        },
        setError: function (errors) {
            errors.map(error => {
                document.querySelector(`[data-${error.name}Error]`).innerHTML = error.message;
            })
        },

        showMessage: function (msg) {
            const msgModal = document.querySelector('#modal');
            const msgBox = document.querySelector('[data-msg]');
            const closeModalBtn = document.querySelector('[data-closeModal]');
            msgBox.innerHTML = msg;
            msgModal.classList.remove('hidden');
            msgModal.classList.add('flex');
            closeModalBtn.addEventListener('click', () => {
                msgModal.classList.remove('flex');
                msgModal.classList.add('hidden');
            })
            setTimeout(() => {
                msgModal.classList.remove('flex');
                msgModal.classList.add('hidden');
            }, 3000)
        },

        bind: function () {
            const selectors = {
                cartList: document.querySelector('[data-cartList]'),
                clearCartList: document.querySelector('[data-clearCart]'),
                delivaryform: document.querySelector('#delivaryForm'),
                firstName: document.querySelector('[name="firstName"]'),
                lastName: document.querySelector('[name="lastName"]'),
                address: document.querySelector('[name="address"]'),
                city: document.querySelector('[name="city"]'),
                state: document.querySelector('[name="state"]'),
                zip: document.querySelector('[name="zip"]'),
                phone: document.querySelector('[name="phone"]'),
                increaseQtyBtn: document.querySelectorAll('[data-btn="incr"]'),
                decreaseQtyBtn: document.querySelectorAll('[data-btn="decr"]'),
                qtyInput: document.querySelectorAll('[data-qtyInput]'),
            };

            selectors.increaseQtyBtn.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    let productId = e.target.closest('li').getAttribute('data-id');
                    this.increaseQty(productId)
                    this.renderCart()
                })
            })
            selectors.decreaseQtyBtn.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    let productId = e.target.closest('li').getAttribute('data-id');
                    this.decreaseQty(productId)
                    this.renderCart()
                })
            })
            selectors.qtyInput.forEach((inputElem) => {
                inputElem.addEventListener('blur', (e) => {
                    let productId = e.target.closest('li').getAttribute('data-id');
                    this.setQty(productId, e.target.value)
                    this.renderCart()
                })
            })

            selectors.cartList.addEventListener('click', (e) => {
                if (e.target.hasAttribute('data-removeFromCart')) {
                    let productId = e.target.closest('li').getAttribute('data-id')
                    this.removeFromCart(productId);
                }
            },)
            selectors.clearCartList.addEventListener('click', () => {
                if (this.cart.length === 0) return;
                if (confirm('Are you sure?')) {
                    this.clearCart()
                }
            })
            selectors.firstName.addEventListener('blur', (e) => {
                if ((/^[A-Za-z]+$/.test(selectors.firstName.value.trim()))) {
                    document.querySelector('[data-firstNameError]').innerHTML = '';
                    return;
                }
                document.querySelector('[data-firstNameError]').innerHTML = '*enter correct first name'
            })
            selectors.lastName.addEventListener('blur', (e) => {
                if ((/^[A-Za-z]+$/.test(selectors.lastName.value.trim()))) {
                    document.querySelector('[data-lastNameError]').innerHTML = '';
                    return;
                }
                document.querySelector('[data-lastNameError]').innerHTML = '*enter correct last name'
            })
            selectors.address.addEventListener('blur', (e) => {
                if (selectors.address.value.trim() !== '') {
                    document.querySelector('[data-addressError]').innerHTML = '';
                    return;
                }
                document.querySelector('[data-addressError]').innerHTML = '*enter correct address'
            })
            selectors.city.addEventListener('blur', (e) => {
                if ((/^[A-Za-z]+$/.test(selectors.city.value.trim()))) {
                    document.querySelector('[data-cityError]').innerHTML = '';
                    return;
                }
                document.querySelector('[data-cityError]').innerHTML = '*enter correct city'
            })
            selectors.state.addEventListener('blur', (e) => {
                if ((/^[A-Za-z]+$/.test(selectors.state.value.trim()))) {
                    document.querySelector('[data-stateError]').innerHTML = '';
                    return;
                }
                document.querySelector('[data-stateError]').innerHTML = '*enter correct state'
            })
            selectors.zip.addEventListener('blur', (e) => {
                if (selectors.zip.value.trim() !== '') {
                    document.querySelector('[data-zipError]').innerHTML = '';
                    return;
                }
                document.querySelector('[data-zipError]').innerHTML = '*enter correct zip'
            })
            selectors.phone.addEventListener('blur', (e) => {
                if (/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(selectors.phone.value.trim())) {
                    document.querySelector('[data-phoneError]').innerHTML = '';
                    return;
                }
                document.querySelector('[data-phoneError]').innerHTML = '*enter correct phone'
            })
            selectors.delivaryform.addEventListener('submit', (e) => {
                e.preventDefault()
                let delivaryAddress = new FormData(selectors.delivaryform)
                let user = Object.fromEntries(delivaryAddress);
                if (this.cart.length === 0) {
                    this.showMessage('Your cart in empty');
                    return;
                }
                if (validation(user).isValid && this.cart.length > 0) {
                    let totalAmount = this.cart.map(item => item?.qty * item?.price).reduce((sum, nextitem) => sum + nextitem)
                    user.amount = totalAmount;
                    makePaymentApi(user)
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
                const { id, title, thumbnail, price, qty, stock, rating } = product;
                const amount = price * qty;
                return `
                <li class="flex gap-4 bg-white p-4 shadow rounded" data-id='${id}'>
                    <div class="w-24 aspect-square rounded overflow-hidden">
                        <img src="${thumbnail}" alt="${title}" class="h-full w-full object-cover" />
                    </div>
                    <div class="flex-1 flex flex-col">
                        <div class="flex justify-between gap-2 text-base font-medium text-gray-900">
                            <h3>${title}</h3>
                            <p class="ml-4">$${price}</p>
                        </div>
                        <div>
                            <p class="text-sm flex items-center gap-2"><svg class="w-3 h-3 text-yellow-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                        </svg> ${rating.toFixed(1)}/5 </p>
                        </div>
                        <div class="items-end flex-1 flex justify-between gap-2 text-sm">
                            <p class="text-gray-500 text-base border px-2">
                                <button type="button" data-btn="decr">&minus;</button>
                                <input type="number" data-qtyInput class="w-6 hidden-spinner" value="${qty}">
                                <button type="button" data-btn="incr">&plus;</button>
                            </p>
                            <span class="hidden sm:block sm:flex-1">from stock of ${stock} </span>
                            <button type="button" data-removeFromCart
                                class="font-medium text-indigo-600 hover:text-indigo-500">
                                Remove
                            </button>
                        </div>
                    </div>
                </li>
                `
            }).join('');
            const totalPriceCont = document.querySelector('[data-total]');
            let total = this.cart.map(item => {
                return item?.qty * item?.price;
            })
            if (total.length != 0) {
                total = total?.reduce((sum, nextitem) => {
                    return sum + nextitem;
                })
                totalPriceCont.innerHTML = Number.parseFloat(total).toFixed(2);
            }
            if (total.length == 0) {
                totalPriceCont.innerHTML = 0;
            }
            this.bind()
        }
    }
    productCart.renderCart()
})()