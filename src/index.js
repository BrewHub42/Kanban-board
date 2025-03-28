import "./styles.css";
let draggedCard = null;
let rightClickedCard = null;
let boardColumns = ['todo', 'doing', 'done'];

document.addEventListener('DOMContentLoaded', loadTasksToLocalStorage);

export function addTask(columnId){
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value;

    if (taskText == ""){
        return;
    }

    const taskDate = new Date().toLocaleString();
    const taskElement = createTaskElement(taskText, taskDate);


    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
    updateTasksCount(columnId);
    saveTasksToLocalStorage(columnId, taskText, taskDate);
    input.value = "";
}

function createTaskElement(taskText, taskDate){
    const element = document.createElement('div');
    element.innerHTML = 
                        `<span>${taskText}</span><br>
                         <small class="time">${taskDate}</small>`;
    
    element.classList.add('card');
    element.setAttribute('draggable', 'true');

    element.addEventListener('dragstart', dragStart);
    element.addEventListener('dragend', dragEnd);
    element.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        rightClickedCard = this;
        showContextMenu(event.pageX, event.pageY) 
    });

    return element;
}

const contextmenu = document.querySelector('.context-menu');

document.addEventListener('keydown', closeContextMenuHandler);
document.addEventListener('click', closeContextMenuHandler);
document.addEventListener('dragstart', closeContextMenuHandler);

function closeContextMenuHandler(event){
    if (event.type === 'keydown' && event.key === 'Escape'){
        contextmenu.style.display = 'none';
    } else if (event.type === 'click'){
        contextmenu.style.display = 'none';
    } else if (event.target === document.querySelector('.card') && event.type === 'dragstart'){
        contextmenu.style.display = 'none';
    } 
}

function showContextMenu(x, y){
    contextmenu.style.left = `${x}px`;
    contextmenu.style.top = `${y}px`;
    contextmenu.style.display = 'block';
}

function dragStart(){
    this.classList.add('dragging');
    draggedCard = this;
}

function dragEnd(){
    this.classList.remove('dragging');
    draggedCard = null;
    boardColumns.forEach(columnId => {
        updateTasksCount(columnId);
        updateLocalStorage();
    });
}

const columns = document.querySelectorAll('.column .tasks');

columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
});

function dragOver(event){
    event.preventDefault();
    this.appendChild(draggedCard);
}

export function editTask() {
    if (rightClickedCard !== null){
        const newTaskText = prompt('Edit task:-', rightClickedCard.textContent);
        if(newTaskText !== ""){
            rightClickedCard.textContent = newTaskText;
            updateLocalStorage();
        }
    }
}

export function deleteTask(){
    if(rightClickedCard !== null){
        const columnId = rightClickedCard.parentNode.id;
        rightClickedCard.remove();

        updateLocalStorage();
        updateTasksCount(columnId.split("-")[0]);
    }
}

function updateTasksCount(columnId) {
    const count = document.querySelectorAll(`#${columnId}-tasks .card`).length;
    document.getElementById(`${columnId}-count`).textContent = count;
}

function saveTasksToLocalStorage(columnId, taskText, taskDate) {
    const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
    tasks.push({text:taskText, date:taskDate});
    localStorage.setItem(columnId, JSON.stringify(tasks));
}

function loadTasksToLocalStorage() {
    boardColumns.forEach(columnId => {
        const tasks = JSON.parse(localStorage.getItem(columnId)) || [];
        tasks.forEach(({text, date}) => {
            const taskElement = createTaskElement(text, date);
            document.getElementById(`${columnId}-tasks`).appendChild(taskElement);
        });
        updateTasksCount(columnId);
    });
}

function updateLocalStorage() {
    boardColumns.forEach(columnId => {
        const tasks =  [];
        document.querySelectorAll(`#${columnId}-tasks .card`).forEach((card) => {
            const taskText = card.querySelector('span').textContent;
            const taskDate = card.querySelector('small').textContent;
            tasks.push({text: taskText, date: taskDate});
        });
        localStorage.setItem(columnId, JSON.stringify(tasks));
    });
}