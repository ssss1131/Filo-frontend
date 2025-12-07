import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgClass} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-validation-errors',
  imports: [
    NgClass,
    CommonModule,
    TranslateModule
  ],
  template: `
    <div *ngIf="control?.invalid && control?.touched">
      <small *ngIf="control?.errors?.['required']" [ngClass]="{'show': control?.invalid}">
        <i class="fas fa-exclamation-circle"></i> {{ 'VALIDATION.REQUIRED' | translate: {field: fieldName} }}
      </small>
      <small *ngIf="control?.errors?.['minlength']" [ngClass]="{'show': control?.invalid}">
        <i class="fas fa-exclamation-circle"></i> {{ 'VALIDATION.MIN_LENGTH' | translate: {field: fieldName, length: control.errors?.['minlength'].requiredLength} }}
      </small>
      <small *ngIf="control?.errors?.['maxlength']" [ngClass]="{'show': control?.invalid}">
        <i class="fas fa-exclamation-circle"></i> {{ 'VALIDATION.MAX_LENGTH' | translate: {field: fieldName, length: control.errors?.['maxlength'].requiredLength} }}
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
