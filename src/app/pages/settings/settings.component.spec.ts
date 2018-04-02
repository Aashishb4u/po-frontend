import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {settings} from './settings.component';

describe('settings', () => {
    let component: settings;
    let fixture: ComponentFixture<settings>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [settings]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(settings);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
