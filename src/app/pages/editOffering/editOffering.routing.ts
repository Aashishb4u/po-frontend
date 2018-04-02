import {Routes, RouterModule}  from '@angular/router';
import {EditOffering} from './editOffering.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: EditOffering,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
