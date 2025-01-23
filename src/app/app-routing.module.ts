import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { ProfileComponent } from './profile/profile.component';
import { FavoriteTwimpsComponent } from './profile/favorite-twimps/favorite-twimps.component';
import { MyTwimpsComponent } from './profile/my-twimps/my-twimps.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './login/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './core/auth-guard.service';
import { CreateTwimpComponent } from './create-twimp/create-twimp.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
    { path: 'create-twimp', component: CreateTwimpComponent, canActivate: [AuthGuardService] },
    {
        path: 'profile/:id', component: ProfileComponent,
        children: [
            { path: '', redirectTo: 'my-twimps', pathMatch: 'full' },
            { path: 'my-twimps', component: MyTwimpsComponent },
            { path: 'favorite-twimps', component: FavoriteTwimpsComponent },
            { path: 'edit', component: EditProfileComponent },
        ]
    },
    { path: '**', component: ErrorComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }