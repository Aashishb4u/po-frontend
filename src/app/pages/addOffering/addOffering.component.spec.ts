import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOffering } from './addOffering.component';

describe('Profile', () => {
    let component: AddOffering;
    let fixture: ComponentFixture<AddOffering>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddOffering],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddOffering);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
