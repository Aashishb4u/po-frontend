import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {viewTags} from './viewTags.component';
import {routing}       from './viewTags.routing';
import {ModalModule} from 'ng2-modal';
import {Ng2SmartTableModule} from "ng2-smart-table";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        ModalModule,
        ReactiveFormsModule,
        Ng2SmartTableModule
    ],
    declarations: [
        viewTags
    ],
    providers: []
})
export class ViewTagsModule {
}
