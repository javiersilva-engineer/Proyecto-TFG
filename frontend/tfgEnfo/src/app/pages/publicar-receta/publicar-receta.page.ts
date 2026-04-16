import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface IngredienteDB {
  _id: string;
  nombreES: string;
  nombreInterno?: string;
}

interface IngredienteFila {
  ingrediente: string;
  nombreES: string;
  cantidad: number | null;
  unidad: string;
}

@Component({
  selector: 'app-publicar-receta',
  templateUrl: './publicar-receta.page.html',
  styleUrls: ['./publicar-receta.page.scss'],
  standalone: false
})
export class PublicarRecetaPage implements OnInit {
  recetaForm!: FormGroup;

  readonly apiIngredientes = 'http://localhost:3000/api/ingredientes';
  readonly apiComidas = 'http://localhost:3000/api/comidas';
  readonly imagenPorDefecto = 'assets/imgs/imgsSalva.png';

  imagenPreview: string = this.imagenPorDefecto;
  imagenFile: File | null = null;

  enviado = false;
  cargando = false;
  mostrarBannerExito = false;

  ingredientesBD: IngredienteDB[] = [];
  sugerenciasPorFila: IngredienteDB[][] = [];
  mostrandoSugerencias: boolean[] = [];

  constructor(
    private fb: FormBuilder,
    private toastController: ToastController,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarIngredientes();
  }

  initForm(): void {
    this.recetaForm = this.fb.group({
      titulo: ['', Validators.required],
      calorias: [null, [Validators.required, Validators.min(0)]],
      proteinas: [null, [Validators.required, Validators.min(0)]],
      carbohidratos: [null, [Validators.required, Validators.min(0)]],
      grasas: [null, [Validators.required, Validators.min(0)]],
      tipoComida: ['', Validators.required],
      ingredientes: this.fb.array([
        this.crearIngredienteFormGroup(),
        this.crearIngredienteFormGroup()
      ]),
      recetaES: ['', Validators.required],
      minCocina: [null, [Validators.required, Validators.min(0)]]
    });

    this.sugerenciasPorFila = this.ingredientesArray.controls.map(() => []);
    this.mostrandoSugerencias = this.ingredientesArray.controls.map(() => false);
  }

