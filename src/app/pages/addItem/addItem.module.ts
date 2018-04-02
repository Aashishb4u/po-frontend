import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {addItem} from './addItem.component';
import {routing}       from './addItem.routing';
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
        addItem
    ],
    providers: []
})
export class addItemModule {
}
