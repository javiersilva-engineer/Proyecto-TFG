import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DiaSemana {
  letra: string;
  numero: number;
  selected: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  diasConsecutivos: number = 0;

  pesoActual: number = 0;
  pesoObjetivo: number = 0;

  caloriasConsumidas: number = 0;
  caloriasObjetivo: number = 0;

  carbohidratosConsumidos: number = 0;
  carbohidratosObjetivo: number = 0;

  proteinasConsumidas: number = 0;
  proteinasObjetivo: number = 0;

  grasasConsumidas: number = 0;
  grasasObjetivo: number = 0;

  dashOffset: number = 465;

  barraCarbos: number = 0;
  barraProteinas: number = 0;
  barraGrasas: number = 0;

  semana: DiaSemana[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.generarSemanaActual();
  }

  ionViewWillEnter() {
    this.generarSemanaActual();
    this.cargarDatosUsuario();
  }

  generarSemanaActual() {
    const hoy = new Date();
    const day = hoy.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diffToMonday);

    const letras = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    this.semana = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);

      return {
        letra: letras[i],
        numero: fecha.getDate(),
        selected:
          fecha.getDate() === hoy.getDate() &&
          fecha.getMonth() === hoy.getMonth() &&
          fecha.getFullYear() === hoy.getFullYear()
      };
    });
  }

  cargarDatosUsuario() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/usuarios/${userId}`)
      .subscribe({
        next: (user) => {
          this.pesoActual = user.peso ?? 0;
          this.pesoObjetivo = user.pesoObjetivo ?? 0;

          this.caloriasObjetivo = user.caloriasObjetivo ?? 0;
          this.proteinasObjetivo = user.proteinasObjetivo ?? 0;
          this.carbohidratosObjetivo = user.carbohidratosObjetivo ?? 0;
          this.grasasObjetivo = user.grasasObjetivo ?? 0;

          const fechaHoy = new Date().toISOString().split('T')[0];

          this.http.get<any>(`http://localhost:3000/api/progreso/${userId}/${fechaHoy}`)
            .subscribe({
              next: (progreso) => {
                this.caloriasConsumidas = progreso.caloriasConsumidas ?? 0;
                this.proteinasConsumidas = progreso.proteinasConsumidas ?? 0;
                this.carbohidratosConsumidos = progreso.carbohidratosConsumidos ?? 0;
                this.grasasConsumidas = progreso.grasasConsumidas ?? 0;

                this.actualizarIndicadores();
              },
              error: (err) => {
                console.error('Error cargando progreso diario', err);

                this.caloriasConsumidas = 0;
                this.proteinasConsumidas = 0;
                this.carbohidratosConsumidos = 0;
                this.grasasConsumidas = 0;

                this.actualizarIndicadores();
              }
            });
        },
        error: (err) => console.error('Error cargando usuario en home', err)
      });
  }

  actualizarIndicadores() {
    const progresoCalorias =
      this.caloriasObjetivo > 0
        ? Math.min(this.caloriasConsumidas / this.caloriasObjetivo, 1)
        : 0;

    const circumference = 2 * Math.PI * 70;
    this.dashOffset = circumference - circumference * progresoCalorias;

    this.barraCarbos =
      this.carbohidratosObjetivo > 0
        ? Math.min((this.carbohidratosConsumidos / this.carbohidratosObjetivo) * 100, 100)
        : 0;

    this.barraProteinas =
      this.proteinasObjetivo > 0
        ? Math.min((this.proteinasConsumidas / this.proteinasObjetivo) * 100, 100)
        : 0;

    this.barraGrasas =
      this.grasasObjetivo > 0
        ? Math.min((this.grasasConsumidas / this.grasasObjetivo) * 100, 100)
        : 0;
  }

  abrirCalendario() {
    console.log('Abrir selector de fecha');
  }

  irAjustes() {
    this.router.navigate(['/mi-perfil']);
  }
}