import {Routes, RouterModule}  from '@angular/router';
import {editPurchaseOrder} from './editPurchaseOrder.component';
import {ModuleWithProviders} from '@angular/core';
export const routes: Routes = [
    {
        path: '',
        component: editPurchaseOrder,
        children: []
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
