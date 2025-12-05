import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  errors = {
    email: false,
    password: false,
    emailFormat: false
  };

  constructor(private router: Router) { }

  ngOnInit() { }

  // Método que se llama al hacer submit
  onSubmit() {
    // Validaciones
    this.errors.email = this.email.trim() === '';
    this.errors.password = this.password.trim() === '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.errors.emailFormat = !emailRegex.test(this.email.trim());

    if (this.errors.email || this.errors.password || this.errors.emailFormat) {
      console.log('Formulario con errores. No se inicia sesión.');
      return;
    }

    // Formulario válido, iniciar sesión
    console.log('Inicio de sesión correcto');

    // Redirigir a la página principal o dashboard
    this.router.navigateByUrl('/home'); 
  }
}
