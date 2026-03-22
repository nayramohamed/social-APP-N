import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from './../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  userName: string = ''; 
  userImage: string = '';

  ngOnInit(): void {
    initFlowbite();
    this.getUserData();
  }

  logOut(): void{
    this.authService.signOut();
  }
  getUserData(): void {
    const savedUser = localStorage.getItem('socialUser'); 
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      this.userName = parsedUser.name;
      this.userImage = parsedUser.photo; 
    }
  }
}
