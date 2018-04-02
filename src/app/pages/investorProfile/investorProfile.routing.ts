import {Routes, RouterModule}  from '@angular/router';
import {InvestorProfile} from './investorProfile.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: InvestorProfile,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
