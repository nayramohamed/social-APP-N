import { AuthService } from './../../../../core/auth/services/auth.service';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-right',
  imports: [],
  templateUrl: './side-right.component.html',
  styleUrl: './side-right.component.css',
})
export class SideRightComponent implements OnInit {
  private readonly authService = inject(AuthService)
  showSuggestedFriends: boolean = false;
suggestedUsers: any[] = [];

ngOnInit(): void {
  this.getSuggestions();
}

getSuggestions(): void {
  this.authService.getFollowSuggestions(5).subscribe({
    next: (res) => {
      this.suggestedUsers = res.data.suggestions;
    },
  });
}
}
