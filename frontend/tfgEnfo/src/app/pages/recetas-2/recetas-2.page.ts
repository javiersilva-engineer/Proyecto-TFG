import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

interface IngredienteData {
  nombreES?: string;
}

interface IngredienteItem {
  ingrediente?: IngredienteData;
  cantidad?: number;
  unidad?: string;
}

interface RecetaDetalle {
  _id: string;
  nombreES: string;
  nombreInterno?: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  imagen?: string;
  recetaES?: string;
  recetaInterna?: string;
  minCocina?: number;
  segCocina?: number;
  ingredientes: IngredienteItem[];
}

@Component({
  selector: 'app-recetas-2',
  templateUrl: './recetas-2.page.html',
  styleUrls: ['./recetas-2.page.scss'],
  standalone: false
})
export class Recetas2Page implements OnInit {

  receta: RecetaDetalle | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location) { }

  ngOnInit() {
    const recetaId = this.route.snapshot.paramMap.get('id');

    if (!recetaId) {
      console.error('No se recibió el id de la receta');
      return;
    }

    this.cargarReceta(recetaId);
  }

  cargarReceta(recetaId: string) {
    this.http.get<RecetaDetalle>(`http://localhost:3000/api/comidas/id/${recetaId}`)
      .subscribe({
        next: (data) => {
          this.receta = data;
        },
        error: (err) => console.error('Error cargando receta', err)
      });
  }

  volver() {
    this.location.back();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/imgs/imgsSalva.png';
    img.classList.add('fallback');
  }

  readonly apiBaseUrl = 'http://localhost:3000';

  getImagenUrl(ruta?: string): string {
    if (!ruta) {
      return 'assets/imgs/imgsSalva.png';
    }

    if (ruta.startsWith('http://') || ruta.startsWith('https://')) {
      return ruta;
    }

    return `${this.apiBaseUrl}${ruta}`;
  }
}