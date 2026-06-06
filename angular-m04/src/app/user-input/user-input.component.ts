import {Component} from "@angular/core";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-user-input',
  templateUrl: 'user-input.component.html',
  styleUrl: 'user-input.component.css',
  imports: [FormsModule],
  standalone: true,
})
export class UserInputComponent {

  twoWayInitialInvestment = '0';
  twoWayAnnualInvestment = '0';
  twoWayExpectedReturn = '0';
  twoWayDuration = '0';

  onSubmit() {

  }
}
