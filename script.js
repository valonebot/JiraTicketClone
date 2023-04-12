const addBtn = document.querySelector('.add-btn');
const modalBox = document.querySelector('.modal-cont');
const mainContainer = document.querySelector('.main-cont');
let flag = false;
addBtn.addEventListener('click', (e) => {
    flag = !flag;
    if (flag) {
        modalBox.style.display = 'flex';
    } else {
        modalBox.style.display = 'none';
    }
});
modalBox.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        createTicket();
        modalBox.style.display = 'none';
        modalBox.querySelector('textarea').value = '';
        flag = false;
    }
});
function createTicket() {
    const div = document.createElement('div');
    div.setAttribute('class', 'ticket-cont');
    div.innerHTML = `
        <div class="ticket-cont">
        <div class="ticket-color"></div>
        <div class="ticket-id">#sample_id123</div>
        <div class="task-area">${modalBox.querySelector('textarea').value}</div>
        </div>
    `;
    mainContainer.append(div);
}
