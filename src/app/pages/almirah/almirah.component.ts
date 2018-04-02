import {
    Component, ViewContainerRef, ViewChild, ViewEncapsulation, ViewChildren, OnInit,
    EventEmitter, Output, Input
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router} from '@angular/router';
import {LocalDataSource, ViewCell} from 'ng2-smart-table/index';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {PaginationService} from "../../appServices/paginationService";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {BlankSpaceValidator} from "../../theme/validators/blank.validator";
import {Modal} from 'ng2-modal';
import {EqualPasswordsValidator} from "../../theme/validators/equalPasswords.validator";
import {Subject} from "rxjs/Subject";
import {parseTimeExpression} from "@angular/animations/browser/src/util";

@Component({
    selector: 'category-view',
    styleUrls: ['../item/item.scss'],
    template: `
    <span *ngFor="let value of this.renderValue ">
        <span class="tagsSmart">{{value}} </span>
    </span>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
    renderValue: any = [];

    @Input() value: any;
    @Input() rowData: any;

    @Output() save: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.value.forEach((val) => {
            if (val) {
                this.renderValue.push(val);
            }
        });
    }

    onClick() {
        this.save.emit(this.rowData);
    }
}


@Component({
    selector: 'almirah',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./almirah.scss'],
    templateUrl: './almirah.html',
    providers: [PaginationService]
})

export class almirahComponent {
    @ViewChild('fileUpload') fileUpload;
    @ViewChild('deleteVendorModal') deleteVendorModal: Modal;
    @ViewChildren('firstName') firstField;
    source: LocalDataSource = new LocalDataSource();

    form: FormGroup;
    changePasswordForm: FormGroup;
    getUserData: any;
    almirahId: any;
    itemList: any = [];
    almirahList: any = [];
    totalCount: any;
    modelChanged: Subject<string> = new Subject<string>();
    searchvalue: any;
    perPage: any = 10;
    current_page: any = 1;
    imageUrl: string;
    showError: boolean = false;
    settingComponent: boolean = true;
    passwordComponent: boolean = false;
    notificationComponent: boolean = false;
    accreditionComponent: boolean = false;

    settings: any = {
        mode : 'external',
        actions: {
            columnTitle: 'Actions',
        },
        columns: {
            name: {
                title: 'Almirah Name',
            },
            description: {
                title: 'Almirah Description',
            },
        },
        add: {
            addButtonContent: '',
            createButtonContent: '',
            cancelButtonContent: '',
            confirmCreate: true,
        },
        edit: {
            editButtonContent: '<i class="ion-edit" title="Edit Items"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true,
        },
        delete: {
            deleteButtonContent: '<i class="ion-trash-b" title="Delete Items"></i>',
            confirmDelete: true,
        },
    };

    constructor(private router: Router,
                private pageServices: PaginationService,
                private fb: FormBuilder,
                private authentication: AuthenticationHelper,
                private appService: ApplicationAdminServices,
                public toastr: ToastsManager,
                vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Almirah');

        this.modelChanged
            .debounceTime(300) // wait 300ms after the last event before emitting last event
            .distinctUntilChanged() // only emit if value is different from previous value
            .subscribe(str => {
                this.getItemsBySearch(str.trim());
            });
    }

    getPageData(page) {
        this.current_page = page;
        this.getItemLocationDetails(page);
    }

    changedItem(event: string) {
        this.modelChanged.next(event);
    }

    ngOnInit() {
        this.getItemLocationDetails(this.current_page);
    }

    triggers() {
        this.fileUpload.nativeElement.click();
    }

    addItemLocation() {
        this.router.navigate(['addAlmirah']);
    }

    editItemLocation(event) {
        this.router.navigate(['editAlmirah'], { queryParams: { id: event.data.id } });
    }

    deleteItemLocation(event) {
        this.almirahId = event.data.id;
        this.deleteVendorModal.open();
    }

    deleteItemLocationFinal() {
        this.deleteVendorModal.close();
        this._spinner.show();
        const deleteId = {
            id: this.almirahId,
        };

        this.appService.deleteItemLocation(deleteId).subscribe(
            data => this.deleteVendorSuccess(data),
            error => this.deleteVendorFail(error),
        );
    }

    deleteVendorSuccess(data) {
        this._spinner.hide();
        this.deleteVendorModal.close();
        if (data.data.code < 0) {
            this.toastr.error('Almirah deleted failed');
        } else {
            this.toastr.success('Almirah deleted successfully');
            this.getItemLocationDetails(this.current_page);
        }
    }

    deleteVendorFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    getItemLocationDetails(page) {
        this._spinner.show();
        this.pageServices.getItemLocation(page).subscribe(
            data => this.getVendorsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getItemsBySearch(event) {
        this._spinner.show();
        const searchValue: any = { search_input: event };
        this.pageServices.getItemsBySearch(searchValue, this.current_page).subscribe(
            data => this.getVendorsSuccess(data),
            error => this.getVendorsFail(error),
        );
    }

    getVendorsSuccess(res) {
        let response: any  = res.data[0];
        this._spinner.hide();
        if (res.data.code < 0) {
            this.toastr.error('Failed to get almirah details');
        } else {
            this.almirahList = Array.from(response.data);
            this.source.reset();
            this.source.load(response.data);
            this.totalCount = response.total;
        }

    }

    getVendorsFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }
}
