import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {addUser} from './addUser.component';
import {routing}       from './addUser.routing';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgaModule,
        routing,
        ReactiveFormsModule
    ],
    declarations: [
        addUser
    ],
    providers: []
})
export class AddUserModule {
}
