import {Component, ViewContainerRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms'
import {LocalDataSource} from "ng2-smart-table";
import {Router}  from '@angular/router';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {EmailValidator} from "../../theme/validators/email.validator";
import {Modal} from 'ng2-modal';
import {EqualPasswordsValidator} from "../../theme/validators/equalPasswords.validator";
import {DatePipe} from '@angular/common';

@Component({
    selector: 'offering',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./offerings.scss'],
    templateUrl: './offerings.html'
})

export class ManageOfferings {
    // @ViewChild('fileUpload') fileUpload;
    // @ViewChild('confirmUserChangePasswordModal') confirmUserChangePasswordModal: Modal;
    //
    form: FormGroup;
    // changePasswordForm: FormGroup;
    // getUserData: any;
    // imageUrl: string;
    // changePasswordData: any;
    // showError: boolean = false;
    viewAllComponent: boolean = true;
    draftComponent: boolean = false;
    activeComponent: boolean = false;
    completedComponent: boolean = false;
    failedComponent: boolean = false;
    isSelectedValue = 'view-all';
    searchString: string;
    status: string = '';
    offeringsList: any = [];
    searchBox: string = '';

    constructor(private router: Router, private adminServices: ApplicationAdminServices, private fb: FormBuilder,
                private authentication: AuthenticationHelper, private appService: ApplicationAdminServices,
                public toastr: ToastsManager, private spinner: BaThemeSpinner, vRef: ViewContainerRef,
                private _spinner: BaThemeSpinner, private datePipe: DatePipe) {
        this.toastr.setRootViewContainerRef(vRef);
        this.authentication.setChangedContentTopText('Manage Offerings');
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.getAllOfferings();
    }

    /**
     * To get all offerings list
     */
    getAllOfferings() {
        this.spinner.show();
        let searchValue;
        let data = {
            search_string: this.status
        };
        if (typeof data.search_string !== 'undefined') {
            searchValue = '?status=' + data.search_string;
        } else {
            searchValue = '';
        }
        this.adminServices.getOfferings(searchValue).subscribe(
            data => this.getOfferingsSuccess(data),
            error => this.getOfferingsFail(error)
        );
    }

    /**
     * If get all offerings success
     * @param data
     */
    getOfferingsSuccess(data) {
        this.spinner.hide();
        if (data.success.status === 1) {
            this.offeringsList = [];
            data.success.data.deals.forEach(offeringInfo => {
                let dataObject = {
                    id: offeringInfo._id,
                    type: offeringInfo.type,
                    location: 'NA',
                    launched: this.valuePrepareFunctionWithDateAndTime(offeringInfo.createdAt),
                    goal: offeringInfo.offeringAmount,
                    projectOwner: offeringInfo.issuer,
                    progress: '50',
                    progressDollarValue: offeringInfo.percentageRaised
                };
                this.offeringsList.push(dataObject);
            });
        }
    }

    /**
     * if get all offerings fail
     * @param Error
     */
    getOfferingsFail(Error) {
        this.spinner.hide();
        if (Error.error && Error.error.message) {
            this.toastr.error(Error.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    /**
     * To call API for filtering offerings by search term.
     */
    searchOfferings(value) {
        this.spinner.show();
        let searchValue = '';

        if (value && value.trim()) {
            searchValue = '?status=' + this.status + '&&search_string=' + value.trim();
        } else if (value && value.trim() && !this.status) {
            searchValue = '?search_string=' + value.trim();
        }


        this.adminServices.getOfferings(searchValue).subscribe(
            data => this.getOfferingsSuccess(data),
            error => this.getOfferingsFail(error)
        );
    }

    changeTab(id) {
        this.isSelectedValue = id;
        if (id !== "view-all") {
            this.status = id;
        } else {
            this.status = '';
        }
        this.searchBox = '';
        this.getAllOfferings();

        if (id == "view-all") {
            this.viewAllComponent = true;
            this.activeComponent = false;
            this.completedComponent = false;
            this.failedComponent = false;
            this.draftComponent = false;
        } else if (id == "draft") {
            this.draftComponent = true;
            this.viewAllComponent = false;
            this.activeComponent = false;
            this.completedComponent = false;
            this.failedComponent = false;
        } else if (id == "active") {
            this.activeComponent = true;
            this.viewAllComponent = false;
            this.completedComponent = false;
            this.failedComponent = false;
            this.draftComponent = false;
        } else if (id == "completed") {
            this.completedComponent = true;
            this.viewAllComponent = false;
            this.activeComponent = false;
            this.failedComponent = false;
            this.draftComponent = false;
        } else {
            this.failedComponent = true;
            this.viewAllComponent = false;
            this.activeComponent = false;
            this.completedComponent = false;
            this.draftComponent = false;
        }
    }

    // Navigates to add offering page.
    navigateToAddOffering() {
        this.router.navigate(['/add-offering']);
    }

    // Navigates to edit offering page.
    navigateToEditSpecificOffering(offeringValue) {
        this.router.navigate(['/edit-offering'], {queryParams: {id: offeringValue.id}});
    }

    /**
     * To format date
     */
    valuePrepareFunctionWithDateAndTime(date) {
        if (date == null) {
            return null;
        } else {
            const raw = new Date(date);
            const formatted = this.datePipe.transform(raw, 'dd MMM yyyy HH:mm');
            return formatted;
        }
    }
}
