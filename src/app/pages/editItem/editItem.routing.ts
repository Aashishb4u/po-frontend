import {Routes, RouterModule}  from '@angular/router';
import {editItem} from './editItem.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: editItem,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
