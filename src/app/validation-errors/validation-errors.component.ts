import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-validation-errors',
  imports: [
    NgClass,
    CommonModule
  ],
  template: `
    <div *ngIf="control?.invalid && control?.touched">
      <small *ngIf="control?.errors?.['required']" [ngClass]="{'show': control?.invalid}">
        <i class="fas fa-exclamation-circle"></i> {{ fieldName }} is required.
      </small>
      <small *ngIf="control?.errors?.['minlength']" [ngClass]="{'show': control?.invalid}">
        <i class="fas fa-exclamation-circle"></i> {{ fieldName }} must be at least
        {{ control.errors?.['minlength'].requiredLength }} characters.
      </small>
      <small *ngIf="control?.errors?.['maxlength']" [ngClass]="{'show': control?.invalid}">
        <i class="fas fa-exclamation-circle"></i> {{ fieldName }} cannot exceed
        {{ control.errors?.['maxlength'].requiredLength }} characters.
      </small>
    </div>
  `,
  styles: `
    small {
      display: block;
      color: #ff0000;
      font-size: 12px;
      margin-top: 5px;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    small.show {
      opacity: 1;
      transform: translateY(0);
    }
  `
})
export class ValidationErrorsComponent {
  @Input() control: any;
  @Input() fieldName: string = '';
}
