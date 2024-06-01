import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css',
})
export class PreviewComponent {
  title: string | null = null;
  contentList: any[] = [];

  constructor(private route: Router) {
    const navigation = this.route.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.title = navigation.extras.state['title'];
      this.contentList = navigation.extras.state['contentList'];
    }
  }
}
