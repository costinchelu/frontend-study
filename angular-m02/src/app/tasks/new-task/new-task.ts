import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewTaskData } from '../task/task.model';
import {TasksService} from '../tasks.service';

@Component({
  selector: 'app-new-task',
  imports: [FormsModule],
  templateUrl: './new-task.html',
  styleUrl: './new-task.css',
})
export class NewTaskComponent {
  @Input({required: true}) userId!: string;
  @Output() close = new EventEmitter<void>();

  // injecting the service here will render the event emitter not useful
  // @Output() add = new EventEmitter<NewTaskData>();
  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';

  // another way for DI (beside constructor-based approach)
  private tasksService = inject(TasksService);

  onCancel() {
    this.close.emit();
  }

  onFormSubmit() {
    // tasksComponent will have access to the same service singleton
    this.tasksService.addTask({
      title: this.enteredTitle,
      summary: this.enteredSummary,
      date: this.enteredDate
    },
      this.userId);

    // after submitting the data to the service, we need to close the modal
    this.close.emit();
  }
}

/*
FormsModule offers ngModel directive for two-way communication and also handles HTML forms element submission (ngSubmit)
 */
