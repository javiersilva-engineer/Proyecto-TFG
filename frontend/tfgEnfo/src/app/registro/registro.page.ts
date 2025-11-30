import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  // Variable que guarda el género seleccionado
  selectedGender: string = '';

  constructor() { }

  ngOnInit() { }

  // Función para seleccionar un género
  selectGender(gender: string) {
    this.selectedGender = gender;
  }

}
