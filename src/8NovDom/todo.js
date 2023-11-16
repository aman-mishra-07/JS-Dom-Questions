(function () {
    'use strict'

    const todo = {
        todos: JSON.parse(localStorage.getItem('todos')) || [],

        taskInputBox: document.querySelector('#newTask'),
        newTaskContainor: document.querySelector('[data-newTask]'),
        pendingTaskContainor: document.querySelector('[data-pendingTask]'),
        completedTaskContainor: document.querySelector('[data-completedTask]'),

        updateLocalStorage: function () {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        },

        addNewTask: function () {
            let newTask;
            if (this.taskInputBox.value.trim()) {
                newTask = {
                    taskName: this.taskInputBox.value.trim(),
                    taskId: Date.now(),
                    taskStatus: 'assigned'
                }
            }
            this.todos.unshift(newTask);
            this.updateLocalStorage()
            this.render()
        },
        deleteTask: function (taskid) {
            this.todos = this.todos.filter(item => item?.taskId !== +taskid)
            this.updateLocalStorage()
            this.render()
        },

        render: function () {
            let todo = this.todos;
            this.newTaskContainor.innerHTML = ''
            this.pendingTaskContainor.innerHTML = ''
            this.completedTaskContainor.innerHTML = ''
            todo.forEach((task) => {
                let newTask = document.createElement('li');
                newTask.setAttribute('class', 'flex justify-between items-center border px-4 py-2 font-semibold')
                newTask.setAttribute('draggable', 'true')
                newTask.setAttribute('data-taskId', `${task?.taskId}`);
                let newTaskText = document.createElement('span');
                newTaskText.innerText = task?.taskName;

                let deleteBtn = document.createElement('button');
                deleteBtn.innerText = 'Delete'
                deleteBtn.setAttribute('type', 'button');
                deleteBtn.setAttribute('class', 'border px-2 py-1 rounded-md');
                deleteBtn.setAttribute('data-btnType', 'deleteBtn');

                newTask.append(newTaskText, deleteBtn)
                if (task?.taskStatus.toLowerCase() === 'assigned') {
                    this.newTaskContainor.appendChild(newTask)
                }
                if (task?.taskStatus.toLowerCase() === 'pending') {
                    this.pendingTaskContainor.appendChild(newTask)
                }
                if (task?.taskStatus.toLowerCase() === 'completed') {
                    this.completedTaskContainor.appendChild(newTask)
                }

                deleteBtn.addEventListener('click', (e) => {
                    let thisTask = e.target.closest('li').getAttribute('data-taskid');
                    this.deleteTask(thisTask);
                })

            });
            this.dragDrop()
        },
        dragDrop: function () {
            let listItems = document.querySelectorAll('li');
            let newTaskContainer = document.querySelector('[data-newTask]');
            let pendingTaskContainer = document.querySelector('[data-pendingTask]');
            let completedTaskContainer = document.querySelector('[data-completedTask]');

            let selected = null;
            let selectedObj = [];
            let selectedtaskId = '';
            listItems.forEach((item) => {
                item.addEventListener('dragstart', (e) => {
                    selected = e.target;
                    selectedtaskId = selected.getAttribute('data-taskid');
                    selectedObj = this.todos.filter((task => task.taskId === +selectedtaskId))

                });
            });


            newTaskContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            newTaskContainer.addEventListener('drop', (e) => {
                if (selected !== null) {
                    newTaskContainer.appendChild(selected);
                    selectedObj[0].taskStatus = 'assigned'
                    this.updateLocalStorage()
                    selected = null;
                }
            });

            pendingTaskContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            pendingTaskContainer.addEventListener('drop', (e) => {
                if (selected !== null) {
                    pendingTaskContainer.appendChild(selected);
                    selectedObj[0].taskStatus = 'pending'
                    this.updateLocalStorage()
                    selected = null;
                }
            });

            completedTaskContainer.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            completedTaskContainer.addEventListener('drop', (e) => {
                if (selected !== null) {
                    completedTaskContainer.appendChild(selected);
                    selectedObj[0].taskStatus = 'completed'

                    this.updateLocalStorage()
                    selected = null;
                }
            });

        },
    }
    document.querySelector('#todoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!document.querySelector('#newTask').value.trim()) {
            alert('Enter Task')
            return;
        }
        todo.addNewTask();

    })
    window.onload = todo.render()
   
})()