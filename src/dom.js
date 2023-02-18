import reset from "./styles/reset.css";
import css from "./styles/style.css";
import Logo from "./images/todo-logo.png";
import InboxLogo from "./images/todo-inbox.png";
import TodayLogo from "./images/todo-today.png";
import UpcomingLogo from "./images/todo-upcoming.png";
import ImportantLogo from "./images/todo-important.png";
import CompletedLogo from "./images/todo-completed.png";
import AddLogo from "./images/todo-add.svg";
import CloseIcon from "./images/todo-close.svg";
import TrashIcon from "./images/todo-trash.svg"
import TrashIconRed from "./images/todo-trash-red.svg";
import ProjectIcon from "./images/todo-project.svg";
import FavoriteIcon from "./images/todo-favorite.svg";
import FavoriteIconFilled from "./images/todo-favorite-filled.svg";
import HamburgerIcon from "./images/todo-hamburger.svg";
import Controller from "./index";
import Task from "./Task";
import Model from "./model";
import { format, parseISO } from 'date-fns';

let currentPage;
let isHamburgerClicked = false;

function loadInitialPage()
{
    const mediaQuery = window.matchMedia('(max-width: 600px)')
    mediaQuery.addEventListener("change", changeToSmallScreenStyles);

    const pageContainer = document.createElement("div");
    pageContainer.id = "pageContainer";
    document.querySelector("body").append(pageContainer);

    addNewTaskModal();

    const nav = document.createElement("nav");
    pageContainer.append(nav);

    const hamburger = new Image();
    hamburger.src = HamburgerIcon;
    hamburger.classList.add("hamburger-icon");
    hamburger.addEventListener("click", displayAside);
    nav.appendChild(hamburger);

    const navContainer = document.createElement("div");
    navContainer.id = "navContainer";
    nav.appendChild(navContainer);

    const pageLogo = new Image();
    pageLogo.src = Logo;
    navContainer.appendChild(pageLogo);

    const pageTitle = document.createElement("h1");
    pageTitle.id = "pageTitle";
    pageTitle.textContent = "TODO - A Simple Todo App";
    navContainer.appendChild(pageTitle);

    const aside = document.createElement("aside");
    pageContainer.appendChild(aside);

    const asideTop = document.createElement("div");
    asideTop.id = "asideTop";
    aside.appendChild(asideTop);

    fillAsideTop(InboxLogo, "Inbox");
    fillAsideTop(TodayLogo, "Today");
    fillAsideTop(UpcomingLogo, "Upcoming");
    fillAsideTop(ImportantLogo, "Important");
    fillAsideTop(CompletedLogo, "Completed");
    currentPage = "Inbox";

    const asideBottom = document.createElement("div");
    asideBottom.id = "asideBottom";
    aside.appendChild(asideBottom);

    const asideProjectsHeader = document.createElement("div");
    asideProjectsHeader.id = "asideProjectsHeader";
    asideBottom.appendChild(asideProjectsHeader);

    const projectsTitle = document.createElement("p");
    projectsTitle.textContent = "Projects";
    asideProjectsHeader.appendChild(projectsTitle);

    const projectsAdd = new Image();
    projectsAdd.src = AddLogo;
    projectsAdd.id = "projectAdd";
    projectsAdd.addEventListener('click', () => document.querySelector("#newProjectModal").showModal());
    asideProjectsHeader.appendChild(projectsAdd);

    createProjectTab("Default");

    const main = document.createElement("main");
    pageContainer.appendChild(main);

    const mainTitle = document.createElement("h2");
    mainTitle.id = "mainTitle";
    mainTitle.textContent = "Inbox";
    main.appendChild(mainTitle);

    const todoContainer = document.createElement("div");
    todoContainer.id = "todoContainer";
    main.appendChild(todoContainer);

    populateInbox();
    appendNewTaskButton();
    addProjectModalListeners();

    const footer = document.createElement("footer");
    pageContainer.appendChild(footer);

    const footerLinks = document.createElement("p");
    footerLinks.id = "footerLinks";
    footerLinks.innerHTML = "Built by <a href = \"https://github.com/Colland\">Colland</a> | <a href = \"https://github.com/Colland/todo-list\">Source code</a>";
    footer.appendChild(footerLinks);

    changeToSmallScreenStyles(mediaQuery);
}

