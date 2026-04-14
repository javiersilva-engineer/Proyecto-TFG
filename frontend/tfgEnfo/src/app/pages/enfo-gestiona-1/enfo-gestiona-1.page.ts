import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Alergia {
  _id: string;
  nombreES: string;
  nombreEN?: string;
}

@Component({
  selector: 'app-enfo-gestiona-1',
  templateUrl: './enfo-gestiona-1.page.html',
  styleUrls: ['./enfo-gestiona-1.page.scss'],
  standalone: false
})
export class EnfoGestiona1Page implements OnInit {

  usuario: string = '';
  origen: 'registro' | 'perfil' | '' = '';
  progress: number = 80;

  alergias: Alergia[] = [];
  alergiasSeleccionadas: string[] = [];

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

    this.cargarAlergias();
  }

  ionViewWillEnter() {
    const state = history.state;

    this.usuario = state?.username || '';
    this.origen = state?.origen || '';
  }

  cargarAlergias() {
    this.http.get<Alergia[]>('http://localhost:3000/api/alergias')
      .subscribe({
        next: (data) => {
          this.alergias = data;
        },
        error: (err) => console.error('Error cargando alergias', err)
      });
  }

  toggleAlergia(alergia: Alergia) {
    const yaSeleccionada = this.alergiasSeleccionadas.includes(alergia._id);

    if (yaSeleccionada) {
      this.alergiasSeleccionadas = this.alergiasSeleccionadas.filter(id => id !== alergia._id);
    } else {
      this.alergiasSeleccionadas.push(alergia._id);
    }
  }

  estaSeleccionada(id: string): boolean {
    return this.alergiasSeleccionadas.includes(id);
  }

  validateAndNavigate() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.put(`http://localhost:3000/api/usuarios/${userId}`, {
      alergias: this.alergiasSeleccionadas
    }).subscribe({
      next: () => {
        this.http.post(`http://localhost:3000/api/menu/generar/${userId}`, {})
          .subscribe({
            next: () => {
              this.router.navigate(['/enfo-gestiona-2'], {
                state: {
                  username: this.usuario,
                  origen: this.origen
                }
              });
            },
            error: (err) => console.error('Error generando menú semanal', err)
          });
      },
      error: (err) => console.error('Error actualizando alergias del usuario', err)
    });
  }

  goBack() {
    if (this.origen === 'perfil') {
      this.router.navigate(['/mi-perfil']);
      return;
    }

    this.router.navigate(['/form-objetivo-3'], {
      state: {
        username: this.usuario,
        origen: 'registro'
      }
    });
  }
}