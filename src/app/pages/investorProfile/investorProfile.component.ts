import {Component, ViewContainerRef, ViewEncapsulation, ViewChildren} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {AuthenticationHelper} from "../../app.authentication";
import {ToastsManager} from 'ng2-toastr/ng2-toastr';
import {IMyOptions, IMyDate} from "mydatepicker";
import {ApplicationAdminServices} from "../../appServices/application";
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {COMMON_CONSTANTS} from "../constants/dropdownConstants";
import {STATE_CONSTANTS} from "../constants/state";
import {COUNTRY_CONSTANTS} from "../constants/country";
import {BlankSpaceValidator} from "../../theme/validators/blank.validator";

@Component({
    selector: 'investorProfile',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./investorProfile.scss'],
    templateUrl: './investorProfile.html'

})

export class InvestorProfile {
    @ViewChildren('firstName') firstField;
    tab:any= {
        isInvesterTab: {
            active: false,
            hasDone: false
        },
        isFinancialTab: {
            active: false,
            hasDone: false
        },
        isEmployerTab: {
            active: false,
            hasDone: false
        }
    };
    citizenTypeList:any = COMMON_CONSTANTS.CITIZEN_TYPES.citizenCategory;
    stateList:any = STATE_CONSTANTS.STATES;
    countryList:any = COUNTRY_CONSTANTS.COUNTRIES;
    fromDate:string = '';
    investorForm:FormGroup;
    financialForm:FormGroup;
    employerForm:FormGroup;
    getUserData:any;
    imageUrl:string;
    finalData:any = {};
    citizenList:any = [];
    isInvesterTabs:boolean = true;
    isFinancialTabs:boolean = false;
    isEmployerTabs:boolean = false;
    enterCountryMessage:boolean = false;
    private myDatePickerOptions:IMyOptions = {
        todayBtnTxt: 'Today',
        dateFormat: 'mm/dd/yyyy',
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
        openSelectorOnInputClick: true
    };

    constructor(private fb:FormBuilder, private authentication:AuthenticationHelper, private appService:ApplicationAdminServices, public toastr:ToastsManager, vRef:ViewContainerRef, private _spinner:BaThemeSpinner) {
        this.authentication.setChangedContentTopText('Investor Profile');
        this.tab['isInvesterTab'].active = true;
    }

    ngAfterViewInit() {
        this.firstField.first.nativeElement.focus();
    }


    ngOnInit() {
        window.scrollTo(0, 0);
        this.investorBasicInfo();
        this.financialBasicInfo();
        this.employerBasicInfo();
        this.citizenList = this.citizenTypeList;
        this.getUserProfileDetails();
        this.investorForm.controls['country'].patchValue("United States");
    }

    /**
     * Set up investor information form.
     */
    investorBasicInfo() {
        this.investorForm = this.fb.group({
            'SSN': this.fb.control(''),
            'citizenship': this.fb.control(''),
            'firstName': this.fb.control('',Validators.compose([Validators.required,BlankSpaceValidator.validate])),
            'lastName': this.fb.control(''),
            'dateOfBirth': this.fb.control(''),
            'email': this.fb.control(''),
            'phoneNumber': this.fb.control(''),
            'country': this.fb.control('', Validators.compose([Validators.required])),
            'addressLineOne': this.fb.control(''),
            'addressLineTwo': this.fb.control(''),
            'address': this.fb.control(''),
            'city': this.fb.control(''),
            'state': this.fb.control(''),
            'accountName': this.fb.control(''),
            'investOption': this.fb.control(''),
            'zipCode': this.fb.control(''),
        });
    }

    /**
     * Set up financial information form.
     */
    financialBasicInfo() {
        this.financialForm = this.fb.group({
            'currentAnnual': this.fb.control('', Validators.compose([Validators.required])),
            'averageIncome': this.fb.control(''),
            'householdAnnual': this.fb.control(''),
            'householdAverage': this.fb.control(''),
            'householdNetworth': this.fb.control(''),
        });
    }

    /**
     * Set up employer information form.
     */
    employerBasicInfo() {
        this.employerForm = this.fb.group({
            'employerName': this.fb.control(''),
            'employerAddress': this.fb.control(''),
            'employerAddressLineTwo': this.fb.control(''),
            'employerCity': this.fb.control(''),
            'employerState': this.fb.control(''),
            'employerCountry': this.fb.control(''),
            'employerZip': this.fb.control(''),
            'isRegisteredBroker': this.fb.control('')
        });
    }

    // to set data of user already present.
    setUserData(data) {
        this.getUserData = data;
        if (this.getUserData.firstName) {
            this.investorForm.controls['firstName'].setValue(this.getUserData.firstName);
        }
        if (this.getUserData.lastName) {
            this.investorForm.controls['lastName'].setValue(this.getUserData.lastName);
        }
        if (this.getUserData.email) {
            this.investorForm.controls['email'].setValue(this.getUserData.email);
        }
        if (this.getUserData.mobileNumber) {
            if (this.getUserData.mobileNumber.length > 0) {
                let mobileNo = this.getUserData.mobileNumber[0];
                this.investorForm.controls['phoneNumber'].setValue(mobileNo);
            }
        }
    }

    // Api call to get user profile, if success getUserProfileSuccess(data) and if error getUserProfileFail(error)
    getUserProfileDetails() {
        this.appService.getUserProfile().subscribe(
            data => this.getUserProfileSuccess(data),
            error => this.getUserProfileFail(error)
        );
    }

    //if get user profile success
    getUserProfileSuccess(result) {
        let userData = result.success.data.user;
        this.setUserData(userData);
    }

