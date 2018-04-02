import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Investor} from './investor.component';
describe('User', () => {
    let component: Investor;
    let fixture: ComponentFixture<Investor>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Investor]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Investor);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});