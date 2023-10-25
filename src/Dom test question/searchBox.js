"use strict"

const users = [
    {
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret",
        "email": "Sincere@april.biz",
    },
    {
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette",
        "email": "Shanna@melissa.tv",

    },
    {
        "id": 3,
        "name": "Clementine Bauch",
        "username": "Samantha",
        "email": "Nathan@yesenia.net",
    },
    {
        "id": 4,
        "name": "Patricia Lebsack",
        "username": "Karianne",
        "email": "Julianne.OConner@kory.org",

    },
    {
        "id": 5,
        "name": "Chelsey Dietrich",
        "username": "Kamren",
        "email": "Lucio_Hettinger@annie.ca",

    },
    {
        "id": 6,
        "name": "Dennis Schulist",
        "username": "Leopoldo_Corkery",
        "email": "Karley_Dach@jasper.info",

    },
    {
        "id": 7,
        "name": "Kurtis Weissnat",
        "username": "Elwyn.Skiles",
        "email": "Telly.Hoeger@billy.biz",

    },
    {

    },
    {
        "id": 9,
        "name": "Glenna Reichert",
        "username": "Delphine",
        "email": "Chaim_McDermott@dana.io"
    },
    {
        "id": 10,
        "name": "Clementina DuBuque",
        "username": "Moriah.Stanton",
        "email": "Rey.Padberg@karina.biz",

    }
]

// console.log(users);
// function filterList() {
//     let ul = document.querySelector('ul');
//     ul.innerHTML = "";
//     let inputValue = document.querySelector('#searchBox').value;

//     if (inputValue !== "") {
//         ul.classList.remove("hidden");
//     } else {
//         ul.classList.add("hidden");
//     }
//     let result = users.filter((user) => user?.name?.toLowerCase().startsWith(inputValue))

//     result.forEach((elem) => {
//         let li = document.createElement('li');
//         let text = document.createTextNode(elem.name)
//         li.setAttribute('class', 'px-4 py-2 hover:bg-slate-100')
//         li.appendChild(text);
//         ul.appendChild(li)
//    })
// }
// document.querySelector('#searchBox').addEventListener('input', filterList);

const searchBox = {
  
    bindElement() {
            let ul = document.querySelector('ul');
            ul.innerHTML = "";
            let inputValue = document.querySelector('#searchBox').value;
        
            if (inputValue !== "") {
                ul.classList.remove("hidden");
            } else {
                ul.classList.add("hidden");
            }
            let result = users.filter((user) => user?.name?.toLowerCase().startsWith(inputValue))
        
            result.forEach((elem) => {
                let li = document.createElement('li');
                let text = document.createTextNode(elem.name)
                li.setAttribute('class', 'px-4 py-2 hover:bg-slate-100')
                li.appendChild(text);
                ul.appendChild(li)
           })
        }
}
document.querySelector('#searchBox').addEventListener('input', searchBox.bindElement);







































