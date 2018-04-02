import {Injectable, EventEmitter, Output} from '@angular/core';
@Injectable()

export class AuthenticationHelper {
    user: any;
    private userKey: string = 'user';
    tokenKey: string = 'auth_token';
    private user_role: string = 'user_role_id';

    @Output() changeContentTopText: EventEmitter<any> = new EventEmitter(true);
    @Output() userValueChanged: EventEmitter<any> = new EventEmitter(true);

    constructor() {
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    setApiKey(api_key) {
        localStorage.setItem('api-key', api_key);
    }

    setUserLocal(value){
        let rolesArray = value.success.data.user.roles.map((item) => {
            return item.role.name;
        });
        if (value.success.data.user) {
            if (rolesArray.indexOf('admin') !== -1) {
                localStorage.setItem('userName', 'ADMIN');
                localStorage.setItem('user', JSON.stringify(value.success.data.user));
                localStorage.setItem('roles', rolesArray)
                localStorage.setItem('profileImageURL', value.success.data.user.profileImageURL);
            } else {
                localStorage.setItem('user', JSON.stringify(value.success.data.user));
                localStorage.setItem('userName', value.success.data.user.firstName);
                localStorage.setItem('roles', rolesArray);
                localStorage.setItem('email', value.success.data.user.email);
                localStorage.setItem('profileImageURL', value.success.data.user.profileImageURL);
            }
        }

    }

    getToken() {
        return localStorage.getItem('auth_token');
    }

    removeLoggedIn() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.user_role);
    }


    isLoggedIn() {
        const token: any = localStorage.getItem(this.tokenKey);
        if (token && token.length > 0) {
            return true;
        }
        return false;
    }

    setLoggedIn(res) {
        const token: any = res.data.auth_token;
        if (token == undefined) {
        } else {
            console.log(res,'res');
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem(this.user_role, res.data.user_role_id);
            if( res.data.user_role_id == 1) {
                localStorage.setItem('userName', res.data.user_name.name);
                localStorage.setItem('userId', res.data.id_user);
            }
        }
    }
    // isLoggedIn() {
    //     let token = this.getToken();
    //     if (token && token.length > 0) {
    //         return true;
    //     }
    //     return false;
    // }

    isUser(){
        let userData = JSON.parse(this.getUserData());
        let rolesArray = userData.roles.map((item) => {
            return item.role.name;
        });
        if (userData && userData.roles && (rolesArray.indexOf('user') != -1)) {
            return true;
        } else {
            return false;
        }
    }

    isAdmin() {
        let userData = JSON.parse(this.getUserData());
        let rolesArray = userData.roles.map((item) => {
            return item.role.name;
        });
        if (userData && userData.roles && (rolesArray.indexOf('admin') != -1)) {
            return true;
        } else {
            return false;
        }
    }

    getUserData() {
        return localStorage.getItem(this.userKey);
    }

    setIsLoggedIn(IsLoggedIn) {
        localStorage.setItem('IsLoggedIn', IsLoggedIn);
    }

    setChangedContentTopText(value) {
        this.changeContentTopText.emit(value);
    }

    getChangedContentTopText(): EventEmitter<any> {
        return this.changeContentTopText;
    }

    userValueChangedEvent(value): void {
        this.user = value;
        this.userValueChanged.emit(value);
    }

    getUserValueChangeEmitter(): EventEmitter<any> {
        return this.userValueChanged;
    }

    setUser(inputUser) {
        this.user = inputUser;
    }

    getUser() {
        return this.user;
    }
}
