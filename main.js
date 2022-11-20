class Task {
    name
    #id;
    #element;
    static lastId = 1;
    /*
     @param {String} name task name
     */
    constructor(name, taskList) {
        this.name = name;
        this.#id = Task.lastId;
        
        // element of this task
        this.#element = document.createElement("li");
        this.#element.dataset.id = this.#id;
        
        let span = document.createElement("span");
        span.innerText = this.name;
        this.#element.appendChild(span);
        
        let removeButton = document.createElement("button");
        removeButton.dataset.target = this.#id;
        removeButton.appendChild(document.createTextNode("remove"));
        removeButton.onclick = (btn, ev) =>
            taskList.removeTask(this.#id);
        removeButton.classList.add("remove");
        this.#element.appendChild(removeButton);
        
        let editeButton = document.createElement("button");
        editeButton.dataset.target = this.#id;
        editeButton.appendChild(document.createTextNode("edite"));
        editeButton.onclick = (btn, ev) => {
            swal({
                title: "Edite...",
                text: `edite task number ${this.#element.dataset.index}`,
                content: "input"
            }).then(name => {
                if (!name) return false;
                this.name = name;
                this.update();
            });
        }
        editeButton.classList.add("edite");
        this.#element.appendChild(editeButton);
        
        Task.lastId++;
    }
    get id() {
        return this.#id;
    }
    get element() {
        return this.#element;
    }
    update(){
        this.#element.firstElementChild.innerText = this.name;
        this.#element.dataset.id = this.#id;
        this.#element.childNodes[1].dataset.target = this.#id;
        this.#element.childNodes[2].dataset.target = this.#id;
    }
}
class TaskList {
    #list = [];
    onAdd = (task, list) => {};
    onRemove = (deletedTask, list) => {};
    get list() {
        return this.#list;
    }
    addTask(task) {
        this.#list.push(task);
        this.onAdd(task, this.#list);
    }
    removeTask(id) {
        let taskSet = new Set(this.#list);
        let deleted = this.#list.filter(v => {
            return v.id == id
        })[0];
        if (taskSet.delete(deleted)) {
            this.#list = Array.from(taskSet);
            this.onRemove(deleted, this.#list);
            return true;
        }
        return false;
    }
}
class TaskComponent {
    #input;
    #addButton;
    #ol;
    constructor(inputElementId, addButtonElementId, olElementId) {
        this.#input = document.getElementById(inputElementId);
        this.#addButton = document.getElementById(addButtonElementId);
        this.#ol = document.getElementById(olElementId);
        this.#addButton.addEventListener("click", (btn, ev)=>{});
        this.#input.addEventListener("keydown", (el)=>{
            if (el.key==="Enter") this.#addButton.click();
            else return;
        });
    }
    clear() {
        this.#input.value = "";
    }
    set onAddButtonClick(callBack=(btn, ev)=>{}) {
        this.#addButton.addEventListener("click", callBack);
    }
    get inputValue() {
        return this.#input.value;
    }
    update(taskList) {
        if (this.#ol.hasChildNodes()){
            this.#ol.childNodes.forEach(el => {
                el.remove();
            });
        }
        this.clear();
        taskList.list.forEach((task, index) => {
            task.element.dataset.index = index+1;
            this.#ol.appendChild(task.element);
        });
    }
}

const tasks = new TaskList();
const taskComponent = new TaskComponent("task-name", "add", "list");

taskComponent.onAddButtonClick = (btn, ev)=>{
    if (taskComponent.inputValue!='')
        tasks.addTask(new Task(taskComponent.inputValue, tasks));
}

tasks.onAdd = (task, list) => {
    taskComponent.update(tasks);
    taskComponent.update(tasks);
}
tasks.onRemove = (deletedTask, list) => {
    taskComponent.update(tasks);
    taskComponent.update(tasks);
}
