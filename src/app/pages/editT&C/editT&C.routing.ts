import {Routes, RouterModule}  from '@angular/router';
import {editTermsAndCondition} from './editT&C.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: editTermsAndCondition,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
