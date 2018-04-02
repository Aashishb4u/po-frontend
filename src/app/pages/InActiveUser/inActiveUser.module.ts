import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {inActiveUser} from './inActiveUser.component';
import {routing}       from './inActiveUser.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {ModalModule} from 'ng2-modal';
import {NgxPaginationModule} from 'ngx-pagination'
@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        routing,
        Ng2SmartTableModule,
        ModalModule,
        NgxPaginationModule
    ],
    declarations: [
        inActiveUser
    ],
    providers: []
})
export class inActiveUserModule {
}
