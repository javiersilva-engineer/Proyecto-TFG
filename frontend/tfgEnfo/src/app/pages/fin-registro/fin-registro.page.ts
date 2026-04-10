import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fin-registro',
  templateUrl: './fin-registro.page.html',
  styleUrls: ['./fin-registro.page.scss'],
  standalone: false
})
export class FinRegistroPage implements OnInit {

  usuario: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }

    // fallback por si se recarga la página y no viene state
    if (!this.usuario) {
      this.usuario = localStorage.getItem('username') || '';
    }
  }

  goNext() {
    this.router.navigate(['/home']);
  }
}