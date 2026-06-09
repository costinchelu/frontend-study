import {Component, EventEmitter, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";
import type {InvestmentInput} from "../investment.model";

@Component({
  selector: 'app-user-input',
  templateUrl: 'user-input.component.html',
  styleUrl: 'user-input.component.css',
  imports: [FormsModule],
  standalone: true,
})
export class UserInputComponent {

  @Output() calculate = new EventEmitter<InvestmentInput>();

  twoWayInitialInvestment = '0';
  twoWayAnnualInvestment = '0';
  twoWayExpectedReturn = '0';
  twoWayDuration = '0';

  onSubmit() {
    this.calculate.emit({
      initialInvestment: +this.twoWayInitialInvestment,
      annualInvestment: +this.twoWayAnnualInvestment,
      expectedReturn: +this.twoWayExpectedReturn,
      duration: +this.twoWayDuration,
    });
  }
}
