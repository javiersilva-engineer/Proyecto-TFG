import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface DiaSemana {
  letra: string;
  numero: number;
  selected: boolean;
  fechaISO: string;
  completado: boolean;
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

  fechaSeleccionada: string = '';
  calendarioAbierto: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.inicializarFechaSeleccionada();
    this.generarSemanaDesdeFechaSeleccionada();
  }

  ionViewWillEnter() {
    this.inicializarFechaSeleccionada();
    this.generarSemanaDesdeFechaSeleccionada();
    this.cargarDatosUsuario();
    this.cargarRacha();
    this.marcarDiasCompletadosSemana();
  }

  inicializarFechaSeleccionada() {
    const fechaGuardada = localStorage.getItem('selectedDate');

    if (fechaGuardada) {
      this.fechaSeleccionada = fechaGuardada;
    } else {
      this.fechaSeleccionada = this.formatearFechaLocal(new Date());
      localStorage.setItem('selectedDate', this.fechaSeleccionada);
    }
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

  generarSemanaDesdeFechaSeleccionada() {
    const fechaBase = this.convertirISOaDate(this.fechaSeleccionada);
    const day = fechaBase.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const lunes = new Date(fechaBase);
    lunes.setDate(fechaBase.getDate() + diffToMonday);

    const letras = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    this.semana = Array.from({ length: 7 }, (_, i) => {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);

      const fechaISO = this.formatearFechaLocal(fecha);

      return {
        letra: letras[i],
        numero: fecha.getDate(),
        selected: fechaISO === this.fechaSeleccionada,
        fechaISO,
        completado: false
      };
    });
  }

  seleccionarDiaSemana(fechaISO: string) {
    this.fechaSeleccionada = fechaISO;
    localStorage.setItem('selectedDate', this.fechaSeleccionada);

    this.generarSemanaDesdeFechaSeleccionada();
    this.cargarProgresoDiaSeleccionado();
    this.cargarRacha();
    this.marcarDiasCompletadosSemana();
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

          this.cargarProgresoDiaSeleccionado();
        },
        error: (err) => {
          console.error('Error cargando usuario en home', err);
        }
      });
  }

  cargarProgresoDiaSeleccionado() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/progreso/${userId}/${this.fechaSeleccionada}`)
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
  }

  cargarRacha() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/progreso/racha/${userId}/${this.fechaSeleccionada}`)
      .subscribe({
        next: (data) => {
          this.diasConsecutivos = data.racha ?? 0;
        },
        error: (err) => {
          console.error('Error cargando racha', err);
          this.diasConsecutivos = 0;
        }
      });
  }

  marcarDiasCompletadosSemana() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/menu/usuario/${userId}`)
      .subscribe({
        next: (menu) => {
          const mapaDias: Record<number, string> = {
            1: 'lunes',
            2: 'martes',
            3: 'miercoles',
            4: 'jueves',
            5: 'viernes',
            6: 'sabado',
            0: 'domingo'
          };

          this.semana.forEach((diaSemana) => {
            const fecha = this.convertirISOaDate(diaSemana.fechaISO);
            const day = fecha.getDay();
            const diaKey = mapaDias[day];

            const menuDia = menu[diaKey];

            const totalComidas = ['desayuno', 'comida', 'snack', 'cena']
              .filter(tipo => !!menuDia?.[tipo])
              .length;

            if (totalComidas === 0) {
              diaSemana.completado = false;
              return;
            }

            this.http.get<any>(`http://localhost:3000/api/progreso/${userId}/${diaSemana.fechaISO}`)
              .subscribe({
                next: (progreso) => {
                  const comidasHechas = progreso.comidasHechas || [];
                  diaSemana.completado = comidasHechas.length >= totalComidas;
                },
                error: () => {
                  diaSemana.completado = false;
                }
              });
          });
        },
        error: (err) => {
          console.error('Error cargando menú para marcar días completados', err);
        }
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
    this.calendarioAbierto = true;
  }

  cerrarCalendario() {
    this.calendarioAbierto = false;
  }

  onFechaCalendarioChange(event: any) {
    const nuevaFecha = event.detail.value;

    if (!nuevaFecha) return;

    const fechaISO = nuevaFecha.split('T')[0];

    this.fechaSeleccionada = fechaISO;
    localStorage.setItem('selectedDate', this.fechaSeleccionada);

    this.generarSemanaDesdeFechaSeleccionada();
    this.cargarProgresoDiaSeleccionado();
    this.cargarRacha();
    this.marcarDiasCompletadosSemana();
    this.cerrarCalendario();
  }

  irAjustes() {
    this.router.navigate(['/mi-perfil']);
  }
}