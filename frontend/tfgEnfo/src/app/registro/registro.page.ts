import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  selectedGender: string = '';

  errors = {
    username: false,
    email: false,
    password: false,
    gender: false,
    emailFormat: false
  };

  constructor() { }

  ngOnInit() { }

  selectGender(gender: string) {
    this.selectedGender = gender;
    this.errors.gender = false;
  }

  onSubmit() {
    const username = (document.querySelector('#username') as HTMLInputElement).value;
    const email = (document.querySelector('#email') as HTMLInputElement).value;
    const password = (document.querySelector('#password') as HTMLInputElement).value;

    // Validaciones básicas
    this.errors.username = username.trim() === '';
    this.errors.email = email.trim() === '';
    this.errors.password = password.trim() === '';
    this.errors.gender = this.selectedGender === '';

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.errors.emailFormat = !emailRegex.test(email.trim());

    // Si hay errores detenemos el envío del formulario
    if (
      this.errors.username ||
      this.errors.email ||
      this.errors.password ||
      this.errors.gender ||
      this.errors.emailFormat
    ) {
      return;
    }

    // Aquí va la lógica del registro REAL
    console.log("Formulario válido. Procediendo a registrar...");
  }

}
