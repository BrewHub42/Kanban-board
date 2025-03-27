import "./styles.css";
// window.addTask = addTask;

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
    return element;
}