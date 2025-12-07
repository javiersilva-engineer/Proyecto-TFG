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

  // Ahora acepta string | number | null
  @Input() value: string | number | null = null;

  // Emite los mismos tipos
  @Output() valueChange = new EventEmitter<string | number | null>();

  // Necesario para emitir al escribir
  onValueChange(event: any) {
    const newValue = this.type === 'number'
      ? (event.target.value !== '' ? Number(event.target.value) : null)
      : event.target.value;

    this.valueChange.emit(newValue);
  }
}