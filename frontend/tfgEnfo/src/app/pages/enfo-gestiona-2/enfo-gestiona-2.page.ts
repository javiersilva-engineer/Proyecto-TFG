import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface IngredienteComida {
  ingrediente?: {
    nombreES?: string;
  };
}

interface ComidaMenu {
  _id: string;
  nombreES: string;
  calorias: number;
  ingredientes: IngredienteComida[];
}

@Component({
  selector: 'app-enfo-gestiona-2',
  templateUrl: './enfo-gestiona-2.page.html',
  styleUrls: ['./enfo-gestiona-2.page.scss'],
  standalone: false
})
export class EnfoGestiona2Page implements OnInit, AfterViewInit {

  @ViewChild('accordionContainer') accordionContainer!: ElementRef<HTMLDivElement>;

  usuario: string = '';
  isPC: boolean = false;

  menu: any = null;
  diaAbierto: string | null = 'lunes';

  showTopFade: boolean = false;
  showBottomFade: boolean = true;

  diasMenu = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.isPC = window.innerWidth >= 767;

    window.addEventListener('resize', () => {
      this.isPC = window.innerWidth >= 767;
    });

    this.cargarMenuYUsuario();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.actualizarFades();
    }, 0);
  }

  cargarMenu() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/menu/usuario/${userId}`)
      .subscribe({
        next: (data) => {
          this.menu = data;

          setTimeout(() => {
            this.actualizarFades();
          }, 0);
        },
        error: (err) => console.error('Error cargando menú semanal', err)
      });
  }

  cargarMenuYUsuario() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('No se encontró userId en localStorage');
      return;
    }

    this.http.get<any>(`http://localhost:3000/api/usuarios/${userId}`)
      .subscribe({
        next: (user) => {
          this.usuario = user.nombreUsuario || '';

          this.http.get<any>(`http://localhost:3000/api/menu/usuario/${userId}`)
            .subscribe({
              next: (data) => {
                this.menu = data;

                setTimeout(() => {
                  this.actualizarFades();
                }, 0);
              },
              error: (err) => console.error('Error cargando menú semanal', err)
            });
        },
        error: (err) => console.error('Error cargando usuario', err)
      });
  }

  toggleDia(dia: string) {
    this.diaAbierto = this.diaAbierto === dia ? null : dia;

    setTimeout(() => {
      this.actualizarFades();
    }, 0);
  }

  obtenerIngredientesTexto(comida: ComidaMenu): string {
    if (!comida?.ingredientes?.length) return '';

    return comida.ingredientes
      .map(i => i.ingrediente?.nombreES)
      .filter(Boolean)
      .join(', ');
  }

  onAccordionScroll(event: Event) {
    this.actualizarFades();
  }

  actualizarFades() {
    if (!this.accordionContainer?.nativeElement) return;

    const el = this.accordionContainer.nativeElement;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    this.showTopFade = scrollTop > 0;
    this.showBottomFade = scrollTop + clientHeight < scrollHeight - 1;
  }

  goBack() {
    this.router.navigate(['/enfo-gestiona-1'], {
      state: { username: this.usuario }
    });
  }

  goNext() {
    this.router.navigate(['/fin-registro'], {
      state: {
        username: this.usuario
      }
    });
  }

  obtenerComidasDelDia(dia: string): ComidaMenu[] {
    if (!this.menu || !this.menu[dia]) return [];

    const comidas: ComidaMenu[] = [];
    const menuDia = this.menu[dia];

    const orden = ['desayuno', 'comida', 'snack', 'cena'];

    for (const tipo of orden) {
      const comida = menuDia[tipo];
      if (comida) comidas.push(comida);
    }

    return comidas;
  }
}