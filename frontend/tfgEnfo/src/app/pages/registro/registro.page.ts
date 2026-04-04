import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario_services/usuario';

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

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() { }

  // Getter para saber si hay algún error activo
  get hasErrors(): boolean {
    return this.errors.username || this.errors.email || this.errors.password || this.errors.gender || this.errors.emailFormat;
  }

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
    if (this.hasErrors) {
      console.log('Formulario con errores. No se envía.');
      return;
    }

    // Formulario válido, construir objeto de usuario
    const nuevoUsuario = {
      nombreUsuario: this.username.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
      sexo: this.selectedGender === 'Hombre' ? 1 : 0,
      altura: null,
      peso: null,
      edad: null,
      ejercicio: null
    };

    // Llamar al servicio para crear usuario
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: (usuario) => {
        console.log('Usuario creado:', usuario);

        // Guardar ID
        localStorage.setItem('userId', usuario._id);

        // Redirigir a la siguiente pantalla
        this.router.navigateByUrl('/form-objetivo-1', { state: { username: this.username } });
      },
      error: (err) => {
        console.error('Error creando usuario:', err);
      }
    });
  }
}