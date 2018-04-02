import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {editAlmirah} from './editAlmirah.component';
import {routing}       from './editAlmirah.routing';
import { TextMaskModule } from 'angular2-text-mask';
import {RlTagInputModule} from 'angular2-tag-input';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        RlTagInputModule,
        routing,
        ReactiveFormsModule,
        TextMaskModule
    ],
    declarations: [
        editAlmirah
    ],
    providers: []
})
export class editAlmirahModule {
}
