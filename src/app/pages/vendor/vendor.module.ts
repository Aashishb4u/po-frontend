import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {ButtonViewComponent, VendorComponent} from './vendor.component';
import {routing}       from './vendor.routing';
import {ModalModule} from 'ng2-modal';
import {Ng2SmartTableModule} from "ng2-smart-table";
import {NgxPaginationModule} from 'ngx-pagination'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        ModalModule,
        ReactiveFormsModule,
        Ng2SmartTableModule,
        NgxPaginationModule
    ],
    declarations: [
        VendorComponent, ButtonViewComponent
    ],
    entryComponents: [
        ButtonViewComponent
    ],
    providers: []
})
export class VendorModule {
}
