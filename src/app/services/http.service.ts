import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as constant from './constants';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

declare var $: any;


@Injectable()
export class HttpService {

    public filesData: any = [];
    modalRefArr: any = [];
    CONSTANT = constant;
    modalRef: BsModalRef;
    public readonly apiEndpoint: String;
    private loaderSubject = new BehaviorSubject<any>(null);
    public loaderStatus = this.loaderSubject.asObservable();

    private contactUpdatedSubject = new BehaviorSubject<any>(null);
    public contactUpdatedStatus = this.contactUpdatedSubject.asObservable();

    public eventSubject = new BehaviorSubject<any>(null);
    public eventStatus = this.eventSubject.asObservable();

    private modalSubject = new BehaviorSubject<any>(null);
    public modalStatus = this.modalSubject.asObservable();

    private searchSubject = new BehaviorSubject<any>(null);
    public searchStatus = this.searchSubject.asObservable();

    public heading: string;
    domain: string;
    loginData: any;
    myLoader = false;

    constructor(
        private router: Router, public http: HttpClient, public toastr: ToastrService,
        @Inject(DOCUMENT) public document: any, public fb: FormBuilder,
        public _snackBar: MatSnackBar,
        public modalService: BsModalService
    ) {
        this.apiEndpoint = environment.apiBaseUrl;
        this.domain = this.document.location.origin;
        this.loginData = JSON.parse(localStorage.getItem('loginData'));
    }

    openSnackBar(message: string, action?: string) {
        this._snackBar.open(message, action, {
            duration: 3000,
            horizontalPosition: 'right',
            panelClass: 'custom-snack'
        });
    }

    updateEvent(eventType, data?) {
        const obj: any = {
            eventType: eventType
        };
        if (data) {
            obj.data = data;
        }
        // this.http.eventSubject.next({eventType: 'addTag'})
        this.eventSubject.next(obj);
    }

    sendSearch(data) {
        this.searchSubject.next(data);
    }

    contactUpdated(data?) {
        this.contactUpdatedSubject.next(data ? data : false);
    }

    openModal(name, data?) {

        const obj: any = {
            name: name,
            data: data
        };
        this.modalSubject.next(obj);
    }

    fileDownloadFromServer(file) {
        const link = document.createElement('a');
        link.download = 'filename';
        link.href = this.apiEndpoint + 'files/' + file + '.xlsx';
        link.click();
    }

    fileDownloadFromLink(url) {
        const link = document.createElement('a');
        link.download = 'filename';
        link.href = url;
        link.click();
    }

    showLoader() {
        $('.loader').show();
    }

    hideLoader() {
        $('.loader').hide();
    }

    goToLink(url: string) {
        window.open(url, '_blank');
    }

    loaderOn(loaderStatus) {
        this.myLoader = loaderStatus;
        this.loaderSubject.next(loaderStatus);
    }

    isFormValid(form) {
        if (form.valid) {
            return true;
        } else {
            Object.keys(form.controls).forEach(key => {
                form.controls[key].markAsTouched({ onlySelf: true });
            });
        }
    }

    setTouched(form) {
        Object.keys(form.controls).forEach(key => {
            form.controls[key].markAsTouched({ onlySelf: true });
        });
    }


    navigate(url, params?) {
        if (params) {
            this.router.navigate([`/${url}`, params]);
        } else {
            this.router.navigate([`/${url}`]);
        }
    }

    changeTitle(title) {
        this.heading = title;
    }

    getData(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }

    getDataNew(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(url, { params: params, reportProgress: isLoading });
    }

    postData(url, user, password, isLoading?: boolean) {

        var obj = {
            "user": user,
            "password": password
        }

        // const formData = new FormData();
        Object.keys(obj).forEach(key => {
            if (obj[key] !== '' && obj[key] !== undefined) {
                // formData.append(key, obj[key]);
            }
        });
        return this.http.post<any>(this.apiEndpoint + url, obj, { reportProgress: isLoading });
    }

    downloadLink(url) {
        window.location.href = url;
    }



    uploadImage(url, file, isLoading?) {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<any>(this.apiEndpoint + url, formData, { reportProgress: isLoading });
    }

    uploadFile(url, file, isLoading?: boolean) {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<any>(this.apiEndpoint + url, formData, { reportProgress: isLoading });
    }

