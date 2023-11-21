(function () {
    'use strict'

    const createUser = {
        Users: JSON.parse(localStorage.getItem('users')) || [],

        userform: document.querySelector('#addUserForm'),
        
        updateLocalStorage: function () {
            localStorage.setItem('users', JSON.stringify(this.Users));
        },

        render: function () {

            this.userform.addEventListener('submit', (e) => {
                e.preventDefault()
                let newUser = new FormData(this.userform)
                let user = {}
                for (const elem of newUser) {
                    if (elem[1].trim !== '') {
                        if (elem[1].size == 0) {
                            user[elem[0]] = elem[1]
                            return
                        };
                        user[elem[0]] = elem[1];
                    }
                }
                if(user != {}){
                    this.Users.push(user)
                }
                this.updateLocalStorage()
            })
        },
    }
    createUser.render()
})()