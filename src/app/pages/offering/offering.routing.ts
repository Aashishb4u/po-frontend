import {Routes, RouterModule}  from '@angular/router';
import {Offering} from './offering.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: Offering,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
