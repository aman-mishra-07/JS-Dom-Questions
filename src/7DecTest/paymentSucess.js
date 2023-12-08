(() => {
    'use strict'
    const paymentDetails = {
        details : localStorage.getItem('paymentDetails') ? JSON.parse(localStorage.getItem('paymentDetails')) : null ,
       
        render:function(){
            const detailsUl = document.querySelector('[data-paymentDets]')
            const imgLogo = document.querySelector('[data-logo]')
            let addressContainor = document.querySelector('[data-address]');
            if(this.details === null) return;
            const {amount, prefill, order_id, image } = this.details;
            let shippingAddress = document.createElement('address')
            shippingAddress.innerHTML = `${prefill?.address}, ${prefill?.city}, ${prefill?.state}, ${prefill?.zip} `
            addressContainor.appendChild(shippingAddress);
            imgLogo.src = image ? image : 'https://t3.ftcdn.net/jpg/03/19/57/68/360_F_319576874_VN6uaMoGHMzbo6wBI5eFtBlIUaXvljH6.jpg'

            detailsUl.innerHTML = `
            <li class="p-2 w-full flex items-center justify-between">
                <p>Name</p>
                <p>${prefill?.name}</p>
            </li>
            <li class="p-2 w-full flex items-center justify-between">
                <p>Order Id</p>
                <p>${order_id}</p>
            </li>
            <li class="p-2 w-full flex items-center justify-between">
                <p>Amount</p>
                <p>${amount}</p>
            </li>
            <li class="p-2 w-full flex items-center justify-between">
                <p>Contact</p>
                <p>${prefill?.contact}</p>
            </li>
              `
            // localStorage.removeItem('paymentDetails')

        } 
    }
    paymentDetails.render()
})()