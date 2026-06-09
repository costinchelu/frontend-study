import {Component, inject, signal} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {InvestmentService} from "../investment.service";

@Component({
  selector: 'app-user-input',
  templateUrl: 'user-input.component.html',
  styleUrl: 'user-input.component.css',
  imports: [FormsModule],
  standalone: true,
})
export class UserInputComponent {

  private investmentService = inject(InvestmentService);

  twoWayInitialInvestment = signal('0');
  twoWayAnnualInvestment = signal('0');
  twoWayExpectedReturn = signal('0');
  twoWayDuration = signal('10');

  onSubmit() {
    this.investmentService.calculateInvestmentResults({
      initialInvestment: +this.twoWayInitialInvestment(),
      annualInvestment: +this.twoWayAnnualInvestment(),
      expectedReturn: +this.twoWayExpectedReturn(),
      duration: +this.twoWayDuration(),
    });
    this.twoWayInitialInvestment.set('0');
    this.twoWayAnnualInvestment.set('0');
    this.twoWayExpectedReturn.set('0');
    this.twoWayDuration.set('10');
  }
}
