import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);
  
  getNotifications(unread: boolean = false): Observable<any> {
  return this.httpClient.get(environment.baseUrl + `/notifications?unread=${unread}&page=1&limit=10`);
}

}
