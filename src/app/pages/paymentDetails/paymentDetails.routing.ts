import {Routes, RouterModule}  from '@angular/router';
import {paymentDetails} from './paymentDetails.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: paymentDetails,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
