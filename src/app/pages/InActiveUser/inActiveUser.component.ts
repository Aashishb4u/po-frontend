import {Component, ViewEncapsulation,ViewChild} from '@angular/core';
import {LocalDataSource} from "ng2-smart-table";;
import {Router}  from '@angular/router';
import {ToastsManager} from "ng2-toastr";
import {ApplicationAdminServices}from './../../../app/appServices/application';
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {UtilityHelper} from '../shared/utility';
import {AuthenticationHelper} from "../../app.authentication";
import * as FileSaver from '../../../../node_modules/file-saver';
import {DatePipe} from '@angular/common';
import { Modal } from 'ng2-modal';

@Component({
    selector: 'inActiveUser',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./inActiveUser.scss'],
    templateUrl: './inActiveUser.html'
})

export class inActiveUser {
    userList: any = [];
    source: LocalDataSource = new LocalDataSource();
    per_page: any = 10;
    inActiveData: any;
    current_page: number = 1;
    totalCount: any;
    searchString: string;
    @ViewChild('confirmUserInActiveModal') confirmUserInActiveModal: Modal;
    /**
     * For user grid setting
     * @type {{mode: string; pager: {perPage: number};
     * action: {delete: boolean; edit: boolean};
     * edit: {editButton: boolean; editButtonContent: string; saveButtonContent: string; cancelButtonContent: string; confirmSave: boolean};
     * delete: {deleteButton: boolean; deleteButtonContent: string; confirmDelete: boolean};
     * columns: {column names}
     */
    settings = {
        mode: 'external',
        hideSubHeader: true,
        pager: {
            perPage: 10
        },
        action: {
            delete: true,
            edit: true
        },
        edit: {
            editButton: true,
            editButtonContent: '<i class="btn btn-primary btn-xs fa fa-pencil"></i>',
            saveButtonContent: '<i class="ion-checkmark"></i>',
            cancelButtonContent: '<i class="ion-close"></i>',
            confirmSave: true
        },
        delete: {
            deleteButton: false,
            deleteButtonContent: '<i class="btn btn-danger btn-xs glyphicon ion-gear-a"></i>',
            confirmDelete: true
        },
        columns: {
            name: {
                title: 'Name',
                filter: true,
                editable: true
            },
            userEmail: {
                title: 'Email',
                filter: true,
                editable: true
            },
            lastLogIn: {
                title: 'Last Log In',
                filter: true,
                editable: true
            },
            createdOn: {
                title: 'Created On',
                filter: true,
                editable: true
            }
        }
    };

    constructor(private adminServices: ApplicationAdminServices, private router: Router,
                public toastr: ToastsManager, private spinner: BaThemeSpinner, private utility: UtilityHelper, private authentication: AuthenticationHelper, private datePipe: DatePipe) {
        //To hide spinner
        this.spinner.hide();
        this.getAllInactiveUsers();
        this.authentication.setChangedContentTopText('InActive Users');
    }


    /**
     * To get all users list
     */
    getAllInactiveUsers() {
        this.spinner.show();
        let searchValue;
        let data = {
            is_active: false,
            limit: parseInt(this.per_page),
            page_no: this.current_page,
            search_string: this.searchString,
        };
        if(typeof data.search_string !== 'undefined'){
            searchValue = '?is_active=' + data.is_active + '&&size=' + data.limit + '&&page=' + data.page_no + '&&search_string=' + data.search_string;

        }
        else{
            searchValue = '?is_active=' + data.is_active + '&&size=' + data.limit + '&&page=' + data.page_no;
        }

        this.adminServices.getUsers(searchValue).subscribe(
            data => this.getInactiveUsersSuccess(data),
            error => this.getInactiveUsersFail(error)
        );
    }

