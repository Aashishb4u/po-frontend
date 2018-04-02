import {Routes, RouterModule}  from '@angular/router';
import {addAlmirah} from './addAlmirah.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: addAlmirah,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
