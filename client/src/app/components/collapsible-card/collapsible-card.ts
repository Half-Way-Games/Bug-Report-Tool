import { Component, Input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-collapsible-card',
  styleUrl: './collapsible-card.css',
  templateUrl: './collapsible-card.html',
})
export class CollapsibleCard {
  @Input({required: true}) title!: string;
  @Input() defaultOpen = false;
  @Input() summary = 'View Details';
}
