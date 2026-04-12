import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface ComidaMenu {
  _id: string;
  nombreES: string;
  calorias: number;
  proteinas?: number;
  carbohidratos?: number;
  grasas?: number;
  imagen?: string;
}

@Component({
  selector: 'app-comidas-1',
  templateUrl: './comidas-1.page.html',
  styleUrls: ['./comidas-1.page.scss'],
  standalone: false
})
export class Comidas1Page implements OnInit {

  menu: any = null;
  comidasDelDia: ComidaMenu[] = [];
  comidasHechasIds: string[] = [];

  diaIndex: number = 0;

  touchStartX: number = 0;
  touchEndX: number = 0;

  diasMenu = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.diaIndex = this.obtenerIndiceDiaActual();
    this.cargarMenuUsuario();
  }

  obtenerIndiceDiaActual(): number {
    const hoy = new Date().getDay();

    const mapa: Record<number, number> = {
      1: 0,
      2: 1,
      3: 2,
      4: 3,
      5: 4,
      6: 5,
      0: 6
    };

    return mapa[hoy];
  }

  obtenerFechaSeleccionada(): string {
    const hoy = new Date();
    const day = hoy.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() + diffToMonday);

    const fechaSeleccionada = new Date(lunes);
    fechaSeleccionada.setDate(lunes.getDate() + this.diaIndex);

    return fechaSeleccionada.toISOString().split('T')[0];
  }

  cargarMenuUsuario() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/menu/usuario/${userId}`)
      .subscribe({
        next: (data) => {
          this.menu = data;
          this.actualizarComidasDelDia();
          this.cargarProgresoDiaSeleccionado();
        },
        error: (err) => console.error('Error cargando menú del usuario', err)
      });
  }

  actualizarComidasDelDia() {
    if (!this.menu) {
      this.comidasDelDia = [];
      return;
    }

    const diaKey = this.diasMenu[this.diaIndex].key;
    const menuDia = this.menu[diaKey];

    if (!menuDia) {
      this.comidasDelDia = [];
      return;
    }

    const orden = ['desayuno', 'comida', 'snack', 'cena'];

    this.comidasDelDia = orden
      .map(tipo => menuDia[tipo])
      .filter(Boolean);
  }

  cargarProgresoDiaSeleccionado() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    const fecha = this.obtenerFechaSeleccionada();

    this.http.get<any>(`http://localhost:3000/api/progreso/${userId}/${fecha}`)
      .subscribe({
        next: (data) => {
          this.comidasHechasIds = data.comidasHechas || [];
        },
        error: (err) => console.error('Error cargando progreso diario', err)
      });
  }

  estaHecha(comidaId: string): boolean {
    return this.comidasHechasIds.includes(comidaId);
  }

  toggleHecho(comida: ComidaMenu, event?: Event) {
    event?.stopPropagation();

    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    const fecha = this.obtenerFechaSeleccionada();

    this.http.post<any>('http://localhost:3000/api/progreso/toggle', {
      usuarioId: userId,
      fecha,
      comidaId: comida._id
    }).subscribe({
      next: (response) => {
        this.comidasHechasIds = response.progreso.comidasHechas || [];
      },
      error: (err) => console.error('Error actualizando comida hecha', err)
    });
  }

  abrirReceta(recetaId: string, event?: Event) {
    event?.stopPropagation();
    this.router.navigate(['/recetas-2', recetaId]);
  }

  diaAnterior() {
    this.diaIndex = this.diaIndex === 0
      ? this.diasMenu.length - 1
      : this.diaIndex - 1;

    this.actualizarComidasDelDia();
    this.cargarProgresoDiaSeleccionado();
  }

  diaSiguiente() {
    this.diaIndex = this.diaIndex === this.diasMenu.length - 1
      ? 0
      : this.diaIndex + 1;

    this.actualizarComidasDelDia();
    this.cargarProgresoDiaSeleccionado();
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.detectarSwipe();
  }

  detectarSwipe() {
    const diferencia = this.touchEndX - this.touchStartX;

    if (Math.abs(diferencia) < 50) return;

    if (diferencia > 0) {
      this.diaAnterior();
    } else {
      this.diaSiguiente();
    }
  }
}