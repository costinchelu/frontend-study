import { Component, inject, Input } from '@angular/core';
import { Task } from './task.model'
import { CardComponent } from '../../shared/card/card';
import { DatePipe } from '@angular/common';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task',
  imports: [
    CardComponent,
    DatePipe
  ],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class TaskComponent {
  @Input({required: true}) task!: Task;

  private taskService = inject(TasksService);

  // send to parent component an event and some data (task id)
  onCompleteTask() {
    this.taskService.removeTask(this.task.id);
  }
}
