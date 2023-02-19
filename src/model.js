import Project from "./Project";
import Task from "./Task";
import {updateTasksView, createProjectTab, updateNewTaskModalProjects} from "./dom";
import {format, compareAsc, parseISO, isEqual, differenceInDays} from 'date-fns';

const Model = (() => 
{
    let projects = new Map();

    function setProjectsList(projectsList)
    {
        projects = projectsList;
    }

    function addNewProject(name)
    {
        projects.set(name, new Project(name));
        createProjectTab(name);

        localStorage.setItem("projectsList", JSON.stringify(getProjectsList()));
    }

    function removeProject(name)
    {
        projects.delete(name);
        updateTasksView(name);
        updateNewTaskModalProjects();

        localStorage.setItem("projectsList", JSON.stringify(getProjectsList()));
    }

    function addNewTask(task)
    {
        (projects.get(task.project)).addTask(task);
        updateTasksView(task.project);

        localStorage.setItem("projectsList", JSON.stringify(getProjectsList()));
    }

    function removeTask(taskID, taskProject)
    {
        let projectTasks = getProject(taskProject).taskList;
        
        for(let i = 0; i < projectTasks.length; i++)
        {
            if(projectTasks[i].id == taskID)
            {
                projectTasks.splice(i, 1);
                break;
            }
        }

        updateTasksView(taskProject);
        localStorage.setItem("projectsList", JSON.stringify(getProjectsList()));
    }

    function getTask(taskID, taskProject)
    {
        let projectTaskList = projects.get(taskProject).taskList;

        for(let i = 0; i < projectTaskList.length; i++)
        {
            if(projectTaskList[i].id == taskID)
            {
                return projectTaskList[i];
            }
        }
    }

    function getProjectsList()
    {
        let primitiveArray = [];

        for (const value of projects.values())
        {
            primitiveArray.push(value);
        }

        return primitiveArray;
    }

    function checkOrUncheckTask(taskID, taskProject)
    {
        let task = getTask(taskID, taskProject)
        task.completed = !task.completed;

        localStorage.setItem("projectsList", JSON.stringify(getProjectsList()));
    }

    function toggleFavoriteTask(taskID, taskProject)
    {
        let task = getTask(taskID, taskProject);
        task.favorited = !task.favorited;

        localStorage.setItem("projectsList", JSON.stringify(getProjectsList()));
    }

    function populateDefaultProjects()
    {
        let task1 = new Task("Take dog for a walk", "low", "2023-07-02", "Default");
        let task2 = new Task("Do laundry", "medium", "2023-02-13", "Default");
        let task3 = new Task("Go to the gym", "medium", "2023-02-07", "Default");
        let task4 = new Task("Finish Odin", "high", "2024-01-01", "Default");
        projects.set("Default", new Project("Default", [task1, task2, task3, task4]));
    }

    function getProject(projectName)
    {
        return projects.get(projectName);
    }

    function getProjectTaskList(projectName)
    {
        return getProject(projectName).taskList;
    }

    function getInboxTasks()
    {
        let inboxTasks = [];

        for(const value of projects.values())
        {
            for(let k = 0; k < value.taskList.length; k++)
            {
                inboxTasks.push(value.taskList[k]);
            }
        }

        return inboxTasks;
    }

    function getTodayTasks()
    {
        let todayTasks = [];
        let taskDate;
        let currentDate = new Date();

        for(const value of projects.values())
        {
            for(let k = 0; k < value.taskList.length; k++)
            {
                taskDate = parseISO(value.taskList[k].dueDate);
                let isSameYear = taskDate.getFullYear() == currentDate.getFullYear();
                let isSameMonth = taskDate.getMonth() == currentDate.getMonth();
                let isSameDay = taskDate.getDay() == currentDate.getDay();

                if((isSameYear && isSameMonth) && isSameDay)
                {
                    todayTasks.push(value.taskList[k]);
                }
            }
        }

        return todayTasks;
    }

    function getUpcomingTasks()
    {
        let upcomingTasks = [];
        let taskDate;
        let currentDate = new Date();

        for(const value of projects.values())
        {
            for(let i = 0; i < value.taskList.length; i++)
            {
                taskDate = parseISO(value.taskList[i].dueDate);

                if(differenceInDays(taskDate, currentDate) >= 0 && differenceInDays(taskDate, currentDate) <= 7)
                {
                    upcomingTasks.push(value.taskList[i]);
                };
            }
        }

        return upcomingTasks;
    }

    function getFavoriteTasks()
    {
        let favoriteTasks = [];

        for(const value of projects.values())
        {
            for(let i = 0; i < value.taskList.length; i++)
            {
                if(value.taskList[i].favorited == true)
                {
                    favoriteTasks.push(value.taskList[i]);
                }
            }
        }

        return favoriteTasks;
    }

    function getCompletedTasks()
    {
        let completedTasks = [];

        for(const value of projects.values())
        {
            for(let i = 0; i < value.taskList.length; i++)
            {
                if(value.taskList[i].completed == true)
                {
                    completedTasks.push(value.taskList[i]);
                }
            }
        }

        return completedTasks;
    }

    return{
        setProjectsList,
        addNewTask,
        getTask,
        removeTask,
        addNewProject,
        populateDefaultProjects,
        getProject,
        removeProject,
        getProjectsList,
        getProjectTaskList,
        getInboxTasks,
        getTodayTasks,
        getUpcomingTasks,
        getFavoriteTasks,
        getCompletedTasks,
        checkOrUncheckTask,
        toggleFavoriteTask
    };
})();

export default Model;