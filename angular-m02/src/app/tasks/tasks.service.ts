import { dummyTasks } from './dummy-tasks';
import { NewTaskData } from './task/task.model';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class TasksService {
  private tasks = dummyTasks;

  constructor() {
    // store data in the browser's local storage
    // if we have nothing in local storage, we keep the dummyTasks
    const tasks = localStorage.getItem('tasks');

    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  getUserTasks(userId: string) {
    return this.tasks.filter((task) => task.userId === userId);
  }

  addTask(taskData: NewTaskData, userId: string) {
    this.tasks.push({
      id: new Date().getTime().toString(),
      userId: userId,
      title: taskData.title,
      summary: taskData.summary,
      dueDate: taskData.date
    });
    this.saveTasksToLocalStorage();
  }

  removeTask(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveTasksToLocalStorage();
  }

  private saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