  crearIngredienteFormGroup(): FormGroup {
    return this.fb.group({
      ingrediente: [null, Validators.required],
      nombreES: ['', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(0)]],
      unidad: ['g']
    });
  }

  get ingredientesArray(): FormArray {
    return this.recetaForm.get('ingredientes') as FormArray;
  }

  cargarIngredientes(): void {
    this.http.get<IngredienteDB[]>(this.apiIngredientes).subscribe({
      next: (ingredientes) => {
        this.ingredientesBD = ingredientes || [];
      },
      error: async () => {
        await this.mostrarToast('No se pudieron cargar los ingredientes.', 'danger');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/home']);
  }

  agregarIngrediente(): void {
    this.ingredientesArray.push(this.crearIngredienteFormGroup());
    this.sugerenciasPorFila.push([]);
    this.mostrandoSugerencias.push(false);
  }

  eliminarIngrediente(index: number): void {
    if (this.ingredientesArray.length <= 1) {
      return;
    }

    this.ingredientesArray.removeAt(index);
    this.sugerenciasPorFila.splice(index, 1);
    this.mostrandoSugerencias.splice(index, 1);
  }

  onInputIngrediente(index: number): void {
    const control = this.ingredientesArray.at(index);
    const texto = (control.get('nombreES')?.value || '').trim().toLowerCase();

    control.get('ingrediente')?.setValue(null, { emitEvent: false });
    control.get('ingrediente')?.markAsTouched();

    if (!texto) {
      this.sugerenciasPorFila[index] = [];
      this.mostrandoSugerencias[index] = false;
      return;
    }

    this.sugerenciasPorFila[index] = this.ingredientesBD
      .filter(ing => (ing.nombreES || '').toLowerCase().includes(texto))
      .slice(0, 8);

    this.mostrandoSugerencias[index] = this.sugerenciasPorFila[index].length > 0;
  }

  seleccionarSugerencia(index: number, ingrediente: IngredienteDB): void {
    const fila = this.ingredientesArray.at(index);

    fila.patchValue({
      ingrediente: ingrediente._id,
      nombreES: ingrediente.nombreES
    });

    fila.get('ingrediente')?.markAsTouched();
    fila.get('nombreES')?.markAsTouched();

    this.sugerenciasPorFila[index] = [];
    this.mostrandoSugerencias[index] = false;
  }

  abrirSugerencias(index: number): void {
    this.onInputIngrediente(index);
  }

  cerrarSugerencias(index: number): void {
    setTimeout(() => {
      this.mostrandoSugerencias[index] = false;
    }, 150);
  }

  async onSeleccionarImagen(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      await this.mostrarToast('Formato de imagen no válido. Usa JPG, PNG o WEBP.', 'danger');
      input.value = '';
      return;
    }

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      await this.mostrarToast('La imagen supera el tamaño máximo permitido (5 MB).', 'danger');
      input.value = '';
      return;
    }

    this.imagenFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPreview = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  campoInvalido(nombreCampo: string): boolean {
    const control = this.recetaForm.get(nombreCampo);
    return !!(control && control.invalid && (control.touched || this.enviado));
  }

  ingredienteCampoInvalido(index: number, campo: string): boolean {
    const control = this.ingredientesArray.at(index).get(campo);
    return !!(control && control.invalid && (control.touched || this.enviado));
  }

  ingredienteNombreInvalido(index: number): boolean {
    const fila = this.ingredientesArray.at(index);
    const nombreControl = fila.get('nombreES');
    const ingredienteControl = fila.get('ingrediente');

    const nombreTocado = nombreControl?.touched || this.enviado;
    const ingredienteTocado = ingredienteControl?.touched || this.enviado;

    return !!(
      (nombreControl?.invalid && nombreTocado) ||
      (ingredienteControl?.invalid && ingredienteTocado)
    );
  }

  imagenInvalida(): boolean {
    return !this.imagenFile && this.enviado;
  }

  marcarTodoComoTocado(control: FormGroup | FormArray): void {
    Object.values(control.controls).forEach((c: any) => {
      c.markAsTouched();

      if (c.controls) {
        this.marcarTodoComoTocado(c);
      }
    });
  }

  construirIngredientes() {
    const value = this.recetaForm.value;

    return value.ingredientes.map((ing: IngredienteFila) => ({
      ingrediente: ing.ingrediente,
      cantidad: Number(ing.cantidad),
      unidad: ing.unidad ?? ''
    }));
  }

  construirFormData(): FormData {
    const value = this.recetaForm.value;
    const ingredientes = this.construirIngredientes();

    const formData = new FormData();

    formData.append('nombreInterno', value.titulo);
    formData.append('nombreES', value.titulo);
    formData.append('calorias', String(Number(value.calorias)));
    formData.append('proteinas', String(Number(value.proteinas)));
    formData.append('carbohidratos', String(Number(value.carbohidratos)));
    formData.append('grasas', String(Number(value.grasas)));
    formData.append('recetaInterna', value.recetaES);
    formData.append('recetaES', value.recetaES);
    formData.append('minCocina', String(Number(value.minCocina)));
    formData.append('segCocina', '0');
    formData.append('tipoComida', JSON.stringify([value.tipoComida]));
    formData.append('ingredientes', JSON.stringify(ingredientes));

    if (this.imagenFile) {
      formData.append('imagen', this.imagenFile);
    }

    return formData;
  }

  async guardarReceta(): Promise<void> {
    this.enviado = true;
    this.marcarTodoComoTocado(this.recetaForm);

    if (!this.imagenFile) {
      await this.mostrarToast('Debes seleccionar una imagen para la receta.', 'danger');
      return;
    }

    if (this.recetaForm.invalid) {
      await this.mostrarToast('Completa todos los campos obligatorios.', 'danger');
      return;
    }

    this.cargando = true;
    const formData = this.construirFormData();

    this.http.post(this.apiComidas, formData).subscribe({
      next: async () => {
        this.cargando = false;
        this.mostrarBannerPublicacion();

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3600);
      },
      error: async (error) => {
        this.cargando = false;

        const mensaje =
          error?.error?.message ||
          'No se pudo publicar la receta.';

        await this.mostrarToast(mensaje, 'danger');
      }
    });
  }

  mostrarBannerPublicacion(): void {
    this.mostrarBannerExito = true;

    setTimeout(() => {
      this.mostrarBannerExito = false;
    }, 3300);
  }

  async mostrarToast(message: string, color: 'success' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });

    await toast.present();
  }
}