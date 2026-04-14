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
  origen: 'registro' | 'perfil' | '' = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  ionViewWillEnter() {
    const state = history.state;

    this.usuario = state?.username || localStorage.getItem('username') || '';
    this.origen = state?.origen || '';
  }

  goNext() {
    this.router.navigate(['/home']);
  }
}