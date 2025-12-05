import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-gender-selection',
  templateUrl: './gender-selection.component.html',
  styleUrls: ['./gender-selection.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class GenderSelectionComponent {
  @Input() selected: string = '';
  @Output() selectedChange = new EventEmitter<string>();
  @Input() error: string | null = null;

  selectGender(gender: string) {
    this.selected = gender;
    this.selectedChange.emit(this.selected);
  }
}
