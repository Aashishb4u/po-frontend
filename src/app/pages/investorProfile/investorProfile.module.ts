import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {MyDatePickerModule} from 'mydatepicker';
import {InvestorProfile} from './investorProfile.component';
import {routing}       from './investorProfile.routing';
import {Ng2SmartTableModule} from "ng2-smart-table";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        ReactiveFormsModule,
        Ng2SmartTableModule,
        MyDatePickerModule
    ],
    declarations: [
        InvestorProfile
    ],
    providers: []
})
export class InvestorProfileModule {
}
