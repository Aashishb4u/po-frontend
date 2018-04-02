import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InvestorProfile} from './investorProfile.component';

describe('forgotPassword', () => {
    let component: InvestorProfile;
    let fixture: ComponentFixture<InvestorProfile>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InvestorProfile]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InvestorProfile);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
