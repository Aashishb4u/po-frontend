import {Routes, RouterModule}  from '@angular/router';
import {Investor} from './investor.component';
const routes: Routes = [
    {
        path: '',
        component: Investor,
        children: []
    }
];

export const routing = RouterModule.forChild(routes);
