import {Routes, RouterModule}  from '@angular/router';
import {itemComponent} from './item.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: itemComponent,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
