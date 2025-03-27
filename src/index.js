import "./styles.css";
let draggedCard = null;
let rightClickedCard = null;

export function addTask(columnId){
    const input = document.getElementById(`${columnId}-input`);
    const taskText = input.value;

    if (taskText == ""){
        return;
    }

    const taskElement = createTaskElement(taskText);
    // console.log(taskElement);

    document.getElementById(`${columnId}-tasks`).appendChild(taskElement);

    input.value = "";
}

function createTaskElement(taskText){
    const element = document.createElement('div');
    element.textContent = taskText;
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
        }
    }
}

export function deleteTask(){
    if(rightClickedCard !== null){
        rightClickedCard.remove();
    }
}