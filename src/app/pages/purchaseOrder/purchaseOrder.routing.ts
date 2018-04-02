import {Routes, RouterModule}  from '@angular/router';
import {purchaseOrder} from './purchaseOrder.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: purchaseOrder,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
