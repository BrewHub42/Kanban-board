import "./styles.css";
let draggedCard = null

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

    return element;
}

function dragStart(){
    this.classList.add('dragging');
    // console.log(this);
    draggedCard = this;
}

function dragEnd(){
    this.classList.remove('dragging');
    // console.log(this);
}

const columns = document.querySelectorAll('.column .tasks');

columns.forEach(column => {
    column.addEventListener('dragover', dragOver);
});

function dragOver(event){
    event.preventDefault();
    this.appendChild(draggedCard);
}