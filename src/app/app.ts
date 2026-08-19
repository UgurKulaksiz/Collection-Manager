import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';
import { CollectionItemCard } from './components/collection-item-card/collection-item-card';
import { CollectionItem } from './models/collection-item';
import { SearchBar } from './components/search-bar/search-bar';
import { Collection } from './models/collection';
import { CollectionService } from './services/collection-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [CollectionItemCard, SearchBar],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  collectionService = inject(CollectionService);
  count = 0;
  search = model('');

  collection!: Collection;
  coin!: CollectionItem;
  linx!: CollectionItem;
  stamp!: CollectionItem;

  selectedCollection = signal<Collection | null>(null);
  displayedItems = computed(() => {
    const allItems = this.selectedCollection()?.items || [];

    return allItems.filter(item =>
      item.name.toLocaleLowerCase().includes(
        this.search().toLocaleLowerCase()
      )
    );
  });

  constructor() {
    const allCollections = this.collectionService.getAll();

    // Si il y a des collections
    if (allCollections.length > 0) {
      // Sélectionner la première collection [0]
      this.selectedCollection.set(allCollections[0]);
    }
  }

  addGenericItem() {
    // Récupérer la collection sélectionnée
    const collection = this.selectedCollection();

    if (collection) {
      const storedCollection = this.collectionService.addItem(
        collection, new CollectionItem()
      );
      // Assigner cette nouvelle collection telle qu'elle est stockée dans notre service
      this.selectedCollection.set(storedCollection);
    }
  }

}
