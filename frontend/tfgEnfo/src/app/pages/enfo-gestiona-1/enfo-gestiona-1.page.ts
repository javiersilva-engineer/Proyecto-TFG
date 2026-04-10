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
  progress: number = 80;

  alergias: Alergia[] = [];
  alergiasSeleccionadas: string[] = [];

  isPC: boolean = false;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }

    this.isPC = window.innerWidth >= 767;

    window.addEventListener('resize', () => {
      this.isPC = window.innerWidth >= 767;
    });

    this.cargarAlergias();
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

    // 1) Guardar alergias en el usuario
    this.http.put(`http://localhost:3000/api/usuarios/${userId}`, {
      alergias: this.alergiasSeleccionadas
    }).subscribe({
      next: () => {

        // 2) Generar menú semanal teniendo en cuenta esas alergias
        this.http.post(`http://localhost:3000/api/menu/generar/${userId}`, {})
          .subscribe({
            next: () => {
              // 3) Navegar cuando todo haya ido bien
              this.router.navigate(['/siguiente-pagina'], {
                state: {
                  username: this.usuario
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
    this.router.navigate(['/form-objetivo-4'], {
      state: { username: this.usuario }
    });
  }
}