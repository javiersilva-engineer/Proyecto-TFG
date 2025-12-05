import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form-objetivo-1',
  templateUrl: './form-objetivo-1.page.html',
  styleUrls: ['./form-objetivo-1.page.scss'],
  standalone: false
})
export class FormObjetivo1Page implements OnInit {

  usuario: string = '';
  progress: number = 20;

  constructor(private router: Router) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['username'] || '';
    }
  }

  nextStep() {
    if (this.progress < 100) {
      this.progress += 20;
    }
  }

  prevStep() {
    if (this.progress > 0) {
      this.progress -= 20;
    }
  }
}
