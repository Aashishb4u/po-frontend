import {Routes, RouterModule}  from '@angular/router';
import {addUser} from './addUser.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: addUser,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
