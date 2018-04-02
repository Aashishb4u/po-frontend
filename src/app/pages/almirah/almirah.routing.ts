import {Routes, RouterModule}  from '@angular/router';
import {almirahComponent} from './almirah.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: almirahComponent,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