function fillAsideTop(logoSrc, asideText)
{
    const asideTop = document.querySelector("#asideTop");

    const asideTopButton = document.createElement("div");
    asideTopButton.classList.add("asideButton");
    asideTopButton.addEventListener("click", buttonSelected)
    asideTopButton.dataset.name = asideText;
    asideTop.appendChild(asideTopButton);

    const asideTopLogo = new Image();
    asideTopLogo.src = logoSrc;
    asideTopLogo.classList.add("asideLogo");
    asideTopButton.appendChild(asideTopLogo);

    const asideTopText = document.createElement("p");
    asideTopText.textContent = asideText;
    asideTopButton.appendChild(asideTopText);

    if(asideText == "Inbox")
    {
        asideTopButton.classList.add("asideButtonSelected");
    }
}

function createProjectTab(projectName)
{
    const asideBottom = document.querySelector("#asideBottom");

    const asideProjectButton = document.createElement("div");
    asideProjectButton.classList.add("asideButton");
    asideProjectButton.id = "projectButton";
    asideProjectButton.dataset.name = projectName;
    asideProjectButton.addEventListener("click", buttonSelected);
    asideBottom.appendChild(asideProjectButton);

    const projectIcon = new Image();
    projectIcon.src = ProjectIcon;
    projectIcon.classList.add("asideLogo");
    asideProjectButton.appendChild(projectIcon);

    const asideProjectText = document.createElement("p");
    asideProjectText.textContent = projectName;
    asideProjectText.classList.add("aside-project-text");
    asideProjectButton.appendChild(asideProjectText);

    const trashIcon = new Image();
    trashIcon.src = TrashIconRed;
    trashIcon.id = "trashIcon";
    trashIcon.addEventListener("click", deleteProject);
    asideProjectButton.appendChild(trashIcon);

    updateNewTaskModalProjects();
}

function populateInbox()
{
    let inboxTasks = Model.getInboxTasks();
    document.querySelector("#todoContainer").replaceChildren();

    for(let i = 0; i < inboxTasks.length; i++)
    {
        createAndAppendTask(inboxTasks[i]);
    }
}

function populateToday()
{
    let todayTasks = Model.getTodayTasks();
    document.querySelector("#todoContainer").replaceChildren();

    for(let i = 0; i < todayTasks.length; i++)
    {
        createAndAppendTask(todayTasks[i]);
    }
}

function populateUpcoming()
{
    let upcomingTasks = Model.getUpcomingTasks();
    document.querySelector("#todoContainer").replaceChildren();

    for(let i = 0; i < upcomingTasks.length; i++)
    {
        createAndAppendTask(upcomingTasks[i]);
    }
}

function populateFavorite()
{
    let favoriteTasks = Model.getFavoriteTasks();
    document.querySelector("#todoContainer").replaceChildren();

    for(let i = 0; i < favoriteTasks.length; i++)
    {
        createAndAppendTask(favoriteTasks[i]);
    }
}

function populateCompleted()
{
    let completedTasks = Model.getCompletedTasks();
    document.querySelector("#todoContainer").replaceChildren();

    for(let i = 0; i < completedTasks.length; i++)
    {
        createAndAppendTask(completedTasks[i]);
    }
}

function populateProject(projectName)
{
    let projectTasks = Model.getProjectTaskList(projectName);

    for(let i = 0; i < projectTasks.length; i++)
    {
        createAndAppendTask(projectTasks[i]);
    }
}

