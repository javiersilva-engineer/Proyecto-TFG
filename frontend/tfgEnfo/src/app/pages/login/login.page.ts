import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario_services/usuario';

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

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() { }

  onSubmit() {
    this.errors.email = this.email.trim() === '';
    this.errors.password = this.password.trim() === '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.errors.emailFormat = !emailRegex.test(this.email.trim());

    if (this.errors.email || this.errors.password || this.errors.emailFormat) {
      return;
    }

    this.usuarioService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login correcto', response);

        // Guardar usuario activo
        localStorage.setItem('userId', response.usuario.id);
        localStorage.setItem('username', response.usuario.nombreUsuario);
        localStorage.setItem('userEmail', response.usuario.email);

        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.errors.password = true;
        console.log('Email o contraseña incorrectos');
      }
    });
  }

}
