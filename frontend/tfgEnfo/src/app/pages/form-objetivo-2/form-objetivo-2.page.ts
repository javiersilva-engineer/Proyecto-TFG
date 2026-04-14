import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-objetivo-2',
  templateUrl: './form-objetivo-2.page.html',
  styleUrls: ['./form-objetivo-2.page.scss'],
  standalone: false
})
export class FormObjetivo2Page implements OnInit {

  usuario: string = '';
  origen: 'registro' | 'perfil' | '' = '';
  progress: number = 40;

  nivelActividad: string | null = null;

  triedToNavigate: boolean = false;
  errorMessage: string = '';

  isPC: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.isPC = window.innerWidth >= 767;

    window.addEventListener('resize', () => {
      this.isPC = window.innerWidth >= 767;
    });
  }

  ionViewWillEnter() {
    const state = history.state;

    this.usuario = state?.username || '';
    this.origen = state?.origen || '';
  }

  mapActividadANumero(nivel: string): number {
    const mapa: Record<string, number> = {
      sedentario: 0,
      ligero: 1,
      moderado: 2,
      alto: 3,
      atleta: 4
    };

    return mapa[nivel];
  }

  validateAndNavigate() {
    this.triedToNavigate = true;

    if (!this.nivelActividad) return;

    const userId = localStorage.getItem('userId');
    const ejercicioNumero = this.mapActividadANumero(this.nivelActividad);

    this.http.put(`http://localhost:3000/api/usuarios/${userId}`, {
      ejercicio: ejercicioNumero
    }).subscribe({
      next: () => {
        this.http.post(`http://localhost:3000/api/usuarios/calcular-objetivos/${userId}`, {})
          .subscribe({
            next: () => {
              this.router.navigate(['/form-objetivo-3'], {
                state: {
                  username: this.usuario,
                  origen: this.origen,
                  actividad: this.nivelActividad
                }
              });
            },
            error: err => console.error(err)
          });
      },
      error: err => console.error(err)
    });
  }

  hasError(): boolean {
    return this.triedToNavigate && !this.nivelActividad;
  }

  goBack() {
    this.router.navigate(['/form-objetivo-1'], {
      state: {
        username: this.usuario,
        origen: this.origen
      }
    });
  }
}