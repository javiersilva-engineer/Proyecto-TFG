import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

interface Ingrediente {
  nombreES?: string;
  nombreInterno?: string;
}

interface IngredienteItem {
  ingrediente?: Ingrediente;
}

interface Receta {
  _id: string;
  nombreES: string;
  nombreInterno?: string;
  calorias: number;
  imagen?: string;
  tipoComida: string[];
  ingredientes: IngredienteItem[];
}

interface Alergia {
  _id: string;
  nombreES: string;
}

@Component({
  selector: 'app-recetas-1',
  templateUrl: './recetas-1.page.html',
  styleUrls: ['./recetas-1.page.scss'],
  standalone: false
})
export class Recetas1Page implements OnInit {

  recetasFiltradas: Receta[] = [];

  alergias: Alergia[] = [];
  alergiasSeleccionadas: string[] = [];

  busqueda: string = '';

  minCalorias: number = 0;
  maxCalorias: number = 2000;

  minCaloriasSeleccionadas: number = 0;
  maxCaloriasSeleccionadas: number = 2000;

  filtrosAbiertos: boolean = false;

  categorias = [
    { key: 'desayuno', label: 'Desayuno' },
    { key: 'comida', label: 'Comida' },
    { key: 'cena', label: 'Cena' },
    { key: 'snack', label: 'Snack' }
  ];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.cargarAlergias();
    this.aplicarFiltros();
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

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  cerrarFiltros() {
    this.filtrosAbiertos = false;
  }

  toggleAlergia(nombreES: string) {
    if (this.alergiasSeleccionadas.includes(nombreES)) {
      this.alergiasSeleccionadas = this.alergiasSeleccionadas.filter(a => a !== nombreES);
    } else {
      this.alergiasSeleccionadas.push(nombreES);
    }
  }

  limpiarFiltros() {
    this.busqueda = '';
    this.minCaloriasSeleccionadas = this.minCalorias;
    this.maxCaloriasSeleccionadas = this.maxCalorias;
    this.alergiasSeleccionadas = [];
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let params = new HttpParams();

    if (this.busqueda.trim()) {
      params = params.set('q', this.busqueda.trim());
    }

    params = params.set('minCalorias', this.minCaloriasSeleccionadas.toString());
    params = params.set('maxCalorias', this.maxCaloriasSeleccionadas.toString());

    if (this.alergiasSeleccionadas.length > 0) {
      params = params.set('alergias', this.alergiasSeleccionadas.join(','));
    }

    this.http.get<Receta[]>('http://localhost:3000/api/comidas/buscar/filtros', { params })
      .subscribe({
        next: (data) => {
          this.recetasFiltradas = data;
          this.filtrosAbiertos = false;
        },
        error: (err) => console.error('Error aplicando filtros', err)
      });
  }

  obtenerRecetasPorTipo(tipo: string): Receta[] {
    return this.recetasFiltradas.filter(receta =>
      receta.tipoComida?.includes(tipo)
    );
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/imgs/imgsSalva.png';
    img.classList.add('fallback');
  }

  onMinSliderChange() {
    if (this.minCaloriasSeleccionadas > this.maxCaloriasSeleccionadas) {
      this.minCaloriasSeleccionadas = this.maxCaloriasSeleccionadas;
    }
  }

  onMaxSliderChange() {
    if (this.maxCaloriasSeleccionadas < this.minCaloriasSeleccionadas) {
      this.maxCaloriasSeleccionadas = this.minCaloriasSeleccionadas;
    }
  }

  abrirReceta(recetaId: string) {
    this.router.navigate(['/recetas-2', recetaId]);
  }

  get porcentajeMin(): number {
    return ((this.minCaloriasSeleccionadas - this.minCalorias) / (this.maxCalorias - this.minCalorias)) * 100;
  }

  get porcentajeMax(): number {
    return ((this.maxCaloriasSeleccionadas - this.minCalorias) / (this.maxCalorias - this.minCalorias)) * 100;
  }
}