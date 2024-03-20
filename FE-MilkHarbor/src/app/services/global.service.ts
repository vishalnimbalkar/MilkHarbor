import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  // input field accept only number
  onKeyPress(event: any) {
    const input = String.fromCharCode(event.keyCode);
    const numericPattern = /^[0-9]+$/;
    if (!numericPattern.test(input)) {
      event.preventDefault();
    }
  }
}
