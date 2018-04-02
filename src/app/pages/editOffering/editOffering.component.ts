import {Component, ViewContainerRef, ViewEncapsulation, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router, ActivatedRoute}  from '@angular/router';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {OFFERINGS_CONSTANTS} from "../constants/addOffering";
import {IMyOptions, IMyDate} from "mydatepicker";
import {UtilityHelper} from '../shared/utility';

@Component({
    selector: 'editOffering',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./editOffering.scss'],
    templateUrl: './editOffering.html'
})

export class EditOffering {
    offeringForm: FormGroup;
    showError: boolean = false;
    dateError: boolean = false;
    fromDate: string = '';
    toDate: string = '';
    submitted: boolean = false;
    issuerData: any = OFFERINGS_CONSTANTS.ISSUER_LIST.issuersList;
    typeOfOfferings: any = OFFERINGS_CONSTANTS.TYPE_OF_OFFERING_LIST.typeOfOfferingList;
    issueTypeList: any = OFFERINGS_CONSTANTS.ISSUE_TYPES.typeOfIssueList;
    dealTypeList: any = OFFERINGS_CONSTANTS.DEAL_TYPES.typeOfDealList;
    investmentTypeList: any = OFFERINGS_CONSTANTS.INVESTMENT_TYPES.typeOfInvestmentList;
    @ViewChildren('isIssuer') isIssuer;

