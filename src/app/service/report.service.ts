import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  API_URL: string = environment.APIEndpoint+ 'api/v1/';

  DateFormatter = {
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    formatDate: function (date, format) {
      var self = this;
      format = self.getProperDigits(format, /d+/gi, date?.getDate());
      format = self.getProperDigits(format, /M+/g, date?.getMonth() + 1);
      format = format.replace(/y+/gi, function (y) {
        var len = y.length;
        var year = date?.getFullYear();
        if (len == 2)
          return (year + "").slice(-2);
        else if (len == 4)
          return year;
        return y;
      })
      format = self.getProperDigits(format, /H+/g, date?.getHours());
      format = self.getProperDigits(format, /h+/g, self?.getHours12(date?.getHours()));
      format = self.getProperDigits(format, /m+/g, date?.getMinutes());
      format = self.getProperDigits(format, /s+/gi, date?.getSeconds());
      format = format.replace(/a/ig, function (a) {
        var amPm = self.getAmPm(date?.getHours())
        if (a === 'A')
          return amPm.toUpperCase();
        return amPm;
      })
      format = self.getFullOr3Letters(format, /d+/gi, self.dayNames, date?.getDay())
      format = self.getFullOr3Letters(format, /M+/g, self.monthNames, date?.getMonth())
      return format;
    },
    getProperDigits: function (format, regex, value) {
      return format.replace(regex, function (m) {
        var length = m.length;
        if (length == 1)
          return value;
        else if (length == 2)
          return ('0' + value).slice(-2);
        return m;
      })
    },
    getHours12: function (hours) {
      // https://stackoverflow.com/questions/10556879/changing-the-1-24-hour-to-1-12-hour-for-the-gethours-method
      return (hours + 24) % 12 || 12;
    },
    getAmPm: function (hours) {
      // https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
      return hours >= 12 ? 'pm' : 'am';
    },
    getFullOr3Letters: function (format, regex, nameArray, value) {
      return format.replace(regex, function (s) {
        var len = s.length;
        if (len == 3)
          return nameArray[value].substr(0, 3);
        else if (len == 4)
          return nameArray[value];
        return s;
      })
    }
  }

  constructor(
    private http: HttpClient,
  ) { }


  
  getAllReport(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetAllRegistration`, params);
  }

  getReports(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetReports`, params);
  }

  saveReport(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/SaveRegistration`, data);
  }

  getReportById(id): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/GetRegistrationById?id=${id}`);
  }


  GetAllReportDownload(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetReportExportExcell`, data);
  }

  getUnReturnedPass(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetAllUnreturnedPassesReports`, params);
  }

  GetUnReturnedPassDownload(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetUnreturnedPassesExportExcell`, data);
  }

  getSystemLogsExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}SystemLogs/GetSystemLogsExportExcell`, data);
  }
  getAllUserAuditExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}SystemLogs/GetAllUserAuditExportExcell`, data);
  }

  getRegistrationByIdCheckOut(id): Observable<any> {
    return this.http.get(`${this.API_URL}Registration/RegistrationByIdCheckOut?id=${id}`);
  }

  getRollCallReportExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetRollCallReportExportExcell`, data);
  }

  getIndividualAttendanceExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetIndividualAttendanceExportExcell`, data);
  }

  getDailyEntryReporExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetDailyEntryReporExportExcell`, data);
  }

  getRollCallGroupExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetRollCallGroupExportExcell`, data);
  }

  getAccessLogReportExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetAccessLogReportExportExcell`, data);
  }

  getCheckinStationReportExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetCheckinStationReportExportExcell`, data);
  }

  getDooreReleaseReportExportExcell(data): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetDooreReleaseExportExcell`, data);
  }

  getDooreRelease(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetDooreRelease`, params);
  }

  getAllIndividualAttendanceReports(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetAllIndividualAttendanceReports`, params);
  }

  getAllDailyEntryReports(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetAllDailyEntryReports`, params);
  }

  getAllRollcallReports(params): Observable<any> {
    return this.http.post(`${this.API_URL}Registration/GetAllRollcallReports`, params);
  }

}
