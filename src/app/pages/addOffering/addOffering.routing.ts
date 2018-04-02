import {Routes, RouterModule}  from '@angular/router';
import {AddOffering} from './addOffering.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: AddOffering,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
