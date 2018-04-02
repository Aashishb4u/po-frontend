import {Routes, RouterModule}  from '@angular/router';
import {ManageOfferings} from './offerings.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: ManageOfferings,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
