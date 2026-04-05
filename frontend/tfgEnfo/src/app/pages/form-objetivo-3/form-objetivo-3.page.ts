import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-objetivo-3',
  templateUrl: './form-objetivo-3.page.html',
  styleUrls: ['./form-objetivo-3.page.scss'],
  standalone: false
})
export class FormObjetivo3Page implements OnInit {

  usuario: string = '';

  calorias: number = 0;
  proteinas: number = 0;
  carbohidratos: number = 0;
  grasas: number = 0;

  pesoActual: number = 0;
  pesoObjetivo: number = 0;

  caloriasAnimadas: number = 0;
  dashOffset: number = 440;
  barraAnimada: number = 0;

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

    const userId = localStorage.getItem('userId');

    this.http.get<any>(`http://localhost:3000/api/usuarios/${userId}`)
      .subscribe({
        next: (user) => {
          this.calorias = user.caloriasObjetivo;
          this.proteinas = user.proteinasObjetivo;
          this.carbohidratos = user.carbohidratosObjetivo;
          this.grasas = user.grasasObjetivo;

          this.pesoActual = user.peso;
          this.pesoObjetivo = user.pesoObjetivo;

          this.animarCalorias();
          this.animarBarras();
        },
        error: err => console.error(err)
      });
  }

  goBack() {
    this.router.navigate(['/form-objetivo-2']);
  }

  goNext() {
    this.router.navigate(['/form-objetivo-4']);
  }

  animarCalorias() {
    const duracion = 1000;
    const pasos = 60;
    const incremento = this.calorias / pasos;

    let actual = 0;
    let paso = 0;

    const intervalo = setInterval(() => {
      paso++;
      actual += incremento;

      this.caloriasAnimadas = Math.floor(actual);

      const progreso = paso / pasos;
      this.dashOffset = 440 - (440 * progreso);

      if (paso >= pasos) {
        this.caloriasAnimadas = this.calorias;
        this.dashOffset = 0;
        clearInterval(intervalo);
      }
    }, duracion / pasos);
  }

  animarBarras() {
    const duracion = 800;
    const pasos = 50;

    let paso = 0;

    const intervalo = setInterval(() => {
      paso++;

      this.barraAnimada = (paso / pasos) * 100;

      if (paso >= pasos) {
        this.barraAnimada = 100;
        clearInterval(intervalo);
      }
    }, duracion / pasos);
  }
}