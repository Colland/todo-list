class Project
{
    constructor(name, taskList = [])
    {
        this.name = name;
        this.taskList = taskList;
    }

    addTask(task)
    {
        this.taskList.push(task);
    }
}

export default Project;