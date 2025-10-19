import { ViewManager, DateUtils } from './utils.js';
import { Storage } from './storage.js';

export const TodoLogic = {
    getRecurrenceLabel: function(key) {
        switch(key) {
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'biweekly': return 'Bi-Weekly';
            case 'monthly': return 'Monthly';
            case 'yearly': return 'Yearly';
            default: return 'No Repeat';
        }
    },

    renderTodoList: function() {
        this.updateRecurringTasks();
        const list = Storage.getTodoList().sort((a, b) => {
            if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
            if (a.dueDate) return -1;
            if (b.dueDate) return 1;
            return 0;
        });

        const todoListElement = document.getElementById('todoList');
        todoListElement.innerHTML = '';

        if (list.length === 0) {
            todoListElement.innerHTML = '<li style="justify-content: center; color: #888;">Your list is clear!</li>';
            return;
        }

        list.forEach((item, index) => {
            const li = document.createElement('li');
            const mainRow = document.createElement('div');
            mainRow.classList.add('todo-main-row');

            const textSpan = document.createElement('span');
            textSpan.textContent = item.task;
            textSpan.classList.add('todo-text');
            if (item.completed) {
                textSpan.classList.add('todo-completed');
            }
            textSpan.onclick = () => this.toggleTodoComplete(index);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Remove';
            deleteBtn.classList.add('secondary');
            deleteBtn.style.padding = '5px 10px';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteTodo(index);
            };
            
            mainRow.appendChild(textSpan);
            mainRow.appendChild(deleteBtn);
            li.appendChild(mainRow);
            
            if (item.dueDate || item.recurrence !== 'none') {
                const details = document.createElement('div');
                details.classList.add('todo-details');
                let detailText = '';
                if (item.dueDate) {
                    detailText += `Due: ${DateUtils.formatDateForDisplayShort(item.dueDate)}`;
                }
                if (item.recurrence && item.recurrence !== 'none') {
                    if (item.dueDate) detailText += ' | ';
                    detailText += `Repeats: ${this.getRecurrenceLabel(item.recurrence)}`;
                }
                details.textContent = detailText;
                li.appendChild(details);
            }
            todoListElement.appendChild(li);
        });
    },

    addTodo: function(task, dueDate, recurrence) {
        const list = Storage.getTodoList();
        list.push({ task, completed: false, dueDate: dueDate || '', recurrence: recurrence || 'none' });
        Storage.saveTodoList(list);
        this.renderTodoList();
    },

    toggleTodoComplete: function(index) {
        const list = Storage.getTodoList();
        if (list[index]) {
            list[index].completed = !list[index].completed;
            Storage.saveTodoList(list);
            this.renderTodoList();
        }
    },

    deleteTodo: function(index) {
        const list = Storage.getTodoList();
        list.splice(index, 1);
        Storage.saveTodoList(list);
        this.renderTodoList();
    },

    updateRecurringTasks: function() {
        let list = Storage.getTodoList();
        const todayStr = DateUtils.getFormattedDate(new Date());
        let updated = false;

        list.forEach((item) => {
            if (item.completed && item.recurrence !== 'none' && item.dueDate && item.dueDate < todayStr) {
                let nextDate = new Date(item.dueDate);
                
                while (DateUtils.getFormattedDate(nextDate) < todayStr) {
                    switch (item.recurrence) {
                        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
                        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
                        case 'biweekly': nextDate.setDate(nextDate.getDate() + 14); break;
                        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
                        case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
                    }
                }
                item.dueDate = DateUtils.getFormattedDate(nextDate);
                item.completed = false;
                updated = true;
            }
        });
        if (updated) Storage.saveTodoList(list);
    },

    bindEventListeners: function() {
        document.getElementById('todoHomeBtn').addEventListener('click', () => ViewManager.displayAppView('homeScreen'));
        document.getElementById('addTodoBtn').addEventListener('click', () => {
            const input = document.getElementById('todoInput');
            const dateInput = document.getElementById('todoDateInput');
            const recurrenceSelect = document.getElementById('todoRecurrenceSelect');
            if (input.value.trim()) {
                this.addTodo(input.value.trim(), dateInput.value, recurrenceSelect.value);
                input.value = '';
                dateInput.value = '';
                recurrenceSelect.value = 'none';
            } else {
                alert('Please enter a task description.');
            }
        });
    }
};