function createAndAppendTask(task)
{
    const todoContainer = document.querySelector("#todoContainer");

    let taskDom = document.createElement("div");
    taskDom.classList.add("task");
    taskDom.dataset.taskID = task.id;
    taskDom.dataset.taskProject = task.project;
    todoContainer.appendChild(taskDom);

    let taskDiv1 = document.createElement("div");
    taskDiv1.classList.add("taskDiv1");
    taskDom.appendChild(taskDiv1);

    let taskCheck = document.createElement("span");
    taskCheck.classList.add("material-symbols-outlined", "taskCheckBox");
    if(task.completed == false)
    {
        taskCheck.textContent = "circle";
    }
    else
    {
        taskCheck.textContent = "check_circle";
    }

    let checkBoxPriorityClass;

    switch(task.priority)
    {
        case "high":
            checkBoxPriorityClass = "high-priority-check";
            break;

        case "medium":
            checkBoxPriorityClass = "mid-priority-check";
            break;
        
        case "low":
            checkBoxPriorityClass = "low-priority-check";
            break;

        default:
            checkBoxPriorityClass = "low-priority-check";
    }
    taskCheck.classList.add(checkBoxPriorityClass);
    taskDiv1.addEventListener('click', checkOrUncheckTask);
    taskDiv1.appendChild(taskCheck);

    let taskTitle = document.createElement("h4");
    taskTitle.classList.add("taskTitle");
    if(task.completed == true)
    {
        taskTitle.classList.add("taskFinished");
    }

    taskTitle.textContent = task.title;
    taskDiv1.appendChild(taskTitle);

    let taskRightSideDiv = document.createElement("div");
    taskRightSideDiv.id = "task-right-side-div";
    taskDom.appendChild(taskRightSideDiv);

    let taskProjectTag = document.createElement("p");
    taskProjectTag.textContent = task.project;
    taskProjectTag.classList.add("task-project-tag");
    taskRightSideDiv.appendChild(taskProjectTag);

    let taskDate = document.createElement("p");
    taskDate.textContent = format(parseISO(task.dueDate), "dd-MM-yyyy");
    taskDate.classList.add("taskDate");
    taskRightSideDiv.appendChild(taskDate);

    let taskFavorite = new Image();
    if(task.favorited == true)
    {
        taskFavorite.src = FavoriteIconFilled;
    }
    else
    {
        taskFavorite.src = FavoriteIcon;
    }
    taskFavorite.classList.add("task-favorite");
    taskFavorite.addEventListener("click", updateFavorite);
    taskRightSideDiv.appendChild(taskFavorite);

    let taskTrash = new Image();
    taskTrash.src = TrashIcon;
    taskTrash.classList.add("task-trash")
    taskTrash.addEventListener("click", deleteTask);
    taskRightSideDiv.appendChild(taskTrash);
}

function appendNewTaskButton()
{
    const newTask = document.createElement("div");
    newTask.id = "newTask";
    document.querySelector("#todoContainer").appendChild(newTask);

    const newTaskIcon = new Image();
    newTaskIcon.src = AddLogo;
    newTaskIcon.id = "newTaskIcon";
    newTask.append(newTaskIcon);

    const newTaskText = document.createElement("p");
    newTaskText.textContent = "Add new task";
    newTask.append(newTaskText);

    if(currentPage == "Inbox" || currentPage == "Today" || currentPage == "Upcoming" || currentPage == "Important" || currentPage == "Completed")
    {
        newTask.addEventListener("click", () => document.querySelector("#newTaskModal").showModal());
    }
    else
    {
        newTask.addEventListener("click", showModifiedNewTaskModal);
    }
}

function buttonSelected(e)
{
    const button = document.querySelector(".asideButtonSelected");

    if(button !== null)
    {
        button.classList.remove("asideButtonSelected");
    }

    this.classList.add("asideButtonSelected");
    currentPage = this.dataset.name;
    buildMainPage(this.dataset.name);
}

function buildMainPage(pageName)
{
    const main = document.querySelector("main");
    main.replaceChildren();

    const mainTitle = document.createElement("h2")
    mainTitle.id = "mainTitle";
    mainTitle.textContent = pageName;
    main.appendChild(mainTitle)

    const todoContainer = document.createElement("div");
    todoContainer.id = "todoContainer";
    main.appendChild(todoContainer);
    
    switch(pageName)
    {
        case "Inbox": 
            populateInbox();
            appendNewTaskButton();
            break;

        case "Today":
            populateToday();
            appendNewTaskButton();
            break;

        case "Upcoming":
            populateUpcoming();
            appendNewTaskButton();
            break;

        case "Important":
            populateFavorite();
            appendNewTaskButton();
            break;

        case "Completed":
            populateCompleted();
            appendNewTaskButton();
            break;

        default:
            populateProject(pageName);
            appendNewTaskButton();
            break;
    }
}

