class Task {
    /** @type {String} */
    name;
    
    /** @type {Number} */
    #id;
    
    /** @type {HTMLLIElement} */
    #element;
    
    /** @type {Number} */
    static lastId = 1;
    
    /**
     * @param {String} name
     * @param {TaskList} taskList
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
    
    /** @returns {Number} */
    get id() {
        return this.#id;
    }
    
    /** @returns {HTMLLIElement} */
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
    /** @type {Array<Task>} */
    #list = [];
    
    /**
     * @callback onAdd
     * @param {Task} task
     * @param {Array<Task>} list
     */
    /** @type {onAdd} */
    onAdd = (task, list) => {};
    
    /**
     * @callback onRemove
     * @param {Task} deletedTask
     * @param {Array<Task>} list
     */
    /** @type {onRemove} */
    onRemove = (deletedTask, list) => {};
    
    /** @returns {Array<Task>} */
    get list() {
        return this.#list;
    }
    
    /** @param {Task} task */
    addTask(task) {
        this.#list.push(task);
        this.onAdd(task, this.#list);
    }
    
    /**
     * @param {Number} id
     * @returns {Boolean}
     */
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
    /** @type {HTMLInputElement} */
    #input;
    
    /** @type {HTMLButtonElement} */
    #addButton;
    
    /** @type {HTMLOListElement} */
    #ol;
    
    /**
     * @param {String} inputElementId
     * @param {String} addButtonElementId
     * @param {String} olElementId
     */
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
    
    /**
     * @callback onAddButtonCallback
     * @param {HTMLButtonElement} btn
     * @param {MouseEvent} ev
     */
    /** @param {onAddButtonCallback} callBack */
    onAddButtonClick(callback=(btn, ev)=>{}) {
        this.#addButton.addEventListener("click", callback);
    }
    
    /** @returns {String} */
    get inputValue() {
        return this.#input.value;
    }
    
    /** @param {TaskList} taskList */
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

/** @type {TaskList} */
const tasks = new TaskList();

/** @type {TaskComponent} */
const taskComponent = new TaskComponent("task-name", "add", "list");

taskComponent.onAddButtonClick((btn, ev)=>{
    if (taskComponent.inputValue!='')
        tasks.addTask(new Task(taskComponent.inputValue, tasks));
});

tasks.onAdd = (task, list) => {
    taskComponent.update(tasks);
    taskComponent.update(tasks);
}
tasks.onRemove = (deletedTask, list) => {
    taskComponent.update(tasks);
    taskComponent.update(tasks);
}
