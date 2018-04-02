import {Routes, RouterModule}  from '@angular/router';
import {editAlmirah} from './editAlmirah.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: editAlmirah,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
