import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {EditOffering} from './editOffering.component';

describe('Profile', () => {
    let component: EditOffering;
    let fixture: ComponentFixture<EditOffering>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditOffering]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditOffering);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
