import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from './service/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private profileService = inject(ProfileService);
  private activatedRoute = inject(ActivatedRoute);
  private subscriptions: Subscription[] = [];

  userData: any = {};
  isLoading: boolean = true;
  currentUserId: string | null = null;
  postList: any[] = [];

  ngOnInit(): void {
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUserProfile(): void {
    this.isLoading = true;
    
    const routeSub = this.activatedRoute.paramMap.subscribe((params) => {
      this.currentUserId = params.get('id');

      if (!this.currentUserId) {
        const savedUser = localStorage.getItem('socialUser');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            this.currentUserId = parsedUser._id;
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }

      if (this.currentUserId) {
        this.getProfileData(this.currentUserId);
        this.getUserPosts(this.currentUserId);
      } else {
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(routeSub);
  }

  getProfileData(userId: string): void {
    const profileSub = this.profileService.getUserProfile(userId).subscribe({
      next: (res) => {
        this.userData = res.data?.user || res.data || res.user || res || {};

        this.userData.followersCount = this.userData?.followers?.length || 0;
        this.userData.followingCount = this.userData?.following?.length || 0;
        this.userData.bookmarksCount = this.userData?.bookmarks?.length || 0;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(profileSub);
  }

  getUserPosts(userId: string): void {
    const postsSub = this.profileService.getUserPosts(userId).subscribe({
      next: (res) => {
        let allPosts: any[] = [];
        
        if (res.data?.posts) {
          allPosts = res.data.posts;
        } else if (Array.isArray(res)) {
          allPosts = res;
        } else if (res.posts) {
          allPosts = res.posts;
        }

        this.postList = allPosts.filter((post) => {
          const hasBody = post.body !== null && post.body !== undefined && post.body.toString().trim() !== '';
          const hasImage = post.image !== null && post.image !== undefined && post.image.toString().trim() !== '';
          return hasBody || hasImage;
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.isLoading = false;
      }
    });
    
    this.subscriptions.push(postsSub);
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.userData) {
          this.userData.photo = e.target.result;
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('photo', file);

      const uploadSub = this.profileService.uploadProfileImage(formData).subscribe({
        next: (res) => {
          if (this.currentUserId) {
            this.getProfileData(this.currentUserId);
          }
          if (res?.user?.photo) {
            this.userData.photo = res.user.photo;
          }
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        }
      });
      
      this.subscriptions.push(uploadSub);
    }
  }

  uploadCoverImage(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.userData) {
          this.userData.cover = e.target.result;
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('cover', file);

      const uploadSub = this.profileService.uploadCoverImage(formData).subscribe({
        next: (res) => {
          if (this.currentUserId) {
            this.getProfileData(this.currentUserId);
          }
          if (res?.user?.cover) {
            this.userData.cover = res.user.cover;
          }
        },
        error: (error) => {
          console.error('Error uploading cover:', error);
        }
      });
      
      this.subscriptions.push(uploadSub);
    }
  }
}