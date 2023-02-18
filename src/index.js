import Model from "./model";
import { loadInitialPage } from "./dom";

Model.populateDefaultProjects();
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

export default Controller


//TODO
//Make it so when user adds a big project, it doesn't overflow the add task modal.