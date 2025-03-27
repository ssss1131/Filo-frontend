import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ClickOutsideDirective} from '../../core/directive/click-outside.directive';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [
    ClickOutsideDirective,
    NgClass
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  @Input() title !: string;
  @Input() contentClass !: string;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }


}
