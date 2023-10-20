 // const todos = {
//     'name' : 'ToDo List',
//     'tasks' : [],
//     'addTask' : function(task) {
//         this.tasks.push(task);
//     },
// }

// todos.addTask('running');
// console.log(todos.tasks);

// document.querySelector('h1').innerHTML = todos.name;

// let newTask = document.getElementsByName('inputTask');
// todos.addTask(newTask)

const arrObj = [
    {
        title : 'A',
        children : [
            {
                title : 'C',
            },
            {
                title : 'D',
                children : [
                    {
                        title : 'C',
                    },
                    {
                        title : 'D',
                    }
                ]
            }
        ]
    },
    {
        title : 'B',
    }
]


function contextList(arr) {
    let ul = '<ul>';
    let li = "";
    
    for (let i = 0; i < arr.length; i++) {
        li = `<li>${arr[i].title}`;
        if(arr[i].children){
            li += `${contextList(arr[i].children)}`;
        }
        
        ul += `${li}</li>`;  
    }
    ul += `</ul>`; 

    return ul;
}

document.body.innerHTML = contextList(arrObj);



// function contextList(arr) {
//     let ul = document.createElement('ul')   
//     for (let i = 0; i <arr.length; i++) {
//         let li = document.createElement('li')
//         let textNode = document.createTextNode(arr[i].title)
//         li.appendChild(textNode);
//         if(arr[i].children){
//             li.appendChild(contextList(arr[i].children));
//             // console.log(contextList(arr[i].children));
//         }
//         ul.appendChild(li);
//     }
//     return ul; 
// }
// document.body.appendChild(contextList(arrObj));

    