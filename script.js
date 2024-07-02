const addBtn = document.querySelector('.add-btn');
const removeBtn = document.querySelector('.remove-btn');
const modalBox = document.querySelector('.modal-cont');
const mainContainer = document.querySelector('.main-cont');
let addFlag = false;
let removeFlag = false;
const allPriorityColors = document.querySelectorAll('.priority-color');
const colors = ['lightpink', 'lightblue', 'lightgreen', 'black'];
let modalPriorityColor = colors[colors.length - 1];
const textAreaCont = document.querySelector('.text-area-cont');
const dueDate = document.querySelector('.due-date-input');
const toolBoxColors = document.querySelectorAll('.color');
let arrOfTickets = [];

if (localStorage.getItem('jiraTicket')) {
    //*  Get data from local storage
    const arrOfTickets = JSON.parse(localStorage.getItem('jiraTicket'));
    arrOfTickets.forEach((currentObj) => {
        createTicket(
            currentObj.modalPriorityColor,
            currentObj.ticketTask,
            currentObj.taskId,
            currentObj.dueDate
        );
    });
}
//* Listener for toolBox filtering tickets on the their colors :
toolBoxColors.forEach((currentColor) => {
    currentColor.addEventListener('click', () => {
        const allTicketContainers = Array.from(mainContainer.children);
        allTicketContainers.forEach((currentContainer) => {
            if (
                currentContainer.children[0].classList[1] ===
                currentColor.classList[0]
            ) {
                currentContainer.style.display = 'block';
            } else {
                currentContainer.style.display = 'none';
            }
        });
    });
});

//* Listener for toolBox displaying all the tickets :
toolBoxColors.forEach((currentColor) => {
    currentColor.addEventListener('dblclick', () => {
        const allTicketContainers = Array.from(mainContainer.children);
        allTicketContainers.forEach((currentContainer) => {
            currentContainer.style.display = 'block';
        });
    });
});

//* Listener for modal priority coloring :
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener('click', (e) => {
        allPriorityColors.forEach((colorElem, idx) => {
            colorElem.classList.remove('border');
        });
        colorElem.classList.add('border');
        modalPriorityColor = colorElem.classList[0];
    });
});
addBtn.addEventListener('click', (e) => {
    // * Display Modal
    addFlag = !addFlag; //* we toggle the add button. when we clicked on addBtn modal is generated and again when we clicked on addBtn modal is removed.
    if (addFlag) {
        modalBox.style.display = 'flex';
    } else {
        modalBox.style.display = 'none';
    }
});
//* Toggle the remoce btn
removeBtn.addEventListener('click', () => {
    removeFlag = !removeFlag;
});

//* when shift key is press on modal Box then following logic happens
modalBox.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        createTicket(
            modalPriorityColor,
            textAreaCont.value,
            shortid(),
            dueDate.value
        );
        setModalToDefault();
        addFlag = false;
    }
});
//* createTicket() is for generate a ticket.
function createTicket(modalPriorityColor, ticketTask, taskId, dueDate) {
    const div = document.createElement('div');
    div.setAttribute('class', 'ticket-cont');
    div.innerHTML = `
        <div class="ticket-color  ${modalPriorityColor}"></div>
        <div class="ticket-id-date-cont">
            <div class="ticket-id">${taskId}</div>
            <div class="due-date"> ${
                dueDate ? `${dueDate}<sub>due</sub>` : ''
            }</div>
        </div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
 `;
    mainContainer.append(div);
    handleRemove(div);
    handleLock(div);
    handleColorPriority(div);
    arrOfTickets.push({ modalPriorityColor, ticketTask, taskId, dueDate });
    localStorage.setItem('jiraTicket', JSON.stringify(arrOfTickets));
}
function handleRemove(ticketCont) {
    ticketCont.addEventListener('click', () => {
        if (removeFlag) {
            //* updation of arrOfTickets and localStorage :
            let IndexOfArr = getIndex(
                ticketCont.children[1].children[0].innerText
            );
            arrOfTickets.splice(IndexOfArr, 1);
            localStorage.setItem('jiraTicket', JSON.stringify(arrOfTickets));
            //* UI updation
            ticketCont.remove();
        }
    });
}
function handleLock(ticketCont) {
    const iEle = ticketCont.querySelector('i');
    const textArea = ticketCont.querySelector('.task-area');
    iEle.addEventListener('click', () => {
        if (iEle.classList.contains('fa-lock')) {
            iEle.classList.remove('fa-lock');
            iEle.classList.add('fa-lock-open');
            textArea.setAttribute('contenteditable', 'true');
        } else {
            iEle.classList.remove('fa-lock-open');
            iEle.classList.add('fa-lock');
            textArea.setAttribute('contenteditable', 'false');
            //* updation of arrOfTickets and localStorage :
            let IndexOfArr = getIndex(
                textArea?.previousElementSibling?.children[0].innerText
            );
            arrOfTickets[IndexOfArr].ticketTask = textArea?.innerText;
            localStorage.setItem('jiraTicket', JSON.stringify(arrOfTickets));
        }
    });
}
function handleColorPriority(ticketCont) {
    const ticketColorEle = ticketCont.children[0];
    ticketColorEle.addEventListener('click', () => {
        const currentColor = ticketColorEle.classList[1];
        ticketColorEle.classList.remove(currentColor);
        const colorGenerated = randomColor(currentColor);
        ticketColorEle.classList.add(colorGenerated);
        //* updation of arrOfTickets and localStorage :
        let IndexOfArr = getIndex(
            ticketColorEle.nextElementSibling.children[0].innerText
        );
        arrOfTickets[IndexOfArr].modalPriorityColor = colorGenerated
            ? colorGenerated
            : colors[colors.length - 1];
        localStorage.setItem('jiraTicket', JSON.stringify(arrOfTickets));
    });
}
function getIndex(taskId) {
    const IndexOfArr = arrOfTickets.findIndex((currentObj) => {
        return currentObj.taskId === taskId;
    });
    return IndexOfArr;
}
function randomColor(currentColor) {
    let j = Math.floor(Math.random() * 4);
    for (let i = 0; i < colors.length; i++) {
        if (currentColor !== colors[j]) {
            return colors[j];
        } else {
            j = Math.floor(Math.random() * 4);
            i--;
        }
    }
}
function setModalToDefault() {
    modalBox.style.display = 'none';
    modalBox.querySelector('textarea').value = '';
    modalBox.querySelector('.due-date-input').value = '';
    allPriorityColors.forEach((colorElem, idx) => {
        colorElem.classList.remove('border');
    });
    allPriorityColors[3].classList.add('border');
}
