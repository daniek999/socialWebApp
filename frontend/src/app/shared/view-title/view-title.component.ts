import { Component, Input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'view-title',
  standalone: true,
  imports: [NgClass],
  templateUrl: './view-title.component.html',
  styleUrl: './view-title.component.css'
})
export class ViewTitleComponent {
    @Input() title: string = '';
    @Input() icon: string = '';
}
