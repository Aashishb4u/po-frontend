import {Routes, RouterModule}  from '@angular/router';
import {BrowseOfferings} from './browseOfferings.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: BrowseOfferings,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
