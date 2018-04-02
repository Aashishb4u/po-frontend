import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Offering} from './offering.component';
describe('Dashboard', () => {
    let component: Offering;
    let fixture: ComponentFixture<Offering>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Offering]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Offering);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});