import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {

  // Datos del formulario
  username: string = '';
  email: string = '';
  password: string = '';
  selectedGender: string = '';

  // Errores del formulario
  errors = {
    username: false,
    email: false,
    password: false,
    gender: false,
    emailFormat: false
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  // Getter para saber si hay algún error activo
  get hasErrors(): boolean {
    return this.errors.username || this.errors.email || this.errors.password || this.errors.gender || this.errors.emailFormat;
  }

  // Método de envío del formulario
  onSubmit() {
    // Validaciones básicas
    this.errors.username = this.username.trim() === '';
    this.errors.email = this.email.trim() === '';
    this.errors.password = this.password.trim() === '';
    this.errors.gender = this.selectedGender === '';

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.errors.emailFormat = !emailRegex.test(this.email.trim());

    // Si hay errores, detenemos el envío
    if (
      this.errors.username ||
      this.errors.email ||
      this.errors.password ||
      this.errors.gender ||
      this.errors.emailFormat
    ) {
      console.log('Formulario con errores. No se envía.');
      return;
    }

    // Formulario válido, proceder con registro
    console.log("Formulario válido. Procediendo a registrar...");

    // Redirección a la siguiente página
    this.router.navigateByUrl('/form-objetivo-1');
  }

  // Método para actualizar el sexo seleccionado desde el componente
  selectGender(gender: string) {
    this.selectedGender = gender;
    this.errors.gender = false; // Limpiar error si se selecciona
  }
}