    /**
     * If get all user APIs success
     * @param data
     */
    getInactiveUsersSuccess(data) {
        this.spinner.hide();
        if (data.success.status === 1) {
            this.totalCount = data.success.data.totalResult;
            this.authentication.setChangedContentTopText('inActive Users ('+ this.totalCount +')');
            this.userList = [];
            data.success.data.data.forEach(userInfo => {
                let dataObj = {
                    name: this.utility.toTitleCase(userInfo.basic.firstName) + ' ' + this.utility.toTitleCase(userInfo.basic.lastName),
                    userEmail: userInfo.basic.email,
                    lastLogIn: this.valuePrepareFunctionWithTime(userInfo.lastLogIn),
                    createdOn: this.valuePrepareFunction(userInfo.createdAt)
                };
                this.userList.push(dataObj);
            });

            this.source.load(this.userList);
        }
    }

    /**
     * if get inactive user fails.
     * @param err
     */
    getInactiveUsersFail(err) {
        this.spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    /**
     * to get next page data
     * @param page
     */
    getPageData(page) {
        this.current_page = page;
        this.getAllInactiveUsers();

    }

    // To redirect to add user
    navigateToAddUser() {
        this.router.navigate(['/add-user']);
    }

    /**
     * for opening model pop up to make user active from inactive.
     * @param event
     */
    confirmTransition(event): any {
        this.confirmUserInActiveModal.open();
        this.inActiveData = event.data;
    }

    /**
     * To call export inactive users API
     */
    exportUsers(){
        this.spinner.show();
        let searchValue;
        let data = {
            is_active: false,
        };
        searchValue = '?is_active=' + data.is_active;
        // calling API to export inactive users data.
        this.adminServices.getUsersExportData(searchValue).subscribe(
            data => this.getUsersExportDataSuccess(data),
            error => this.getUsersExportDataFail(error)
        );
    }

    /**
     * If export CSV APIs success
     * @param data
     */
    getUsersExportDataSuccess(exportedData){
        let blob ;
        //calling common method for converting base 64 yo blob
        blob = this.utility.base64toBlob(exportedData.success.data.user,'xls');
        this.spinner.hide();
        FileSaver.saveAs(blob , 'Users.xls');
    }

    /**
     * If export CSV APIs fail
     * @param err
     */
    getUsersExportDataFail(err){
        this.spinner.hide();
        this.toastr.error(err.error.message);
    }


    /**
     * Transform user active form inactive state.
     */
    makeUserActive(){
        this.confirmUserInActiveModal.close();
        let profileData = {
            email:  this.inActiveData.userEmail,
            is_active: true
        };
        this.adminServices.editUserActiveStatus(profileData).subscribe(
            data => this.editProfileSuccess(data),
            error => this.editProfileFail(error)
        );
    }

    /**
     * If edit profile success.
     * @param result
     */
    editProfileSuccess(result) {
        this.toastr.success('User successfully changed to Active status.');
        this.getAllInactiveUsers();
    }

    /**
     * if edit user profile fails
     * @param err
     */
    editProfileFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }
    /**
     * for edit user
     * @param event
     */
    editUser(event) {
    }

    /**
     * for save user
     * @param event
     */
    onSaveConfirm(event) {
    }

    /**
     * To format date
     */
    valuePrepareFunction(date) {
        let raw = new Date(date);
        let formatted = this.datePipe.transform(raw, 'dd MMM yyyy');

        return formatted;
    }

    /**
     * Function to format date.
     */
    valuePrepareFunctionWithTime(date) {
        if(date == null) {
            return null;
        } else {
            let raw = new Date(date);
            let formatted = this.datePipe.transform(raw, 'dd MMM yyyy HH:mm');
            return formatted;
        }
    }

    /**
     * Function to search user based on the search string passed in parameter.
     * @param value
     */
    searchUsers(value){
        this.searchString = value.trim();
        let data = {
            is_active: false,
            limit: parseInt(this.per_page),
            page_no: this.current_page,
        };
        let searchValue = '?is_active=' + data.is_active + '&&size=' + data.limit + '&&page=' + data.page_no + "&&search_string=" + this.searchString;
        this.adminServices.getUsers(searchValue).subscribe(
            data => this.getInactiveUsersSuccess(data),
            error => this.getInactiveUsersFail(error)
        );
    }
}
