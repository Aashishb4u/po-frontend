import {Routes, RouterModule}  from '@angular/router';
import {settings} from './settings.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: settings,
    },
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
