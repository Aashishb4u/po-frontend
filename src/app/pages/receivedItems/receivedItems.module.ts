import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {ButtonViewComponent, receivedItems} from './receivedItems.component';
import {routing} from './receivedItems.routing';
import {ModalModule} from 'ng2-modal';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng2SmartTableModule } from "ng2-smart-table";
import {NgxPaginationModule} from 'ngx-pagination';
import {MyDatePickerModule} from 'mydatepicker';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        MyDatePickerModule,
        ModalModule,
        TextMaskModule,
        ReactiveFormsModule,
        Ng2SmartTableModule,
        NgxPaginationModule,
    ],
    // declarations: [
    //     itemComponent,
    // ],
    declarations: [
        receivedItems, ButtonViewComponent
    ],
    entryComponents: [
        ButtonViewComponent
    ],
    providers: [],
})
export class receivedItemsDetailsModule {
}
