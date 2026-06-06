import { Component } from '@angular/core';
import { HeaderComponent } from './header/header';
import { UserComponent } from './user/user';
import { TasksComponent } from './tasks/tasks';
import { DUMMY_USERS } from './dummy-users';


/*
Angular is not automatically scanning for components, that is why we need to import them manually.

Although is tempting to add all the component imports to main.ts, this is not the right way to do it.
Angular has a hierarchical module system that allows for better organization and encapsulation of components and their dependencies.
So we import other components (like app-header) in their respective modules (in this case app.module.ts), and then we import the module in main.ts.
This way we can keep our code organized and maintainable.

Also, besides the import, we need to declare the component in the "imports" property of the @Component decorator.
 */

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, UserComponent, TasksComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {

  users = DUMMY_USERS;
  selectedUserId?: string;

  get selectedUser() {
    return this.users.find((user) => user.id === this.selectedUserId)!;
  }

  onSelectUser(id: string) {
    this.selectedUserId = id;
  }
}
