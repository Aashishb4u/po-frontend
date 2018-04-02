import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {ButtonViewComponent, almirahComponent} from './almirah.component';
import {routing} from './almirah.routing';
import {ModalModule} from 'ng2-modal';
import { Ng2SmartTableModule } from "ng2-smart-table";
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
        NgxPaginationModule,
    ],
    // declarations: [
    //     itemComponent,
    // ],
    declarations: [
        almirahComponent, ButtonViewComponent
    ],
    entryComponents: [
        ButtonViewComponent
    ],
    providers: [],
})
export class almirahModule {
}
