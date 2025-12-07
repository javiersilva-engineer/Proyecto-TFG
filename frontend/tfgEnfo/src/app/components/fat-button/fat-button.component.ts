import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
  faBatteryEmpty, 
  faBatteryQuarter, 
  faBatteryHalf, 
  faBatteryThreeQuarters, 
  faBatteryFull 
} from '@fortawesome/free-solid-svg-icons';

const ICONS_MAP: Record<string, IconDefinition> = {
  'battery-empty': faBatteryEmpty,
  'battery-quarter': faBatteryQuarter,
  'battery-half': faBatteryHalf,
  'battery-three-quarters': faBatteryThreeQuarters,
  'battery-full': faBatteryFull
};

@Component({
  selector: 'app-fat-button',
  templateUrl: './fat-button.component.html',
  styleUrls: ['./fat-button.component.scss'],
  standalone: true,
  imports: [FontAwesomeModule]
})
export class FatButtonComponent implements OnInit {

  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';

  faIcon!: IconDefinition;

  ngOnInit() {
    this.faIcon = ICONS_MAP[this.icon] || faBatteryEmpty;
  }
}
