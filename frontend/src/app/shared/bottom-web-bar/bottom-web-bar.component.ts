import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-BottomBar',
  standalone: true,
  imports: [ NgClass, NgIf],
  templateUrl: './bottom-web-bar.component.html',
  styleUrl: './bottom-web-bar.component.css'
})
export class BottomWebBarComponent {
    
    // Params 
    @Input() type: 'success' | 'error' | 'warning' | null = null;
    @Input() message: String = '';

    constructor() {}

}
