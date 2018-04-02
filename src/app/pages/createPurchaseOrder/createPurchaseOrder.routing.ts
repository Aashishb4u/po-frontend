import {Routes, RouterModule}  from '@angular/router';
import {createPurchaseOrder} from './createPurchaseOrder.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: createPurchaseOrder,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
