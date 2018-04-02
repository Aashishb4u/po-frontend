import {Component, ViewContainerRef, ViewEncapsulation, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {Router}  from '@angular/router';
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {OFFERINGS_CONSTANTS} from "../constants/addOffering";
import {IMyOptions, IMyDate} from "mydatepicker";


@Component({
    selector: 'addOffering',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./addOffering.scss'],
    templateUrl: './addOffering.html'
})

export class AddOffering {
    offeringForm:FormGroup;
    showError:boolean = false;
    dateError:boolean = false;
    fromDate:string = '';
    toDate:string = '';
    issuerData:any = OFFERINGS_CONSTANTS.ISSUER_LIST.issuersList;
    typeOfOfferings:any = OFFERINGS_CONSTANTS.TYPE_OF_OFFERING_LIST.typeOfOfferingList;
    issueTypeList:any = OFFERINGS_CONSTANTS.ISSUE_TYPES.typeOfIssueList;
    dealTypeList:any = OFFERINGS_CONSTANTS.DEAL_TYPES.typeOfDealList;
    investmentTypeList:any = OFFERINGS_CONSTANTS.INVESTMENT_TYPES.typeOfInvestmentList;
    @ViewChildren('isIssuer') isIssuer;

    myDatePickerOptions:IMyOptions = {
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

    constructor(private router:Router, private adminServices:ApplicationAdminServices, private fb:FormBuilder,
                private authentication:AuthenticationHelper, private appService:ApplicationAdminServices,
                public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Add Offering');
    }

    ngAfterViewInit() {
        this.isIssuer.first.nativeElement.focus();
    }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.addOfferingInfo();
        this.offeringForm.controls['typeOfOffering'].patchValue("1");
        this.offeringForm.controls['issueType'].patchValue("1");
        this.offeringForm.controls['dealType'].patchValue("1");
        this.offeringForm.controls['investmentType'].patchValue("1");
    }

    addOfferingInfo() {
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
    onSubmit(value:any):void {
        this._spinner.show();
        let offeringData = {
            'issuer': value.selectIssuer,
            'issueName': value.issueName,
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
            'offeringText': value.offeringText,
            'stampingText': value.stampingText,
            'previewOnHomepage': value.previewHomepage,
            'displayInMarketPlace': value.displayMarketplace,
            'startDate': value.startDate.formatted,
            'endDate': value.endDate.formatted,

        };

        // Api call to edit profile, if success editUserProfile(data) and if error editUserProfileFail(error)
        this.appService.createOffering(offeringData).subscribe(
            data => this.createOfferingSuccess(data),
            error => this.createOfferingFail(error)
        );
    }

    //if edit profile success
    createOfferingSuccess(offeringSuccessData) {
        if (offeringSuccessData) {
            // this.setUserData(userData);
            this._spinner.hide();
            this.toastr.success('Offering created successfully.');
            this.offeringForm.reset();
        }
    }

    //if edit profile fail
    createOfferingFail(err) {
        this._spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else if (typeof(err.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }


    // Function for date picker date change event.
    onDateChanged(event:any) {
        if (new Date(this.offeringForm.controls['startDate'].value.jsdate) > new Date(event.jsdate)) {
            this.dateError = true;
        } else {
            this.dateError = false;
        }
    }

    // Function for date picker date change event.
    onStartDateChanged(event:any) {
        if (typeof this.offeringForm.controls['endDate'].value.jsdate !== 'undefined') {
            if (new Date(this.offeringForm.controls['endDate'].value.jsdate) < new Date(event.jsdate)) {
                this.dateError = true;
            } else {
                this.dateError = false;
            }
        }

    }
}
