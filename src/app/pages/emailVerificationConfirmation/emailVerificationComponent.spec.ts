import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {emailVerificationConfirmation} from './emailVerificationConfirmation.component';

describe('forgotPassword', () => {
    let component: emailVerificationConfirmation;
    let fixture: ComponentFixture<emailVerificationConfirmation>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [emailVerificationConfirmation]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(emailVerificationConfirmation);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
