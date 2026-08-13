import { Component, input, InputSignal } from '@angular/core';
import { CollectionItem } from '../../models/collection-item';

@Component({
  selector: 'app-collection-item-card',
  imports: [],
  templateUrl: './collection-item-card.html',
  styleUrl: './collection-item-card.scss',
})
export class CollectionItemCard {
  // <> = Type d'input
  item = input.required<CollectionItem>();
}
