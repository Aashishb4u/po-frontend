import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {addAlmirah} from './addAlmirah.component';
import {routing}       from './addAlmirah.routing';
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
        addAlmirah
    ],
    providers: []
})
export class addAlmirahModule {
}
