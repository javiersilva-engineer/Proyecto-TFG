import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class InputComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() error: string | null = null;

  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
}
