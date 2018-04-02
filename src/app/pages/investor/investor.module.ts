import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {Investor} from './investor.component';
import {routing}       from './investor.routing';
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
        Investor
    ],
    providers: []
})
export class InvestorModule {
}