//Updates the page when a new task is added.
//Checks what project the new task belongs to and only re-renders the current page
//if the tasks project corresponds to the project the page is currently displaying.
//If the page is on a non-project tab, then it always re-renders.
function updateTasksView(projectName)
{
    if(currentPage == "Inbox")
    {
        populateInbox();
        appendNewTaskButton();
    }
    else if(currentPage == "Today")
    {
        populateToday();
        appendNewTaskButton();
    }
    else if(currentPage == "Upcoming")
    {
        populateUpcoming();
        appendNewTaskButton();
    }
    else if(currentPage == "Important")
    {
        populateFavorite();
        appendNewTaskButton();
    }
    else if(currentPage == "Completed")
    {
        populateCompleted();
        appendNewTaskButton();
    }
    else if(projectName == currentPage)
    {
        const taskContainer = document.querySelector("#todoContainer");
        taskContainer.replaceChildren();

        let projectTaskList = Model.getProject(projectName).taskList;
        
        for(let i = 0; i < projectTaskList.length; i++)
        {
            createAndAppendTask(projectTaskList[i]);
        }

        appendNewTaskButton();
    }
}

function checkOrUncheckTask()
{
    let currentTask = this.parentElement;
    let taskModel = Model.getTask(currentTask.dataset.taskID, currentTask.dataset.taskProject);
    let taskTitle = this.lastChild;
    let taskCheck = this.firstChild;

    if(taskModel.completed == true)
    {
        taskTitle.classList.remove("taskFinished");
        taskCheck.textContent = "circle";
        Model.checkOrUncheckTask(currentTask.dataset.taskID, currentTask.dataset.taskProject)
    }
    else
    {
        taskTitle.classList.add("taskFinished");
        taskCheck.textContent = "check_circle";
        Model.checkOrUncheckTask(currentTask.dataset.taskID, currentTask.dataset.taskProject)
    }
}

