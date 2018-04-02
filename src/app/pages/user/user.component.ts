import {Component, ViewEncapsulation, ViewChild} from '@angular/core';
import {LocalDataSource} from "ng2-smart-table";
import {FormBuilder} from '@angular/forms';
import {Router}  from '@angular/router';
import {ToastsManager} from "ng2-toastr";
import {ApplicationAdminServices}from './../../../app/appServices/application';
import {BaThemeSpinner} from "../../theme/services/baThemeSpinner/baThemeSpinner.service";
import {UtilityHelper} from '../shared/utility';
import {AuthenticationHelper} from "../../app.authentication";
import * as FileSaver from '../../../../node_modules/file-saver';
import {DatePipe} from '@angular/common';
import {Modal} from 'ng2-modal';

@Component({
    selector: 'user',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./user.scss'],
    templateUrl: './user.html',
})

export class User {
    userList: any = [];
    source: LocalDataSource = new LocalDataSource();
    per_page: any = 10;
    activeData: any;
    current_page: number = 1;
    searchString: string;
    totalCount: any;
    @ViewChild('confirmUserActiveModal') confirmUserActiveModal: Modal;
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
                public toastr: ToastsManager, private spinner: BaThemeSpinner, private fb: FormBuilder, private utility: UtilityHelper, private authentication: AuthenticationHelper, private datePipe: DatePipe) {
        //To hide spinner
        this.spinner.hide();
        this.getAllUsers();
        this.authentication.setChangedContentTopText('Active Users');
    }

    /**
     * To get all users list
     */
    getAllUsers() {
        this.spinner.show();
        let searchValue;
        let data = {
            is_active: true,
            limit: parseInt(this.per_page),
            page_no: this.current_page,
            search_string: this.searchString,
        };
        if (typeof data.search_string !== 'undefined') {
            searchValue = '?is_active=' + data.is_active + '&&size=' + data.limit + '&&page=' + data.page_no + '&&search_string=' + data.search_string;

        } else {
            searchValue = '?is_active=' + data.is_active + '&&size=' + data.limit + '&&page=' + data.page_no;
        }
        this.adminServices.getUsers(searchValue).subscribe(
            data => this.getUsersSuccess(data),
            error => this.getUsersFail(error)
        );
    }

    /**
     * If get all user APIs success
     * @param data
     */
    getUsersSuccess(data) {
        this.spinner.hide();
        if (data.success.status === 1) {
            this.totalCount = data.success.data.totalResult;
            this.authentication.setChangedContentTopText('Active Users (' + this.totalCount + ')');
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
     * if get user fails.
     * @param err
     */
    getUsersFail(err) {
        this.spinner.hide();
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    /**
     * to call and get next page data.
     * @param page
     */
    getPageData(page) {
        this.current_page = page;

        this.getAllUsers();
    }

    /**
     * To confirm save operation.
     */
    onSaveConfirm(event) {

         }


    /**
     * To call export API.
     */
    exportUsers() {
        this.spinner.show();
        let searchValue;
        let data = {
            is_active: true,
        };
        searchValue = '?is_active=' + data.is_active;
        this.adminServices.getUsersExportData(searchValue).subscribe(
            data => this.getUsersExportDataSuccess(data),
            error => this.getUsersExportDataFail(error)
        );
    }

    /**
     * If export CSV APIs success.
     * @param data
     */
    getUsersExportDataSuccess(data) {
        let blob;
        //calling common method for converting base 64 yo blob
        blob = this.utility.base64toBlob(data.success.data.user, 'xls');
        this.spinner.hide();
        FileSaver.saveAs(blob, 'Users.xls');
    }

    /**
     * If export CSV APIs fails.
     * @param err
     */
    getUsersExportDataFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }


    // To redirect to add user
    navigateToAddUser() {
        this.router.navigate(['/add-user']);
    }

    /**
     * for delete
     * @param Event
     */
    confirmDelete(Event): any {
        this.confirmUserActiveModal.open();
        this.activeData = Event.data;
    }

    /**
     * for edit
     * @param event
     */
    editUser(event) {
    }

    makeUserActive() {
        this.confirmUserActiveModal.close();
        let profileData = {
            email: this.activeData.userEmail,
            is_active: false
        };
        this.adminServices.editUserActiveStatus(profileData).subscribe(
            data => this.editProfileSuccess(data),
            error => this.editProfileFail(error)
        );
    }

    //if edit profile success
    editProfileSuccess(result) {

        this.toastr.success('User successfully changed to inActive status');
        this.getAllUsers()
    }

    //if edit profile fail
    editProfileFail(err) {
        if (err.error && err.error.message) {
            this.toastr.error(err.error.message);
        } else {
            this.toastr.error('Server error');
        }
    }

    /**
     * To format date
     */
    valuePrepareFunction(date) {
        let raw = new Date(date);
        let formatted = this.datePipe.transform(raw, 'dd MMM yyyy ');

        return formatted;
    }

    /**
     * To format date
     */
    valuePrepareFunctionWithTime(date) {
        if(date == null) {
            return null;
        } else {
            const raw = new Date(date);
            const formatted = this.datePipe.transform(raw, 'dd MMM yyyy HH:mm');
            return formatted;
        }
    }

    /**
     * To call API for filtering users by search term.
     */
    searchUsers(value) {
        this.searchString = value.trim();
        let data = {
            is_active: true,
            limit: parseInt(this.per_page),
            page_no: this.current_page,
        };
        let searchValue = '?is_active=' + data.is_active + '&&size=' + data.limit + '&&page=' + data.page_no + '&&search_string=' + this.searchString;
        this.adminServices.getUsers(searchValue).subscribe(
            data => this.getUsersSuccess(data),
            error => this.getUsersFail(error)
        );
    }


}
