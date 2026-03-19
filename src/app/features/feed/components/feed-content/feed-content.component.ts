import { Post } from './../../../../core/models/post.interface';
import { Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { PostsService } from '../../../../core/services/posts.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from '././components/comments/comments.component';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-feed-content',
  imports: [ReactiveFormsModule, CommentsComponent, RouterLink, TimeAgoPipe],
  templateUrl: './feed-content.component.html',
  styleUrl: './feed-content.component.css',
})
export class FeedContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  currentUser = JSON.parse(localStorage.getItem('socialUser')!);

  content: FormControl = new FormControl('');
  shareContent: FormControl = new FormControl('');
  privacy: FormControl = new FormControl('public');
  postList: Post[] = [];
  saveFile: File | null = null;
  imgUrl: string | ArrayBuffer | null | undefined;
  isEditMode: boolean = false;
  editPostId: string = '';

  ngOnInit(): void {
    this.getAllPostData();
  }

  confirmShare(e: Event): void {
    e.preventDefault();
    if (!this.selectedPostForShare) return;

    const shareData = {
      body: this.shareContent.value || ' ',
    };

    const postId = this.selectedPostForShare._id;

    this.postsService.sharePost(postId, shareData).subscribe({
      next: (res) => {
        console.log('Success!', res);
        this.shareContent.reset();
        this.closeShareModal();
        this.getAllPostData();
      },
      error: (err) => {
        console.error('Error!', err);
      },
    });
  }

  @ViewChildren(CommentsComponent) commentComponents!: QueryList<CommentsComponent>;

  toggleComments(postId: string) {
    const targetComponent = this.commentComponents.find((comp) => comp.postId === postId);

    if (targetComponent) {
      targetComponent.showAllComments = !targetComponent.showAllComments;
      targetComponent.isSectionVisible = !targetComponent.isSectionVisible;
    }
  }

  getAllPostData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        this.postList = res.data.posts.map((post: any) => {
          return {
            ...post,
            isLiked: post.likes
              ? post.likes.some((u: any) => {
                  const likedUserId = u._id || u;
                  return likedUserId === this.currentUser?._id;
                })
              : false,
            likesCount: post.likesCount || (post.likes ? post.likes.length : 0),
          };
        });
      },
    });
  }

  changeImg(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.saveFile = input.files[0];

      const fileReader = new FileReader();
      fileReader.readAsDataURL(this.saveFile);
      fileReader.onload = (e) => {
        if (e.target?.result) {
          this.imgUrl = e.target?.result;
        }
      };
      input.value = '';
    }
  }

  removeImg(): void {
    this.imgUrl = '';
    this.saveFile = null;
  }

  submitForm(e: Event): void {
    e.preventDefault();
    const formData = new FormData();

    if (this.content.value) {
      formData.append('body', this.content.value);
    }
    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }
    if (this.saveFile) {
      formData.append('image', this.saveFile);
    }

    this.postsService.createPosts(formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostData();
          this.resetForm();
        }
      },
    });
  }

  resetForm(): void {
    this.content.reset();
    this.privacy.setValue('public');
    this.imgUrl = '';
    this.saveFile = null;

    this.isEditMode = false;
    this.editPostId = '';
  }

  deletePostItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.getAllPostData();
        }
      },
    });
  }

  EditPost(post: any): void {
    this.isEditMode = true;
    this.editPostId = post._id;

    this.content.setValue(post.body);
    this.privacy.setValue(post.privacy);

    if (post.image) {
      this.imgUrl = post.image;
    } else {
      this.imgUrl = '';
    }

    this.saveFile = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePrivacy(postId: string, event: any): void {
    const newPrivacy = event.target.value;

    const formData = new FormData();
    formData.append('privacy', newPrivacy);

    this.postsService.updatePost(postId, formData).subscribe({
      next: (res) => {
        const postIndex = this.postList.findIndex((p) => p._id === postId);
        if (postIndex !== -1) {
          this.postList[postIndex].privacy = newPrivacy;
        }
      },
    });
  }

  updatePost(e: Event): void {
    e.preventDefault();

    if (!this.editPostId) return;

    const formData = new FormData();
    if (this.content.value) formData.append('body', this.content.value);
    if (this.privacy.value) formData.append('privacy', this.privacy.value);
    if (this.saveFile) formData.append('image', this.saveFile);

    this.postsService.updatePost(this.editPostId, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.getAllPostData();
        this.resetForm();
      },
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  selectedPostForShare: any = '';
  isShareModalOpen: boolean = false;

  openShareModal(post: any): void {
    this.selectedPostForShare = post;
    this.isShareModalOpen = true;
  }

  closeShareModal(): void {
    this.isShareModalOpen = false;
    this.selectedPostForShare = null;
  }

  onLikeClick(post: any) {
    this.postsService.changeLike(post._id).subscribe({
      next: (res) => {
        console.log('Response:', res);

        if (res.message === 'success') {
          post.isLiked = !post.isLiked;

          if (post.isLiked) {
            post.likesCount++;
          } else {
            post.likesCount--;
          }
        }
      },
    });
  }
}
