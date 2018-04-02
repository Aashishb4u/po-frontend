import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {Email} from './email.component';
import {routing}       from './email.routing';
// import { CKEditorModule } from 'ng2-ckeditor';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        // CKEditorModule,
        ReactiveFormsModule,
    ],
    declarations: [
        Email
    ],
    providers: []
})
export class EmailModule {
}
