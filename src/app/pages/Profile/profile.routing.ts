import {Routes, RouterModule}  from '@angular/router';
import {Profile} from './profile.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: Profile,
        children: [

        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
