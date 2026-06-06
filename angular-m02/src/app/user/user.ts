import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from './user.model'
import { CardComponent } from '../shared/card/card';

// we can add variables here outside the class
// const randomIndex = Math.floor(Math.random() * DUMMY_USERS.length);

@Component({
  selector: 'app-user',
  templateUrl: './user.html',
  styleUrl: './user.css',
  imports: [CardComponent]
})
export class UserComponent {

  /* all the properties we are defining here are public by default, so we can use them in the template (html file)
  if any property is marked as private (with the private keyword), then we cannot use it in the template,
  and it will only be accessible within the class (ts file)
  properties are set without const keyword    */

  /*  properties decorated with Input() are used to receive data from a parent component (the component that uses this component in its template)
  as this value will be set by another component, TypeScript can't see it, so we need to mark it with !
  required property means that Angular must set this value  */
  @Input({ required: true }) user!: User;

  // value set in app.html [parent]
  @Input({required: true}) selected!: boolean;

  // output decorator will allow us to emit events from this component to the parent component
  @Output() select = new EventEmitter<string>();

  // adding getter (for simplify HTML code)
  get imageUrl() {
    return 'assets/users/' + this.user.avatar;
  }

  /* on click, we can change the state of a component
     (in this case, changing the value of a property, and it will reflect in the HTML dynamically)
     when we click the button (see .html file, then we emit the user's id to the app component (parent)) */
  onSelectUser() {
    this.select.emit(this.user.id);
  }
}
