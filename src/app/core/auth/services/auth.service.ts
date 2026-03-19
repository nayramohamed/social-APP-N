import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  signUp(data:object): Observable<any>{
    return this.httpClient.post(environment.baseUrl + '/users/signup', data)
  }

  signIn(data:object): Observable<any>{
    return this.httpClient.post(environment.baseUrl + '/users/signin', data)
  }

getFollowSuggestions(limit: number = 5): Observable<any> {
  return this.httpClient.get(environment.baseUrl + `/users/suggestions?limit=${limit}`); 
}

  changePassword(formData: object): Observable<any> {
  return this.httpClient.patch(environment.baseUrl + `/users/change-password`, formData);
}
  signOut(): void{
    localStorage.removeItem('socialToken');
    this.router.navigate(['/login']);
  }
}