function addNewTaskModal()
{
    const pageContainer = document.querySelector("#pageContainer");

    const newTaskModal = document.createElement("dialog");
    newTaskModal.id = "newTaskModal";
    newTaskModal.addEventListener("close", () => document.querySelector("#taskProjectLabel").classList.remove("new-task-project-error-check"));
    pageContainer.appendChild(newTaskModal);

    const newTaskModalContainer = document.createElement("div");
    newTaskModalContainer.id = "newTaskModalContainer";
    newTaskModal.appendChild(newTaskModalContainer);

    const newTaskHeader = document.createElement("div");
    newTaskHeader.classList.add("modalHeader");
    newTaskModalContainer.appendChild(newTaskHeader)

    const headerText = document.createElement("h3");
    headerText.textContent = "New task";
    headerText.classList.add("modalTitle")
    newTaskHeader.appendChild(headerText);

    const closeButton = new Image();
    closeButton.src = CloseIcon;
    closeButton.id = "closeButton";
    closeButton.alt = "Close";
    newTaskHeader.appendChild(closeButton);

    //Must initialize form before using it in the listener function
    const newTaskForm = document.createElement("form");
    closeButton.addEventListener('click', () => {newTaskForm.reset();
                                                 newTaskModal.close();});

    newTaskForm.method = "post";
    newTaskForm.id = "newTaskForm";
    newTaskForm.addEventListener('submit', newTaskSubmitted);
    newTaskModalContainer.appendChild(newTaskForm);

    const taskTitleContainer = document.createElement("div");
    taskTitleContainer.classList.add("modalFormSection");
    newTaskForm.appendChild(taskTitleContainer);

    const taskTitleLabel = document.createElement("label");
    taskTitleLabel.htmlFor = "task-title-input";
    taskTitleLabel.textContent = "Task title";
    taskTitleContainer.appendChild(taskTitleLabel);

    const taskTitleInput = document.createElement("input");
    taskTitleInput.classList.add("newTaskFormInput");
    taskTitleInput.name = "task-title";
    taskTitleInput.id = "task-title-input";
    taskTitleInput.placeholder = "E.g: Walk dog";
    taskTitleInput.required = "true";
    taskTitleInput.maxLength = 70;
    taskTitleContainer.appendChild(taskTitleInput);

    const taskPriorityContainer = document.createElement("div");
    taskPriorityContainer.classList.add("modalFormSection");
    newTaskForm.appendChild(taskPriorityContainer);

    const taskPriorityLabel = document.createElement("label");
    taskPriorityLabel.htmlFor = "taskPriorityInput";
    taskPriorityLabel.textContent = "Task priority";
    taskPriorityContainer.appendChild(taskPriorityLabel);

    const taskPriorityInput = document.createElement("select");
    taskPriorityInput.classList.add("newTaskFormInput");
    taskPriorityInput.name = "task-priority";
    taskPriorityInput.id = "taskPriorityInput";
    taskPriorityContainer.appendChild(taskPriorityInput);

    const priorityInputOption1 = document.createElement("option");
    priorityInputOption1.value = "low";
    priorityInputOption1.textContent = "Low";
    taskPriorityInput.appendChild(priorityInputOption1);

    const priorityInputOption2 = document.createElement("option");
    priorityInputOption2.value = "medium";
    priorityInputOption2.textContent = "Medium";
    taskPriorityInput.appendChild(priorityInputOption2);

    const priorityInputOption3 = document.createElement("option");
    priorityInputOption3.value = "high";
    priorityInputOption3.textContent = "High";
    taskPriorityInput.appendChild(priorityInputOption3);

    const taskDateContainer = document.createElement("div");
    taskDateContainer.classList.add("modalFormSection");
    newTaskForm.appendChild(taskDateContainer);

    const taskDateLabel = document.createElement("label");
    taskDateLabel.htmlFor = "taskDateInput";
    taskDateLabel.textContent = "Deadline";
    taskDateContainer.appendChild(taskDateLabel);

    const taskDateInput = document.createElement("input");
    taskDateInput.type = "date";
    taskDateInput.name = "task-date";
    taskDateInput.id = "taskDateInput";
    taskDateInput.required = "true";
    taskDateInput.classList.add("newTaskFormInput")
    taskDateContainer.appendChild(taskDateInput);

    const taskProjectContainer = document.createElement("div");
    taskProjectContainer.id = "taskProjectContainer";
    taskProjectContainer.classList.add("modalFormSection");
    newTaskForm.appendChild(taskProjectContainer);

    const taskProjectLabel = document.createElement("label");
    taskProjectLabel.textContent = "Project";
    taskProjectLabel.id = "taskProjectLabel";
    taskProjectLabel.htmlFor = "taskProjectInput";
    taskProjectContainer.appendChild(taskProjectLabel);

    const taskProjectInput = document.createElement("select");
    taskProjectInput.name = "task-project";
    taskProjectInput.id = "taskProjectInput";
    taskProjectInput.classList.add("newTaskFormInput");
    taskProjectContainer.appendChild(taskProjectInput);
    
    const submitFormContainer = document.createElement("div");
    submitFormContainer.classList.add("modalFormSection");
    submitFormContainer.id = "newTaskSubmitContainer";
    newTaskForm.appendChild(submitFormContainer);

    const newTaskSubmit = document.createElement("input");
    newTaskSubmit.type = "submit";
    newTaskSubmit.textContent = "Submit";
    newTaskSubmit.classList.add("modalSubmit");
    submitFormContainer.appendChild(newTaskSubmit);
}

function updateNewTaskModalProjects()
{
    let taskProjectInput = document.querySelector("#taskProjectInput");
    taskProjectInput.replaceChildren();

    let projectsList = Model.getProjectsList();

    for(let i = 0 ; i < projectsList.length; i++)
    {
        let option = document.createElement("option");
        option.value = projectsList[i].name;
        option.textContent = projectsList[i].name;
        taskProjectInput.appendChild(option);
    }
}

function addProjectModalListeners()
{
    let projectModal = document.querySelector("#newProjectModal")
    let projectModalForm = document.querySelector("#newProjectForm")
    let projectModalClose = document.querySelector("#projectModalClose");
    projectModalClose.addEventListener('click', () => {projectModal.close();
                                                       projectModalForm.reset()});
    
    projectModalForm.addEventListener('submit', newProjectSubmitted)
}

function showModifiedNewTaskModal()
{
    let taskModal = document.querySelector("#newTaskModal");
    taskModal.id = "newTaskModalNoProject";
    document.querySelector("#newTaskForm").id = "newTaskFormNoProject";

    document.querySelector("#taskProjectContainer").remove();
    taskModal.showModal();
}

