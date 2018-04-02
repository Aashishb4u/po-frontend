import {Routes, RouterModule}  from '@angular/router';
import {inActiveUser} from './inActiveUser.component';
const routes: Routes = [
    {
        path: '',
        component: inActiveUser,
        children: []
    }
];

export const routing = RouterModule.forChild(routes);
