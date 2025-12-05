import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-flecha-button',
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule],
  templateUrl: './flecha-button.component.html',
  styleUrls: ['./flecha-button.component.scss']
})
export class FlechaButtonComponent {
  @Input() direction: 'left' | 'right' = 'right';
  @Output() click = new EventEmitter<void>();

  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

  onClick() {
    this.click.emit();
  }
}