    //if get user profile fail
    getUserProfileFail(Error) {
        if (Error.error && Error.error.message) {
            this.toastr.error(Error.error.message);
        } else if (typeof(Error.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    // Function for date picker date change event.
    onDateChanged(event:any) {
        if (event.formatted === '') {
        } else {
            let day, month;
            day = event.date.day;
            month = event.date.month;
            if (event.date.month < 10) {
                month = 0 + '' + event.date.month;
            }
            if (event.date.day < 10) {
                day = 0 + '' + event.date.day;
            }
            this.fromDate = month + '/' + day + '/' + event.date.year;
        }
    }

    /**
     * Function is called when investor information is submitted.
     */
    onInvestFormSubmit(investFormData) {
        if (investFormData) {
            this.finalData = {
                'first_name': investFormData.firstName.trim(),
                'last_name': investFormData.lastName.trim(),
                'email': investFormData.email.trim(),
                'mobile_number': investFormData.phonenumber,
                'SSN': investFormData.SSN.trim(),
                'account_name': investFormData.accountName.trim(),
                'address_line_one': investFormData.addressLineOne.trim(),
                'address_line_two': investFormData.addressLineTwo.trim(),
                'citizenship': investFormData.citizenship,
                'date_of_birth': investFormData.dateOfBirth,
                'invest_option': investFormData.investOption,
                'state': investFormData.state,
                'zip_code': investFormData.zipCode.trim()
            };
            this.isFinancialTabs = true;
            this.isInvesterTabs = false;
            this.tab['isInvesterTab'].hasDone = true;
            this.tab['isInvesterTab'].active = false;
            this.tab['isFinancialTab'].active = true;
        }
    }

    /**
     * Function is called when financial information is submitted.
     */
    onFinancialFormSubmit(financialFormData) {
        if(financialFormData){
            this.finalData.average_income = financialFormData.averageIncome;
            this.finalData.current_annual = financialFormData.currentAnnual;
            this.finalData.household_annual = financialFormData.householdAnnual;
            this.finalData.household_average = financialFormData.householdAverage;
            this.finalData.household_networth = financialFormData.householdNetworth;

            this.isEmployerTabs = true;
            this.isFinancialTabs = false;
            this.tab['isFinancialTab'].hasDone = true;
            this.tab['isFinancialTab'].active = false;
            this.tab['isEmployerTab'].active = true;
        }
    }

    /**
     * Function is called when employer information is submitted.
     */
    onEmployerFormSubmit(employerFormData) {
        if(employerFormData){
            this.finalData.employer_address = employerFormData.employerAddress.trim();
            this.finalData.employer_address_line_two = employerFormData.employerAddressLineTwo.trim();
            this.finalData.employer_city = employerFormData.employerCity.trim();
            this.finalData.employer_country = employerFormData.employerCountry;
            this.finalData.employer_name = employerFormData.employerName.trim();
            this.finalData.employer_state = employerFormData.employerState;
            this.finalData.employer_zip = employerFormData.employerZip.trim();
            this.finalData.is_registered_broker = employerFormData.isRegisteredBroker;
            this.tab['isEmployerTab'].hasDone = true;
            this.tab['isEmployerTab'].active = false;
            this._spinner.show();

        }
        // Api call to edit profile, if success editUserProfile(data) and if error editUserProfileFail(error)
        this.appService.createInvestorProfile(this.finalData).subscribe(
            data => this.createInvestorProfileSuccess(data),
            error => this.createInvestorProfileFail(error)
        );
    }

    //if create investor profile success
    createInvestorProfileSuccess(profileData) {
        if (profileData.success.data.user) {
            let userData = profileData.success.data.user;
            this.setUserData(userData);
            this.authentication.setUserLocal(profileData);
            this.authentication.userValueChangedEvent(userData);
            this.authentication.setUser(userData);
            this._spinner.hide();
            this.toastr.success('Profile updated successfully');
        }
    }

    //if create investor profile fail
    createInvestorProfileFail(Error) {
        this._spinner.hide();
        if (Error.error && Error.error.message) {
            this.toastr.error(Error.error.message);
        } else if (typeof(Error.error) !== 'undefined') {
            this.toastr.error('Server error');
        }
    }

    /**
     * Logic to make financial form active.
     */
    navigateToFinancialForm() {
        this.isEmployerTabs = false;
        this.isFinancialTabs = true;
        this.tab['isFinancialTab'].active = true;
        if (this.tab['isEmployerTab'].hasDone == false) {
            this.tab['isEmployerTab'].active = false;
        }
    }

    /**
     * Logic to make investor form active.
     */
    navigateToInvestorForm() {
        this.isFinancialTabs = false;
        this.isInvesterTabs = true;
        this.tab['isFinancialTab'].active = false;
        this.tab['isInvesterTab'].active = true;
        if (this.tab['isEmployerTab'].hasDone == false) {
            this.tab['isEmployerTab'].active = false;
        }
    }

    changeCountry(value) {
        if (value == 3) {
            this.enterCountryMessage = true;
            this.investorForm.controls['country'].patchValue("");
        } else if(value == 2) {
            this.enterCountryMessage = false;
        } else {
            this.enterCountryMessage = false;
            this.investorForm.controls['country'].patchValue("United States");
        }
    }

    selectCountry(value) {
        this.enterCountryMessage = false ;
    }

    trimContent(value, control) {
        if(value) {
            this.investorForm.controls[control].setValue(value.trim());
        }
        return value.trim();
    }
}
