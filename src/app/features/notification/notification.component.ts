import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationService } from './service/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  private notificationService = inject(NotificationService);

  notifications: any[] = [];
  filter: 'all' | 'unread' = 'all';
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    const unreadStatus = this.filter === 'unread' ? true : false;

    this.notificationService.getNotifications(unreadStatus).subscribe({
      next: (res: any) => {
        this.notifications = res.data.notifications;

        this.isLoading = false;
      },
    });
  }

  changeFilter(type: 'all' | 'unread'): void {
    if (this.filter !== type) {
      this.filter = type;
      this.loadNotifications();
    }
  }
}
