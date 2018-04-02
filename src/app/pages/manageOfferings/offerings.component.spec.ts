import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Offerings} from './offerings.component';

describe('Offerings', () => {
    let component: Offerings;
    let fixture: ComponentFixture<Offerings>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Offerings]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Offerings);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
