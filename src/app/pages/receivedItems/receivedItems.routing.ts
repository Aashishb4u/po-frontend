import {Routes, RouterModule}  from '@angular/router';
import {receivedItems} from './receivedItems.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: receivedItems,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
