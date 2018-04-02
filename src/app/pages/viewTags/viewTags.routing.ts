import {Routes, RouterModule}  from '@angular/router';
import {viewTags} from './viewTags.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: viewTags,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
