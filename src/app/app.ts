import { ChangeDetectionStrategy, Component, computed, effect, model, signal } from '@angular/core';
import { CollectionItemCard } from './components/collection-item-card/collection-item-card';
import { CollectionItem } from './models/collection-item';
import { SearchBar } from './components/search-bar/search-bar';
import { Collection } from './models/collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CollectionItemCard, SearchBar],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  search = model('');

  coin!: CollectionItem;
  linx!: CollectionItem;
  stamp!: CollectionItem;

  selectedCollection = signal<Collection | null>(null);
  collectionItems = computed(() => {
    const allItems = this.selectedCollection()?.items;

    return allItems?.filter(
      item => item.name.toLocaleLowerCase().includes((
        this.search().toLocaleLowerCase()
      ))
    )
  });

  constructor() {
    this.coin = new CollectionItem();
    this.coin.name = 'Pièce de 1972';
    this.coin.description = 'Pièce de 50 centimes de francs.';
    this.coin.rarity = 'Commune';
    this.coin.image = 'img/coin1.jpg';
    this.coin.price = 170;

    this.linx = new CollectionItem();

    this.stamp = new CollectionItem();
    this.stamp.name = 'Vieux timbre';
    this.stamp.description = 'Un vieux timbre';
    this.stamp.rarity = 'Rare';
    this.stamp.image = 'img/timbre1.png';
    this.stamp.price = 555;

    const defaultCollection = new Collection();
    defaultCollection.title = 'Default Collection';
    defaultCollection.items = [
      this.coin,
      this.linx,
      this.stamp
    ];
    this.selectedCollection.set(defaultCollection);

  }

}
