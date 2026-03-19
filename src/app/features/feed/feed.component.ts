import { Component } from '@angular/core';
import { FeedContentComponent } from './components/feed-content/feed-content.component';
import { SideLeftComponent } from './components/side-left/side-left.component';
import { SideRightComponent } from './components/side-right/side-right.component';

@Component({
  selector: 'app-feed',
  imports: [FeedContentComponent,SideLeftComponent,SideRightComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent {

}
