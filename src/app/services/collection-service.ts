import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { CollectionItem } from '../models/collection-item';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private collections: Collection[] = []; // collections -> Tableau de collections
  private currentId = 1; // currentId -> Va avoir l'identifiant de la prochaine collection qu'on va stocké
  private currentItemIndex: { [key: number]: number } = {}; // Les index des différents items. 1 index par collection

  constructor() {
    this.load();
  }

  private save() {
    localStorage.setItem('collections', JSON.stringify(this.collections));
  }

  private load() {
    const collectionsJson = localStorage.getItem('collections');

    // Vérifier si la clé 'collections' existe déjà dans le localStorage
    if (collectionsJson) {
      // 1. DÉSÉRIALISATION ET RECONSTITUTION DES CLASSES
      // JSON.parse() transforme la chaîne brute en objets JavaScript anonymes.
      // .map() permet de reconvertir ces objets bruts en de véritables instances de nos classes TS.
      this.collections = JSON.parse(collectionsJson).map((collectionJson: any) => {
        // Crée une vraie instance de 'Collection' et y recopie toutes les propriétés issues du JSON
        const collection = Object.assign(new Collection(), collectionJson);
        // Récupère le tableau d'items du JSON (ou un tableau vide s'il n'y en a pas)
        const itemsJson = collectionJson['items'] || [];

        // Reconvertit chaque item anonyme en une vraie instance du modèle 'CollectionItem'
        collection.items = itemsJson.map((item: any) => Object.assign(new CollectionItem(), item));

        return collection;
      });

      // 2. RETROUVER LE PROCHAIN ID POUR UNE NOUVELLE COLLECTION
      // .map() extrait tous les ID des collections existantes (ex: [1, 2, 3])
      // Math.max(...) trouve le plus grand ID de la liste (ex: 3)
      // On ajoute 1 (3 + 1 = 4) pour que la prochaine collection créée reçoive un ID unique (4)
      this.currentId = Math.max(...this.collections.map((collection) => collection.id)) + 1;

      // 3. RETROUVER LE PROCHAIN ID D'ITEM POUR CHAQUE COLLECTION
      // .reduce() parcourt les collections et crée un dictionnaire { idCollection: prochainIdItem }
      // Exemple de résultat : { 1: 4, 2: 2 } (dans la collection 1, le prochain objet aura l'ID 4)
      this.currentItemIndex = this.collections.reduce(
        (indexes: { [key: number]: number }, collection) => {
          indexes[collection.id] = Math.max(...collection.items.map((item) => item.id)) + 1;
          return indexes;
        }, {} // {} est l'objet vide de départ dans lequel on remplit les paires (idCollection -> prochainIdItem)
      );
    } else {
      // Si on ne trouve pas de collections stockées, on va générer des dummy data et les sauvegarder
      this.generateDummyData();
      this.save();
    }
  }

  generateDummyData() {
    const coin = new CollectionItem();
    coin.name = 'Pièce de 1972';
    coin.description = 'Pièce de 50 centimes de francs.';
    coin.rarity = 'Commune';
    coin.image = 'img/coin1.jpg';
    coin.price = 170;

    const stamp = new CollectionItem();
    stamp.name = 'Vieux timbre';
    stamp.description = 'Un vieux timbre';
    stamp.rarity = 'Rare';
    stamp.image = 'img/timbre1.png';
    stamp.price = 555;

    const linx = new CollectionItem();

    const defaultCollection = new Collection();
    defaultCollection.title = 'Collection mix';
    const storedCollection = this.add(defaultCollection);
    this.addItem(storedCollection, coin);
    this.addItem(storedCollection, linx);
    this.addItem(storedCollection, stamp);
  }

  // Obtenir toutes les collections
  getAll(): Collection[] {
    return this.collections.map((collection) => collection.copy());
  }

  // Obtenir une collection
  get(collectionId: number): Collection | null {
    const storedCopy = this.collections.find((collection) => collection.id === collectionId);

    if (!storedCopy) return null;

    return storedCopy.copy();
  }

  // Ajouter une collection
  add(collection: Omit<Collection, 'id' | 'items'>): Collection {
    const storedCopy = collection.copy();
    storedCopy.id = this.currentId;
    this.collections.push(storedCopy);

    this.currentItemIndex[storedCopy.id] = 1;
    this.currentId++;

    this.save();

    return storedCopy.copy(); // Retourne une copy de ce qu'on a stocké
  }

  // Mettre à jour une collection
  update(collection: Collection, item: CollectionItem) {
    const storedCollection = this.collections.find(
      (storedCollection) => storedCollection.id === collection.id,
    );

    if (!storedCollection) return null;

    const storedItemIndex = storedCollection.items.findIndex(
      (storedItem) => storedItem.id === item.id,
    );

    if (storedItemIndex === -1) return null;

    storedCollection.items[storedItemIndex] = item.copy();
    this.save();
    return storedCollection.copy();
  }

  delete(collectionId: number): void {
    this.collections = this.collections.filter(
      collection => collection.id !== collectionId
    );

    this.save();
  }

  // Ajouter un item à partir d'une collection
  addItem(collection: Collection, item: CollectionItem): Collection | null {
    const storedCollection = this.collections.find((collection) => collection.id === collection.id);

    if (!storedCollection) return null;

    const storedItem = item.copy();
    storedItem.id = this.currentItemIndex[collection.id];
    storedCollection.items.push(storedItem);

    this.currentItemIndex[collection.id]++;
    this.save();

    return storedCollection.copy();
  }

  // Mettre à jour un item à partir d'une collection
  updateItem(collection: Collection, item: CollectionItem) {
    const storedCollection = this.collections.find(
      (storedCollection) => storedCollection.id === collection.id,
    );

    if (!storedCollection) return null;

    const storedItemIndex = storedCollection.items.findIndex(
      (storedItem) => storedItem.id === item.id,
    );

    if (storedItemIndex === -1) return null;

    storedCollection.items[storedItemIndex] = item.copy();
    this.save();

    return storedCollection.copy();
  }

  // Supprimer un item à partir d'une collection
  deleteItem(collectionId: number, itemId: number): Collection | null {
    const storedCollection = this.collections.find(
      (storedCollection) => storedCollection.id === collectionId,
    );

    if (!storedCollection) return null;

    storedCollection.items = storedCollection.items.filter(
      item => item.id === itemId
    );

    this.save();

    return storedCollection.copy();
  }
}
