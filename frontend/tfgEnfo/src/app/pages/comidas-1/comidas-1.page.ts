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

  fechaSeleccionada: string = '';
  tituloDiaSeleccionado: string = '';

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
    this.inicializarFechaSeleccionada();
    this.cargarMenuUsuario();
  }

  ionViewWillEnter() {
    this.inicializarFechaSeleccionada();
    this.actualizarTituloDia();
    this.actualizarComidasDelDia();
    this.cargarProgresoDiaSeleccionado();
  }

  inicializarFechaSeleccionada() {
    const fechaGuardada = localStorage.getItem('selectedDate');

    if (fechaGuardada) {
      this.fechaSeleccionada = fechaGuardada;
    } else {
      this.fechaSeleccionada = this.formatearFechaLocal(new Date());
      localStorage.setItem('selectedDate', this.fechaSeleccionada);
    }

    this.actualizarTituloDia();
  }

  formatearFechaLocal(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  convertirISOaDate(fechaISO: string): Date {
    return new Date(`${fechaISO}T12:00:00`);
  }

  obtenerDiaKeyDesdeFecha(fechaISO: string): string {
    const fecha = this.convertirISOaDate(fechaISO);
    const day = fecha.getDay();

    const mapa: Record<number, string> = {
      1: 'lunes',
      2: 'martes',
      3: 'miercoles',
      4: 'jueves',
      5: 'viernes',
      6: 'sabado',
      0: 'domingo'
    };

    return mapa[day];
  }

  actualizarTituloDia() {
    const fecha = this.convertirISOaDate(this.fechaSeleccionada);

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const nombreDia = dias[fecha.getDay()];

    this.tituloDiaSeleccionado = `${nombreDia} ${fecha.getDate()}`;
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

    const diaKey = this.obtenerDiaKeyDesdeFecha(this.fechaSeleccionada);
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

    this.http.get<any>(`http://localhost:3000/api/progreso/${userId}/${this.fechaSeleccionada}`)
      .subscribe({
        next: (data) => {
          this.comidasHechasIds = data.comidasHechas || [];
        },
        error: (err) => {
          console.error('Error cargando progreso diario', err);
          this.comidasHechasIds = [];
        }
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

    this.http.post<any>('http://localhost:3000/api/progreso/toggle', {
      usuarioId: userId,
      fecha: this.fechaSeleccionada,
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
    const fecha = this.convertirISOaDate(this.fechaSeleccionada);
    fecha.setDate(fecha.getDate() - 1);

    this.fechaSeleccionada = this.formatearFechaLocal(fecha);
    localStorage.setItem('selectedDate', this.fechaSeleccionada);

    this.actualizarTituloDia();
    this.actualizarComidasDelDia();
    this.cargarProgresoDiaSeleccionado();
  }

  diaSiguiente() {
    const fecha = this.convertirISOaDate(this.fechaSeleccionada);
    fecha.setDate(fecha.getDate() + 1);

    this.fechaSeleccionada = this.formatearFechaLocal(fecha);
    localStorage.setItem('selectedDate', this.fechaSeleccionada);

    this.actualizarTituloDia();
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