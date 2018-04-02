import {Routes, RouterModule}  from '@angular/router';
import {viewTermsAndConditionsComponent} from './viewTermsAndConditions.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: viewTermsAndConditionsComponent,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