    checkImage(file) {
        if (file) {
            if (file.size < 1000000) {
                if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
                    return true;
                } else {
                    this.openSnackBar('Please add jpg or png image only');
                }
            } else {
                this.openSnackBar('Please add image less than 10 MB');
            }
        }
        return false;
    }



    showModal(template, size?, data?) {
        const initialState: any = {};
        if (data) {
            initialState.modalData = data;
        }
        const modalRef = this.modalService.show(template,
            { initialState, class: `gray modal-${size ? size : 'md'}` }
        );
        this.modalRefArr.push(modalRef);
        return modalRef;
    }


    hideModal() {
        const element = this.modalRefArr.pop();
        if (element) {
            element.hide();
        } else {
            this.modalRefArr.hide();
        }
    }



    changeDate(val) {
        const date = new Date();
        const splitDate = val.split('-');
        date.setFullYear(parseInt(splitDate[2], 10));
        date.setMonth(parseInt(splitDate[1], 10) - 1);
        date.setDate(parseInt(splitDate[0], 10));
        return date;
    }

    addQueryParams(obj) {
        this.router.navigate([], { queryParams: obj });
    }

    getIsSelected(arr, key) {
        const temp: any = [];
        arr.forEach((val) => {
            if (val[key]) {
                temp.push(val._id);
            }
        });
        return temp;
    }

    getIdsOnly(arr) {
        if (arr) {
            const temp: any = [];
            arr.forEach((val) => {
                temp.push(val._id);
            });
            return temp;
        } else {
            return [];
        }
    }

    formatBytes(bytes, decimals, binaryUnits?) {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const unitMultiple = (binaryUnits) ? 1024 : 1000;
        const unitNames = (unitMultiple === 1024) ? // 1000 bytes in 1 Kilobyte (KB) or 1024 bytes for the binary version (KiB)
            ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'] :
            ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const unitChanges = Math.floor(Math.log(bytes) / Math.log(unitMultiple));
        return parseFloat((bytes / Math.pow(unitMultiple, unitChanges)).toFixed(decimals || 0)) + ' ' + unitNames[unitChanges];
    }

    checkLastName(val) {
        if (val.lastName) {
            val.showName = val.firstName + ' ' + val.lastName;
        } else {
            val.showName = val.firstName + ' ';
        }
    }

    saveData(data) {
        localStorage.setItem('savedData', JSON.stringify(data));
    }

    getSavedData() {
        return JSON.parse(localStorage.getItem('savedData'));
    }

    clearSavedData() {
        localStorage.removeItem('savedData');
    }

    selectedInArray(allValues, selected) {
        const tempArr: any = [];
        allValues.forEach((val) => {
            selected.forEach((val1) => {
                if (val._id === val1._id) {
                    tempArr.push(val);
                }
            });
        });
        return tempArr;
    }

    findIndex(arr, key, val) {
        return _.findIndex(arr, function (o: any) {
            return o[key] || o === val;
        });
    }
    signUp(url, payload, isLoading?: boolean) {
        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });
    }
    sendEmail(url, email, isLoading?: boolean) {

        var body = {
            "email": email
        }

        return this.http.post<any>(this.apiEndpoint + url, body, { reportProgress: isLoading });
    }

    verifyOtp(url, email, otp, isLoading?: boolean) {


        var body = {
            "email": email,
            "code": otp
        }

        return this.http.post<any>(this.apiEndpoint + url, body, { reportProgress: isLoading });
    }
    verifyMobileOtp(url, payload, isLoading?: boolean) {


        // var body = {
        //    "mobile": mobile,
        //    "code":otp
        //   }

        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });
    }

    sendMobileOtp(url, payload, isLoading?: boolean) {
        console.log(url);


        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });
    }

    sendEmailtoForgotPassword(url, email, isLoading?: boolean) {
        console.log(url);

        var body = {
            "email": email
        }

        return this.http.post<any>(this.apiEndpoint + url, body, { reportProgress: isLoading });

    }

    Forgotpassword(url, email, Password, isLoading?: boolean) {
        console.log(url);

        var body = {
            "email": email,
            "password": Password
        }

        return this.http.post<any>(this.apiEndpoint + url, body, { reportProgress: isLoading });

    }

    //addedit account

    addEditAccount(url, payload, isLoading?: boolean) {

        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });

    }
    addEditCategory(url, payload, isLoading?: boolean) {
        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });
    }
    post(url, payload, isLoading?: boolean) {
        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });
    }
    // getAccount(url, isLoading?: boolean) {

    //     return this.http.get<any>(this.apiEndpoint + url, {reportProgress: isLoading});
    // }

    getAccount(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }

    getAccountById(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }

    getEntryById(url, isLoading?: boolean) {
        let tempApiUrl = 'https://7ed7fbec2962.ngrok.io/api/'
        return this.http.get<any>(this.apiEndpoint + url);
    }


    getBill(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }


    getCategories(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }

    getCategoriesSummary(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }

    getMonthlySummarydata(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }


    get(url, obj?, isLoading?: boolean) {
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }
    addAccountType(url, payload, isLoading?: boolean) {

        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });

    }


    getAllAccountType(url, obj?, isLoading?: boolean) {        
        let params = new HttpParams();
        if (obj) {
            Object.keys(obj).forEach(key => {
                if (obj[key] !== '' && obj[key] !== undefined) {
                    params = params.set(key, obj[key]);
                }
            });
        }
        return this.http.get<any>(this.apiEndpoint + url, { params: params, reportProgress: isLoading });
    }


    deleteAccount(url, id, isLoading?: boolean) {

        return this.http.delete<any>(this.apiEndpoint + url + '/' + id, { reportProgress: isLoading });


    }

    updateAccount(url, id, payload, isLoading?: boolean) {

        return this.http.post<any>(this.apiEndpoint + url + '/' + id, payload, { reportProgress: isLoading });

    }

    addGroup(url, payload, isLoading?: boolean) {

        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });

    }

    getAllGroup(url, isLoading?: boolean) {

        return this.http.get<any>(this.apiEndpoint + url, { reportProgress: isLoading });
    }

    deleteGroup(id) {
        return this.http.delete(this.apiEndpoint + 'groups/' + id);
    }
    editGroup(id, data) {
        return this.http.post(this.apiEndpoint + 'groups/' + id, data);
    }

    deleteAccountTypes(url, id, isLoading?: boolean) {

        return this.http.delete<any>(this.apiEndpoint + url + '/' + id, { reportProgress: isLoading });


    }

    deletePayees(id) {
        return this.http.delete(this.apiEndpoint + 'financialBeneficiaries/' + id);
    }

    deleteCategory(id) {
        return this.http.delete(this.apiEndpoint + 'categories/' + id);
    }


    // Add Edit Or Get All Budget

    addEditBudget(url, payload, isLoading?: boolean) {
        return this.http.post<any>(this.apiEndpoint + url, payload, { reportProgress: isLoading });
    }


    // Transaction

    deleteTransaction(id) {
        return this.http.delete(this.apiEndpoint + 'transactions/' + id);
    }

    //Classes

    deleteClasses(id) {
        return this.http.delete(this.apiEndpoint + 'classes/' + id);
    }


}

