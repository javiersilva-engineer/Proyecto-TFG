import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-objetivo-1',
  templateUrl: './form-objetivo-1.page.html',
  styleUrls: ['./form-objetivo-1.page.scss'],
  standalone: false
})
export class FormObjetivo1Page implements OnInit {

  usuario: string = '';
  progress: number = 20;

  objetivoPeso: number | null = null;
  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;

  triedToNavigate: boolean = false;
  errorMessage: string = '';

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
  }

  validateAndNavigate() {
    this.triedToNavigate = true;

    if (this.hasError()) return;

    const userId = localStorage.getItem('userId');

    const body = {
      pesoObjetivo: this.objetivoPeso,
      peso: this.peso,
      altura: this.altura,
      edad: this.edad
    };

    this.http.put(`http://localhost:3000/api/usuarios/${userId}`, body)
      .subscribe({
        next: () => {
          this.router.navigate(['/form-objetivo-2'], {
            state: { username: this.usuario }
          });
        },
        error: err => console.error(err)
      });
  }

  hasError(): boolean {
    return this.objetivoPeso === null ||
      this.peso === null ||
      this.altura === null ||
      this.edad === null;
  }

  goBack() {
    this.router.navigate(['/registro']);
  }
}
