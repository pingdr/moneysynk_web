// @Packages
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

// @Services
import { ToastrService } from 'ngx-toastr';


declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public IMAGE_FILE_FORMAT: string = "jpeg|jpg|png|gif|bmp";

  constructor(private _toastr: ToastrService,
    private _router: Router,
) { }

  isNullOrEmpty(item) {
    if (item == null || item == '' || item == undefined) {
      return true;
    } else {
      return false;
    }
  }

  isEmptyObject(obj) {
    if (obj) {
      if (Object.keys(obj).length === 0) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  isNumeric(item) {
    if (!this.isNullOrEmpty(item)) {
      return !isNaN(item);
    }
    return false;
  }

  

  convertToNumber(value): number {
    if (!this.isNullOrEmpty(value)) {
      return Number(value);
    } else {
      return Number(0);
    }
  }


  parseString(value): string {
    if (!this.isNullOrEmpty(value) && value !== 'null') {
      return value.toString();
    } else {
      return "";
    }
  }

  parseBoolean(value): boolean {
    if (!this.isNullOrEmpty(value) && (value == 1 || value == "1" || value == "true")) {
      return true;
    } else {
      return false
    }
  }

  parseBooleanToString(value): string {
    if (!this.isNullOrEmpty(value) && (value == 1 || value == true)) {
      return "true";
    } else {
      return "false";
    }
  }

  startsWith(text, prefixText): boolean {
    if (!this.isNullOrEmpty(text)) {
      if (text.startsWith(prefixText)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  endsWith(text, postfixText): boolean {
    if (!this.isNullOrEmpty(text)) {
      if (text.endsWith(postfixText)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  onlyNumeric(event) {
    //46    -   Period(.)
    if ((event.which != 46 || event.key.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
      //event.preventDefault();
      return true;
    }
  }

  numberOnly(event): boolean {
    //46    -   Period(.)
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
      return false;
    }
    return true;

  }

  isNumericKey(event) {

    let charCode = (event.which) ? event.which : event.keyCode
    let value = event.key;
    let dotcontains = value.indexOf(".") != -1;
    let minuscontains = value.indexOf("-") != -1;
    if (dotcontains) {
      if (charCode == 46) return true;
      else return false;
    }

    if (minuscontains) {
      if (charCode == 45) return true;
      else return false;
    }

    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }

  formatNumberWithDecimal(number, decimalPlaces) {
    if (number != null && number != '' && number != undefined) {
      return Number(number).toFixed(decimalPlaces);
    }
    return "0.00";
  }

  lower(item) {
    if (!this.isNullOrEmpty(item)) {
      return item.toLowerCase().trim();
    }
    return "";
  }

  upper(item) {
    if (!this.isNullOrEmpty(item)) {
      return item.toUpperCase().trim();
    }
    return "";
  }

  trim(item) {
    if (!this.isNullOrEmpty(item)) {
      return item.trim();
    }
    return "";
  }

  showLoader() {
    $('#divLoader').show();
  }

  hideLoader() {
    $('#divLoader').hide();
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  showToaster(message: string, toastrType: string) {
    switch (toastrType) {
      case "success":
        setTimeout(() => this._toastr.success(message, "Success!"));
        break;
      case "error":
        setTimeout(() => this._toastr.error(message, "Error!"));
        break;
      case "warning":
        setTimeout(() => this._toastr.warning(message, "Warning!"));
        break;
      case "info":
        setTimeout(() => this._toastr.info(message, "Info!"));
        break;
    }
  }

  showToasterTopCenter(message: string, toastrType: string) {
    switch (toastrType) {
      case "success":
        setTimeout(() => this._toastr.success(message, "Success!", {
          positionClass: "toast-top-center"
        }));
        break;
      case "error":
        setTimeout(() => this._toastr.error(message, "Error!", {
          positionClass: "toast-top-center"
        }));
        break;
      case "warning":
        setTimeout(() => this._toastr.warning(message, "Warning!", {
          positionClass: "toast-top-center"
        }));
        break;
      case "info":
        setTimeout(() => this._toastr.info(message, "Info!", {
          positionClass: "toast-top-center"
        }));
        break;
    }
  }



  /*** Date Utility Functions START ****/

  

  /*** Date Utility Functions END ****/

  redirectToUnauthorizePage() {
    this._router.navigate(['/unauthorize']);
  }

  removeArrayItemByValue(arr, item) {
    if (arr != null && arr.length > 0) {
      const index: number = arr.indexOf(item);
      if (index !== -1) {
        arr.splice(index, 1);
      }
    }
    return arr;
  }

  removeArrayItemByIndex(arr, index) {
    if (arr != null && arr.length > 0) {
      if (index !== -1) {
        arr.splice(index, 1);
      }
    }
    return arr;
  }

  

  dropdownArray(array: any, idColumnName, valueColumnName) {
    //let resultArray = [{id:0,text:'All'}];
    let resultArray = [];
    if (array != null && array != undefined && array.length > 0) {
      array.forEach((item, index) => {
        //console.log(index);
        let id = item[idColumnName];
        let name = item[valueColumnName];

        let result = {
          id: id,
          text: name
        }
        resultArray.push(result);
      })
    }
    return resultArray;
  }
  dropdownArrayDistributor(array: any, idColumnName, valueColumnName) {
    let resultArray = [];
    if (array != null && array != undefined && array.length > 0) {
      //resultArray.push({id:0,text:'All'});
      array.forEach((item, index) => {
        //console.log(index);
        let id = item[idColumnName];
        let name = item[valueColumnName];

        let result = {
          id: id,
          text: name
        }
        resultArray.push(result);
      })
    }
    return resultArray;
  }

  dropdownArrayDistributorGroup(array: any, idColumnName, valueColumnName) {
    let resultArray = [];
    if (array != null && array != undefined && array.length > 0) {
      //resultArray.push({id:0,text:'All'});
      array.forEach((item, index) => {
        //console.log(index);
        let id = item[idColumnName];
        let name = item[valueColumnName];

        let result = {
          id: id,
          text: name
        }
        resultArray.push(result);
      })
    }
    return resultArray;
  }

}

export enum DateFormat {
  DDMMYYYY = "dd/MM/yyyy",
  MMDDYYYY = "MM/dd/yyyy",
  YYYYMMDD = "yyyy/MM/dd",
  DDMMMYYYY = "dd/MMM/yyyy"
}

export enum DateSeprator {
  SLASH = "/",
  DASH = "-",
  DOT = "."
}




