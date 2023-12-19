//Q3 

// function calljob() {
//     let myPromise = new Promise((resolve) =>{
//         setTimeout(function(){
//             resolve('Hello world')
//         },2000)
//     })
//     return myPromise.then((value) => {
//         console.log(value)
//     })

// }

// calljob();

function checkOddEven(num) {
    return new Promise((resolve, reject) => {
        if (num % 2 === 0) {
            setTimeout(() => {
                resolve('even')
            }, 2000)
        }
        if (num % 2 !== 0) {
            setTimeout(() => {
                resolve('odd')
            }, 1000)
        }
        if (isNaN(num) || typeof num === 'string') {
            reject('Not a Number')
        }
    }).then((res) => {
        console.log(res);
    }).catch((rej) => {
        console.log(rej);
    })
}

checkOddEven(5)
checkOddEven(2)
checkOddEven('uhkdj')
checkOddEven('80')

const getImagePath = (image) => {
    return new Promise((resolve, reject) => {
        let selectedfile = new FileReader();
        selectedfile.readAsDataURL(image)
        selectedfile.addEventListener('load', () => {
            resolve(selectedfile.result)
        });
        selectedfile.addEventListener('error', () => {
            reject(selectedfile.error)
        });
    }).then(value => value).catch(err => err)
}