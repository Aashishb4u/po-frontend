import {Routes, RouterModule}  from '@angular/router';
import {emailVerificationConfirmation} from './emailVerificationConfirmation.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: emailVerificationConfirmation
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);



