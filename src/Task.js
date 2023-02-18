class Task
{
    constructor(title, priority, dueDate, project)
    {
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.project = project;
        this.favorited = false;
        this.completed = false;
        this.id = "id" + Math.random().toString(16).slice(2);
    }
}

export default Task;