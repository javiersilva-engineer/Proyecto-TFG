import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class LinkComponent {
  @Input() text: string = '';
  @Input() route: string = '/';
}
