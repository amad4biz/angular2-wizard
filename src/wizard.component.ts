import { Component, OnInit, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';

@Component({
  selector: 'form-wizard',
  template:
  `<div class="card">
    <div class="card-header">
      <ul class="nav nav-justified">
        <li class="nav-item" *ngFor="let step of steps" [ngClass]="{'active': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled}">
          {{step.title}}
        </li>
      </ul>
    </div>
    <div class="card-block">
      <ng-content></ng-content>
      <div [hidden]="isCompleted">
          <button type="button" class="btn btn-secondary float-left" (click)="previous()" [hidden]="!hasPrevStep">Previous</button>
          <button type="button" class="btn btn-secondary float-right" (click)="next()" [disabled]="!activeStep.isValid" [hidden]="!hasNextStep">Next</button>
          <button type="button" class="btn btn-secondary float-right" (click)="complete()" [hidden]="hasNextStep">Done</button>
      </div>
    </div>
  </div>`
  ,
  styles: [
    '.card-header { background-color: #fff; font-size: 1.25rem;}',
    '.nav-item { padding: 1rem 0rem; border-bottom: 0.5rem solid #ccc; }',
    '.active { font-weight: bold; color: black; border-bottom - color: #1976D2 !important;}',
    '.enabled { border-bottom - color: rgb(88, 162, 234); }',
    '.disabled { color: #ccc; }'
  ]
})
export class WizardComponent implements OnInit, AfterContentInit {
  @ContentChildren(WizardStepComponent) wizardSteps: QueryList<WizardStepComponent>;
  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this._steps[0].isActive = true;
  }

  private get steps(): Array<WizardStepComponent> {
    return this._steps;
  }

  private get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): WizardStepComponent {
    return this._steps.find(step => step.isActive);
  }

  private get activeStepIndex(): number {
    return this._steps.indexOf(this.activeStep);
  }

  private get hasNextStep(): boolean {
    return this.activeStepIndex < this._steps.length - 1;
  }

  private get hasPrevStep(): boolean {
    return this.activeStepIndex > 0;
  }

  next() {
    if (this.hasNextStep) {
      let nextStep: WizardStepComponent = this._steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      this.activeStep.isActive = false;
      nextStep.isActive = true;
    }
  }

  previous() {
    if (this.hasPrevStep) {
      let prevStep: WizardStepComponent = this._steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      this.activeStep.isActive = false;
      prevStep.isActive = true;
    }
  }

  complete() {
    this._isCompleted = true;
    this.activeStep.onComplete.emit();
  }

}
