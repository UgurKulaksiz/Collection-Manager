import { Routes } from '@angular/router';
import { CollectionDetail } from './pages/collection-detail/collection-detail';
import { CollectionItemDetail } from './pages/collection-item-detail/collection-item-detail';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [{
  // 1er dictionnaire
  path: '',
  redirectTo: 'home', // redirectTo -> Permet de rediriger l'utilisateur vers 'home' par exemple
  pathMatch: 'full' // full -> Indique à Angular de prendre l'adresse complète et de la matcher avec le chemin d'accès
}, {
  // 2e dictionnaire
  path: 'home',
  component: CollectionDetail
}, {
  // 3e dictionnaire
  path: 'item',
  children: [{
    path: '',
    component: CollectionItemDetail
  }, {
    path: ':id',
    component: CollectionItemDetail
  }]
}, {
  path: '**',
    component: NotFound
}];
