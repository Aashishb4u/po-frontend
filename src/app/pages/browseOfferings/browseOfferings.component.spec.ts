import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowseOfferings} from './browseOfferings.component';

describe('Profile', () => {
    let component: BrowseOfferings;
    let fixture: ComponentFixture<BrowseOfferings>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BrowseOfferings]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BrowseOfferings);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
