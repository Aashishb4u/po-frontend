import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {inActiveUser} from './inActiveUser.component';

describe('inActiveUser', () => {
    let component: inActiveUser;
    let fixture: ComponentFixture<inActiveUser>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [inActiveUser]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(inActiveUser);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
