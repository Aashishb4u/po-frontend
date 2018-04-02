import {Routes, RouterModule}  from '@angular/router';
import {Email} from './email.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: Email,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
