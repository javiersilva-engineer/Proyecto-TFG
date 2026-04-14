import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

interface Usuario {
  _id: string;
  nombreUsuario: string;
  email: string;
  altura?: number;
  peso?: number;
  edad?: number;
  ejercicio?: number;
  sexo?: number;
  pesoObjetivo?: number | null;
  caloriasObjetivo?: number | null;
  proteinasObjetivo?: number | null;
  carbohidratosObjetivo?: number | null;
  grasasObjetivo?: number | null;
}

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
  standalone: false
})
export class MiPerfilPage implements OnInit {
  perfilForm!: FormGroup;

  readonly apiUsuarios = 'http://localhost:3000/api/usuarios';

  enviado = false;
  guardandoCuenta = false;
  usuarioId: string | null = null;
  usuarioActual: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ionViewWillEnter(): void {
    this.usuarioId = localStorage.getItem('userId');
    this.cargarUsuario();
  }

  initForm(): void {
    this.perfilForm = this.fb.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  cargarUsuario(): void {
    if (!this.usuarioId) {
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<Usuario>(`${this.apiUsuarios}/${this.usuarioId}`).subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;

        this.perfilForm.patchValue({
          nombreUsuario: usuario.nombreUsuario || '',
          email: usuario.email || ''
        });
      },
      error: async () => {
        await this.mostrarToast('No se pudo cargar la información del usuario.', 'danger');
      }
    });
  }

  campoInvalido(nombreCampo: string): boolean {
    const control = this.perfilForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.enviado));
  }

  async guardarCambiosCuenta(): Promise<void> {
    this.enviado = true;
    this.perfilForm.markAllAsTouched();

    if (this.perfilForm.invalid) {
      await this.mostrarToast('Revisa el nombre y el correo electrónico.', 'danger');
      return;
    }

    if (!this.usuarioId) {
      await this.mostrarToast('No se encontró el usuario actual.', 'danger');
      return;
    }

    const body = {
      nombreUsuario: this.perfilForm.value.nombreUsuario,
      email: this.perfilForm.value.email
    };

    this.guardandoCuenta = true;

    this.http.put(`${this.apiUsuarios}/${this.usuarioId}`, body).subscribe({
      next: async () => {
        this.guardandoCuenta = false;
        await this.mostrarToast('Perfil actualizado correctamente.', 'success');
      },
      error: async (error) => {
        this.guardandoCuenta = false;

        const mensaje =
          error?.error?.message ||
          'No se pudieron guardar los cambios del perfil.';

        await this.mostrarToast(mensaje, 'danger');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }

  irAFormularioObjetivo(): void {
    this.router.navigate(['/form-objetivo-1'], {
      state: {
        username: this.usuarioActual?.nombreUsuario || '',
        origen: 'perfil'
      }
    });
  }

  cambiarMenuSemanal(): void {
    this.router.navigate(['/enfo-gestiona-1'], {
      state: {
        username: this.usuarioActual?.nombreUsuario || '',
        origen: 'perfil'
      }
    });
  }

  async cerrarSesion(): Promise<void> {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menuSemanal');
    localStorage.removeItem('alergiasSeleccionadas');

    await this.mostrarToast('Sesión cerrada correctamente.', 'success');

    this.router.navigate(['/login']);
  }

  async mostrarToast(
    message: string,
    color: 'success' | 'danger'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });

    await toast.present();
  }

  async confirmarEliminarCuenta(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar cuenta',
      message: 'Esta acción eliminará tu cuenta de forma permanente. ¿Quieres continuar?',
      cssClass: 'custom-delete-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarCuenta();
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarCuenta(): Promise<void> {
    if (!this.usuarioId) {
      await this.mostrarToast('No se encontró el usuario actual.', 'danger');
      return;
    }

    this.http.delete(`${this.apiUsuarios}/${this.usuarioId}`).subscribe({
      next: async () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('menuSemanal');
        localStorage.removeItem('alergiasSeleccionadas');

        await this.mostrarToast('Cuenta eliminada correctamente.', 'success');
        this.router.navigate(['/login']);
      },
      error: async (error) => {
        const mensaje =
          error?.error?.message ||
          'No se pudo eliminar la cuenta.';

        await this.mostrarToast(mensaje, 'danger');
      }
    });
  }
}