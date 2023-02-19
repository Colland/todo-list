import Model from "./model";
import { loadInitialPage } from "./dom";
import Task from "./Task";
import Project from "./Project"

if(localStorage.getItem("projectsList") === null)
{
    Model.populateDefaultProjects();
}
else
{
    getProjectsListFromLocalStorage();
}

loadInitialPage();

const Controller = (() => 
{
    function addNewTask(task)
    {
        Model.addNewTask(task);
    }

    return{
       addNewTask
    };
})();

function getProjectsListFromLocalStorage()
{
    let jsonOutput = JSON.parse(localStorage.getItem("projectsList"));
    let projectsList = [];

    jsonOutput.forEach((project) => projectsList.push((Object.assign(new Project(), project))));

    for(let i = 0; i < projectsList.length; i++)
    {
        for(let k = 0; k < projectsList[i].taskList.length; k++)
        {
            projectsList[i].taskList[k] = Object.assign(new Task(), projectsList[i].taskList[k]);
        }
    } 

    let projectsListMap = new Map();

    for(let i = 0; i < projectsList.length; i++)
    {
        projectsListMap.set(projectsList[i].name, projectsList[i]);
    }

    Model.setProjectsList(projectsListMap);
}

export default Controller;


//TODO