    myDatePickerOptions: IMyOptions = {
        dateFormat: 'mm/dd/yyyy',
        todayBtnTxt: 'Today',
        dayLabels: {su: 'S', mo: 'M', tu: 'T', we: 'W', th: 'T', fr: 'F', sa: 'S'},
        monthLabels: {
            1: 'Jan',
            2: 'Feb',
            3: 'Mar',
            4: 'Apr',
            5: 'May',
            6: 'Jun',
            7: 'Jul',
            8: 'Aug',
            9: 'Sep',
            10: 'Oct',
            11: 'Nov',
            12: 'Dec'
        },
        showTodayBtn: false,
        inline: false,
        firstDayOfWeek: 'su',
        editableDateField: false,
        showClearDateBtn: false,
        openSelectorOnInputClick: true,
        disableUntil: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate() - 1
        },
    };
    offeringId: string = '';

    constructor(private router: Router, private adminServices: ApplicationAdminServices, private fb: FormBuilder,
                private authentication: AuthenticationHelper, private appService: ApplicationAdminServices,
                public toastr: ToastsManager, vRef: ViewContainerRef, private _spinner: BaThemeSpinner,
                private routes: ActivatedRoute, private utility: UtilityHelper) {
        this.offeringId = this.routes.snapshot.queryParams['id'];
        this.authentication.setChangedContentTopText('Edit Offering');
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.editOfferingInfo();
        this.offeringForm.controls['typeOfOffering'].patchValue("1");
        this.offeringForm.controls['issueType'].patchValue("1");
        this.offeringForm.controls['dealType'].patchValue("1");
        this.offeringForm.controls['investmentType'].patchValue("1");
        this.getOfferingsDetails();
    }

    ngAfterViewInit() {
        this.isIssuer.first.nativeElement.focus();
    }

    /**
     * To set user user data initially on page load.
     */
    setOfferingData(offeringData) {
        if (offeringData) {
            if (offeringData.issuer) {
                this.offeringForm.controls['selectIssuer'].setValue(offeringData.issuer);
            }
            if (offeringData.issueName) {
                this.offeringForm.controls['issueName'].setValue(offeringData.issueName);
            }
            if (offeringData.typeOfOffering) {
                this.offeringForm.controls['typeOfOffering'].setValue(offeringData.typeOfOffering);
            }
            if (offeringData.type) {
                this.offeringForm.controls['investmentType'].setValue(offeringData.type);
            }
            if (offeringData.issueType) {
                this.offeringForm.controls['issueType'].setValue(offeringData.issueType);
            }
            if (offeringData.dealType) {
                this.offeringForm.controls['dealType'].setValue(offeringData.dealType);
            }
            if (offeringData.percentageRaised) {
                this.offeringForm.controls['percentageRaised'].setValue(offeringData.percentageRaised);
            }
            if (offeringData.offeringAmount) {
                this.offeringForm.controls['offeringAmount'].setValue(offeringData.offeringAmount);
            }
            if (offeringData.minOfferingAmount) {
                this.offeringForm.controls['minimumOfferingAmount'].setValue(offeringData.minOfferingAmount);
            }
            if (offeringData.inputType) {
                this.offeringForm.controls['inputType'].setValue(offeringData.inputType);
            }
            if (offeringData.maxAmount) {
                this.offeringForm.controls['maxAmount'].setValue(offeringData.maxAmount);
            }
            if (offeringData.unitPrice) {
                this.offeringForm.controls['unitPrice'].setValue(offeringData.unitPrice);
            }
            if (offeringData.minimumSubscriptionAmount) {
                this.offeringForm.controls['minimumSubcriptionAmount'].setValue(offeringData.minimumSubscriptionAmount);
            }
            if (offeringData.numberOfUnits) {
                this.offeringForm.controls['numberOfUnits'].setValue(offeringData.numberOfUnits);
            }
            if (offeringData.stampingText) {
                this.offeringForm.controls['stampingText'].setValue(offeringData.stampingText);
            }
            this.offeringForm.controls['previewHomepage'].setValue('no');
            if (offeringData.previewOnHomepage) {
                this.offeringForm.controls['previewHomepage'].setValue('yes');
            }
            this.offeringForm.controls['displayMarketplace'].setValue('no');
            if (offeringData.displayInMarketPlace) {
                this.offeringForm.controls['displayMarketplace'].setValue('yes');
            }
            if (offeringData.offeringText) {
                this.offeringForm.controls['offeringText'].setValue(offeringData.offeringText);
            }
            if (offeringData.endDate) {
                console.log('end date data', offeringData.endDate);
                let formattedEndDate = this.utility.formatDate(offeringData.endDate);
                this.offeringForm.controls['endDate'].setValue({date: formattedEndDate});
            }
            if (offeringData.startDate) {
                console.log('start date data', offeringData.startDate);
                let formattedStartDate = this.utility.formatDate(offeringData.startDate);
                this.offeringForm.controls['startDate'].setValue({date: formattedStartDate});
            }
        }
    }

    // Api call to get user profile, if success getUserProfileSuccess(data) and if error getUserProfileFail(error)
    getOfferingsDetails() {
        this.appService.getSpecificOffering(this.offeringId).subscribe(
            data => this.getOfferingsDetailsSuccess(data),
            error => this.getOfferingsDetailsFail(error)
        );
    }

    //if get user profile success
    getOfferingsDetailsSuccess(fetchedOfferingData) {
        let offeringData = fetchedOfferingData.success.data;
        this.setOfferingData(offeringData);
    }

    //if get user profile fail
    getOfferingsDetailsFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    editOfferingInfo() {
        this.offeringForm = this.fb.group({
            'selectIssuer': this.fb.control('', Validators.compose([Validators.required])),
            'issueName': this.fb.control('', Validators.compose([Validators.required])),
            'typeOfOffering': this.fb.control('', Validators.compose([Validators.required])),
            'issueType': this.fb.control('', Validators.compose([Validators.required])),
            'dealType': this.fb.control('', Validators.compose([Validators.required])),
            'investmentType': this.fb.control('', Validators.compose([Validators.required])),
            'percentageRaised': this.fb.control(''),
            'offeringAmount': this.fb.control('', Validators.compose([Validators.required])),
            'minimumOfferingAmount': this.fb.control('', Validators.compose([Validators.required])),
            'startDate': this.fb.control(''),
            'endDate': this.fb.control(''),
            'minimumSubcriptionAmount': this.fb.control('', Validators.compose([Validators.required])),
            'unitPrice': this.fb.control('', Validators.compose([Validators.required])),
            'maxAmount': this.fb.control('', Validators.compose([Validators.required])),
            'inputType': this.fb.control('', Validators.compose([Validators.required])),
            'numberOfUnits': this.fb.control('', Validators.compose([Validators.required])),
            'offeringText': this.fb.control('', Validators.compose([Validators.required])),
            'stampingText': this.fb.control('', Validators.compose([Validators.required])),
            'previewHomepage': this.fb.control(''),
            'displayMarketplace': this.fb.control(''),
        });
    }


    //onSubmit
    onSubmit(value: any): void {
        console.log("value", value);
        this._spinner.show();
        let offeringData = {
            'id': this.offeringId,
            'issuer': value.selectIssuer,
            'issueName': value.issueName.trim(),
            'typeOfOffering': value.typeOfOffering,
            'issueType': value.issueType,
            'dealType': value.dealType,
            'type': value.investmentType,
            'percentageRaised': value.percentageRaised,
            'offeringAmount': value.offeringAmount,
            'minOfferingAmount': value.minimumOfferingAmount,
            'minimumSubscriptionAmount': value.minimumSubcriptionAmount,
            'unitPrice': value.unitPrice,
            'maxAmount': value.maxAmount,
            'inputType': value.inputType,
            'numberOfUnits': value.numberOfUnits,
            'offeringText': value.offeringText.trim(),
            'stampingText': value.stampingText.trim(),
            'previewOnHomepage': value.previewHomepage,
            'displayInMarketPlace': value.displayMarketplace,
            'startDate': value.startDate.formatted,
            'endDate': value.endDate.formatted
        };

        // Api call to edit offerings, if success editOfferings(data) and if error editOfferingsFail(error)
        this.appService.editOffering(offeringData).subscribe(
            data => this.editOfferingSuccess(data),
            error => this.editOfferingFail(error)
        );
    }

    //if edit offering success
    editOfferingSuccess(offeringSuccessData) {
        let offerData = offeringSuccessData.success.data.deal;
        if (offerData) {
            this.setOfferingData(offerData);
            this._spinner.hide();
            this.toastr.success('Offering updated successfully.');
        }
    }

    //if edit offering fail
    editOfferingFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    // Function for date picker date change event.
    onDateChanged(event: any) {
        if (new Date(this.offeringForm.controls['startDate'].value.jsdate) > new Date(event.jsdate)) {
            this.dateError = true;
        } else {
            this.dateError = false;
        }
    }

    // Function for date picker date change event.
    onStartDateChanged(event: any) {
        if (typeof this.offeringForm.controls['endDate'].value.jsdate !== 'undefined') {
            if (new Date(this.offeringForm.controls['endDate'].value.jsdate) < new Date(event.jsdate)) {
                this.dateError = true;
            } else {
                this.dateError = false;
            }
        }
    }

    trimContent(value, control) {
        if(value) {
            this.offeringForm.controls[control].setValue(value.trim());
        }
        return value.trim();
    }
}
