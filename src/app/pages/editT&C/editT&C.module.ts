import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {editTermsAndCondition} from './editT&C.component';
import {routing}       from './editT&C.routing';
import { TextMaskModule } from 'angular2-text-mask';
import {RlTagInputModule} from 'angular2-tag-input';
import { CKEditorModule } from 'ng2-ckeditor';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        RlTagInputModule,
        routing,
        ReactiveFormsModule,
        TextMaskModule,
        CKEditorModule
    ],
    declarations: [
        editTermsAndCondition
    ],
    providers: []
})
export class editTermsAndConditionModule {
}
