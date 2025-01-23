import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../core/auth-guard.service';

import { DashboardComponent } from './dashboard.component';

const dashboardRoutes: Routes = [
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuardService]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(dashboardRoutes)
    ]
})
export class DashboardRoutingModule { }
