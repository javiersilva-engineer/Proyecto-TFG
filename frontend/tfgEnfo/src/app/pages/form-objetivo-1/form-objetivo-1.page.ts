import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-objetivo-1',
  templateUrl: './form-objetivo-1.page.html',
  styleUrls: ['./form-objetivo-1.page.scss'],
  standalone: false
})
export class FormObjetivo1Page implements OnInit {

  usuario: string = '';
  progress: number = 20;

  // Valores elegidos en los pickers
  objetivoPeso: number | null = null;
  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;

  // Control del modal del picker
  showPicker: boolean = false;
  pickerType: 'kg' | 'm' | 'años' = 'kg';

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }
  }

  // Abrir el selector
  openPicker(type: 'kg' | 'm' | 'años') {
    this.pickerType = type;
    this.showPicker = true;
  }

  // Recibir el valor del componente hijo
  onPickerValueSelected(value: number) {
    if (this.pickerType === 'kg') this.peso = value;
    if (this.pickerType === 'm') this.altura = value;
    if (this.pickerType === 'años') this.edad = value;

    this.showPicker = false;
  }

  nextStep() {
    if (this.progress < 100) {
      this.progress += 20;
    }
  }

  prevStep() {
    if (this.progress > 0) {
      this.progress -= 20;
    }
  }
}