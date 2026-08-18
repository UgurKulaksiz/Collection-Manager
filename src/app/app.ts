import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { CollectionItemCard } from './components/collection-item-card/collection-item-card';
import { CollectionItem } from './models/collection-item';
import { SearchBar } from './components/search-bar/search-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CollectionItemCard, SearchBar],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  searchText = '';
  count = 0;

  coin!: CollectionItem;
  linx!: CollectionItem;

  itemList: CollectionItem[] = [];
  // Création du Signal qui va contenir l'index à afficher
  selectedItemIndex = signal(0);
  // Création d'un Signal 'computed'
  selectedItem = computed(() => {
    return this.itemList[this.selectedItemIndex()];
  });

  logEffect = effect(() => {
    console.log(this.selectedItemIndex(), this.selectedItem());
  });

  constructor() {
    this.coin = new CollectionItem();
    this.coin.name = 'Pièce de 1972';
    this.coin.description = 'Pièce de 50 centimes de francs.';
    this.coin.rarity = 'Commune';
    this.coin.image = 'img/coin1.jpg';
    this.coin.price = 170;

    this.linx = new CollectionItem();

    this.itemList = [this.coin, this.linx];
  }

  increamentCount() {
    this.count++;
  }

  incrementIndex() {
    this.selectedItemIndex.update((currentValue) => {
      return (currentValue + 1) % 2; // %2 pour permettre de switcher entre les éléments 0 & 1
    });
  }
}
