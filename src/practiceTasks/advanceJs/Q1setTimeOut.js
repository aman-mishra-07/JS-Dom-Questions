// function printNumbers(from, to) {
//     let startFrom = from
//     let endAT = ++to;

//     let startId = setInterval(function (){
//         console.log(startFrom);
//         startFrom++;
//         if(startFrom == endAT){
//             clearInterval(startId)
//         }
//     }, 1000)
// }
// printNumbers(1,10)

function printNumbers2(from, to){
    let endAT = ++to;
    let timer = setTimeout(function pn() {
        console.log(from);
        from++
        timer = setTimeout(pn, 1000); 
        if(from == endAT){
            return clearTimeout(timer)
        }
      }, 1000);
}

printNumbers2(1,10)