function newTaskSubmitted(e)
{
    e.preventDefault();

    let inputField = document.querySelectorAll(".newTaskFormInput");

    let name = inputField[0].value;
    let priority = inputField[1].value;
    let date = inputField[2].value;
    let project = inputField[3].value;

    if(project == "")
    {
        document.querySelector("#taskProjectLabel").classList.add("new-task-project-error-check");
    }
    else
    {
        if(currentPage == "Inbox" || currentPage == "Today" || currentPage == "Upcoming" || currentPage == "Important" || currentPage == "Completed")
        {
            let newTask = new Task(name, priority, date, project);
            Controller.addNewTask(newTask);

            document.querySelector("#newTaskForm").reset();
            document.querySelector("#newTaskModal").close();
        }
        else
        {
            let newTask = new Task(name, priority, date, currentPage);
            Controller.addNewTask(newTask);

            let newTaskForm = document.querySelector("#newTaskFormNoProject")
            let newTaskModal = document.querySelector("#newTaskModalNoProject")
            newTaskForm.reset();
            newTaskModal.close();

            newTaskForm.id = "newTaskForm";
            newTaskModal.id = "newTaskModal";

            document.querySelector("#newTaskSubmitContainer").remove();

            const taskProjectContainer = document.createElement("div");
            taskProjectContainer.id = "taskProjectContainer";
            taskProjectContainer.classList.add("modalFormSection");
            newTaskForm.appendChild(taskProjectContainer);

            const taskProjectLabel = document.createElement("label");
            taskProjectLabel.textContent = "Project";
            taskProjectLabel.htmlFor = "taskProjectInput";
            taskProjectContainer.appendChild(taskProjectLabel);

            const taskProjectInput = document.createElement("select");
            taskProjectInput.name = "task-project";
            taskProjectInput.id = "taskProjectInput";
            taskProjectInput.classList.add("newTaskFormInput");
            taskProjectContainer.appendChild(taskProjectInput);

            const submitFormContainer = document.createElement("div");
            submitFormContainer.classList.add("modalFormSection");
            submitFormContainer.id = "newTaskSubmitContainer";
            newTaskForm.appendChild(submitFormContainer);

            const newTaskSubmit = document.createElement("button");
            newTaskSubmit.type = "submit";
            newTaskSubmit.textContent = "Submit";
            newTaskSubmit.classList.add("modalSubmit");
            submitFormContainer.appendChild(newTaskSubmit);

            updateNewTaskModalProjects();
        }
    }
}

function deleteTask()
{
    let taskID = this.parentElement.parentElement.dataset.taskID
    let projectID = this.parentElement.parentElement.dataset.taskProject;

    Model.removeTask(taskID, projectID);
}

function newProjectSubmitted(e)
{
    e.preventDefault();

    let projectName = document.querySelector("#projectModalNameInput");
    Model.addNewProject(projectName.value);

    document.querySelector("#newProjectForm").reset();
    document.querySelector("#newProjectModal").close();
}

function deleteProject(e)
{
    e.stopPropagation();
    let projectName = this.parentElement.dataset.name;
    this.parentElement.remove();

    if(currentPage == projectName)
    {
        buildMainPage("Inbox");
        currentPage = "Inbox";
        document.querySelector("[data-name = \"Inbox\"]").classList.add("asideButtonSelected");
    }

    Model.removeProject(projectName);
}

function updateFavorite()
{
    let taskID = this.parentElement.parentElement.dataset.taskID;
    let project = this.parentElement.parentElement.dataset.taskProject;
    let task = Model.getTask(taskID, project)

    if(task.favorited == true)
    {
        this.src = FavoriteIcon;
    }
    else
    {
        this.src = FavoriteIconFilled;
    } 

    Model.toggleFavoriteTask(taskID, project);

    if(currentPage == "Important")
    {
        buildMainPage("Important");
    }
}

function changeToSmallScreenStyles(e)
{
    if(e.matches)
    {
        let hamburger = document.querySelector(".hamburger-icon");
        hamburger.classList.add("hamburger-icon-visible");
    }
}

function displayAside()
{
    const aside = document.querySelector("aside");
    const main = document.querySelector("main");

    if(isHamburgerClicked)
    {
        aside.classList.remove("small-screen-aside-visible");
        main.classList.remove("small-screen-main-aside-visible");
        isHamburgerClicked = false;
    }
    else
    {
        aside.classList.add("small-screen-aside-visible");
        main.classList.add("small-screen-main-aside-visible");
        isHamburgerClicked = true;
    }
}

export {updateTasksView, loadInitialPage, createProjectTab, buildMainPage, updateNewTaskModalProjects};