import {Component, Input} from '@angular/core';
import { TaskComponent } from './task/task';
import { NewTaskComponent } from './new-task/new-task';
import { NewTaskData } from './task/task.model';
import {TasksService} from './tasks.service';

@Component({
  selector: 'app-tasks',
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class TasksComponent {
  // this will connect to app.html [parent component] where tasksComponent is used:
  @Input({required: true}) userId!: string;
  @Input({required: true}) name!: string;
  isAddingTask = false

  // Dependency Injection
  constructor(
    private tasksService: TasksService
  ) { }

  // computed property
  get selectedUserTasks() {
    return this.tasksService.getUserTasks(this.userId)
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCloseAddTask() {
    this.isAddingTask = false;
  }
}
