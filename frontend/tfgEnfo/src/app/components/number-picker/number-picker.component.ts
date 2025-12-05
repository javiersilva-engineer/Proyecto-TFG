import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-number-picker',
  templateUrl: './number-picker.component.html',
  styleUrls: ['./number-picker.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FontAwesomeModule]
})
export class NumberPickerComponent implements AfterViewInit {

  @Input() label: string = '';
  @Input() type: 'kg' | 'm' | 'años' = 'kg';
  @Input() value: number | null = null;
  @Input() hasError: boolean = false;

  @Output() valueChange = new EventEmitter<number>();

  showModal = false;

  selectedInt = 0;
  selectedDec = 0;

  decimals = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));

  faXmark = faXmark;

  @ViewChild('intScroll') intScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('decScroll') decScroll!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {}

  openPicker() {
    this.showModal = true;

    if (this.value !== null) {
      const parts = this.value.toString().split('.');
      this.selectedInt = Number(parts[0]) || 0;
      if (this.type !== 'años') {
        this.selectedDec = Number(parts[1] || 0);
      }
    }

    setTimeout(() => {
      this.centerScroll(this.intScroll.nativeElement, this.selectedInt);
      if (this.type !== 'años') {
        this.centerScroll(this.decScroll.nativeElement, this.selectedDec);
      }
    });
  }

  close() {
    this.showModal = false;
  }

  confirm() {
    let result = 0;
    if (this.type === 'años') {
      result = this.selectedInt;
    } else {
      result = Number(`${this.selectedInt}.${this.decimals[this.selectedDec]}`);
    }
    this.value = result;
    this.valueChange.emit(result);
    this.showModal = false;
  }

  centerScroll(scrollEl: HTMLElement, index: number) {
    const child = scrollEl.children[index] as HTMLElement;
    if (child) {
      const scrollTop = child.offsetTop - scrollEl.clientHeight / 2 + child.clientHeight / 2;
      scrollEl.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }

  selectInt(i: number) {
    this.selectedInt = i;
    this.centerScroll(this.intScroll.nativeElement, i);
  }

  selectDec(i: number) {
    this.selectedDec = i;
    this.centerScroll(this.decScroll.nativeElement, i);
  }

  onScroll(scrollEl: HTMLElement, type: 'int' | 'dec') {
    const center = scrollEl.scrollTop + scrollEl.clientHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < scrollEl.children.length; i++) {
      const child = scrollEl.children[i] as HTMLElement;
      const childCenter = child.offsetTop + child.clientHeight / 2;
      const distance = Math.abs(center - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    if (type === 'int') this.selectedInt = closestIndex;
    else this.selectedDec = closestIndex;
  }
}
