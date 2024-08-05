import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-one-button-modal',
  templateUrl: './one-button-modal.component.html',
  styleUrl: './one-button-modal.component.css',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      state('open', style({ opacity: 1 })),
      state('closed', style({ opacity: 0 })),
      transition('* => open', [animate('250ms ease-out')]),
      transition('* => closed', [animate('200ms ease-out')]),
    ])
  ]
})
export class OneButtonModalComponent {

  @Input() title: string = 'Default Title';
  @Input() confirmButtonText: string = 'Confirm';
  @Input() confirmButtonColor: string = 'blue';
  @Input() icon: string = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isOpen: boolean = false;

  animationState = 'closed';
  ngOnChanges() {
    this.animationState = this.isOpen ? 'open' : 'closed';
  }

  openModal() {
    
    this.isOpen = true;
    this.animationState = 'open';
  }

  closeModal() {
    
    this.animationState = 'closed';
    setTimeout(() => {
      this.isOpen = false;
      this.cancel.emit();
    }, 200); // Wait for the animation to complete
  }

  onConfirm() {
    this.confirm.emit();
    this.closeModal();
  }

  onOverlayClick(event: MouseEvent) {
    // Ensure that clicks outside the modal content area close the modal
    console.log('Overlay clicked:', event);
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
