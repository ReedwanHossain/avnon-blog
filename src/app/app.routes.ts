import { Routes } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { PreviewComponent } from './preview/preview.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'editor' },
  { path: 'editor', component: EditorComponent },
  { path: 'article/preview', component: PreviewComponent },
];
