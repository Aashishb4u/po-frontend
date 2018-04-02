import {NgModule}      from '@angular/core';
import {CommonModule}  from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgaModule} from '../../theme/nga.module';
import {Offering} from './offering.component';
import {routing}       from './offering.routing';
import { ChartsModule } from 'ng2-charts';
import { NgxGalleryModule } from 'ngx-gallery';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartsModule,
        NgaModule,
        NgxGalleryModule,
        routing
    ],
    declarations: [
        Offering
    ],
    providers: []
})
export class OfferingModule {
}
