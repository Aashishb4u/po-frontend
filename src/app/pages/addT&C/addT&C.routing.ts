import {Routes, RouterModule}  from '@angular/router';
import {addTermsAndCondition} from './addT&C.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: addTermsAndCondition,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
