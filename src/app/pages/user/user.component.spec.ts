import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {User} from './user.component';
describe('User', () => {
    let component: User;
    let fixture: ComponentFixture<User>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [User]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(User);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});