import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScreenSizeService {
  private isSmallScreen = new BehaviorSubject<boolean>(false);
  isSmallScreen$ = this.isSmallScreen.asObservable();

  constructor() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize() {
    const isSmall = window.innerWidth < 768;
    this.isSmallScreen.next(isSmall);
  }
}
