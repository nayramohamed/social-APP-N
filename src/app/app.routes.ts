import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';
import { ChangePasswordComponent } from './features/change-password/change-password.component';
import { DetailsComponent } from './features/details/details.component';
import { FeedComponent } from './features/feed/feed.component';
import { LoginComponent } from './features/login/login.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { NotificationComponent } from './features/notification/notification.component';
import { ProfileComponent } from './features/profile/profile.component';
import { RegisterComponent } from './features/register/register.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [

    { path: '', redirectTo: 'login' , pathMatch:'full'},
    {
        path: '', component: AuthLayoutComponent, canActivate:[guestGuard],
        children: [
            { path: 'login', component: LoginComponent , title: 'Login | Route Posts' },
            { path: 'register', component: RegisterComponent , title: 'Register | Route Posts'},
    ]},
    {
        path: '', component: MainLayoutComponent , canActivate:[authGuard], 
        children: [
            { path: 'feed', component: FeedComponent, title: 'Feed | Route Posts' },
            { path: 'profile', component: ProfileComponent, title: 'My Profile' },
            { path: 'profile/:id', component: ProfileComponent , title: 'Profile | Route Posts' },
            { path: 'notification', component: NotificationComponent , title: 'Notification | Route Posts' },
            { path: 'change', component: ChangePasswordComponent , title: 'Change password | Route Posts'},
            { path: 'details/:id', component: DetailsComponent , title: 'Details | Route Posts'},
            
        ]
    },
    {path:'**', component:NotfoundComponent , title: 'NotFound | Route Posts'}
];
