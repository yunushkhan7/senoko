import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.scss']
})
export class DoughnutComponent implements OnInit {

  @ViewChild('canvasNetWorth') canvas: ElementRef<HTMLCanvasElement>;
  DEFAULT_COLORS2 = ['#7fb7be', '#357266', '#dacc3e', '#bc2c1a', '#7d1538'];
  dataArray :any = []
  labelArray :any = []
  showLoader: boolean;
  nodataContract:any;
  constructor(
    private _dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // var ctx = this.canvas?.nativeElement?.getContext('2d');

    // var myChart3 = new Chart(ctx, {
    //   type: 'doughnut',
    //   data: {
    //     datasets: [
    //       {
    //         data: [30, 40, 90, 60],
    //         // backgroundColor: this.DEFAULT_COLORS2,
    //         backgroundColor: [
    //           'rgb(255, 99, 132)',
    //           'rgb(255, 159, 64)',
    //           'rgb(255, 205, 86)',
    //           'rgb(75, 192, 192)',
    //           'rgb(54, 162, 235)',
    //         ],
    //         label: 'Dataset 1',
    //       },
    //     ],
    //     labels: ['Contractor', 'LT Contractor', 'Visitor', 'Staff'],
    //   },
    //   options: {
    //     responsive: true,
    //     animation: {
    //       animateScale: true,
    //       animateRotate: true,
    //     },
    //   },
    // });
    this.getTimeBasedTodayRegistration();
  }

  getFirstLetterCapital(key){
   
   
    let first = key.substring(0,1).toUpperCase();
    return first + key.substring(1); 
  }

  getTimeBasedTodayRegistration() {
    var ctx = this.canvas?.nativeElement?.getContext('2d');
    let fields = []
    let valueData = []
    this._dashboardService.getOnSitePersonal().subscribe((response) => {
      this.showLoader = false;
      if (response?.data) {
         for (let [key, value] of Object.entries(response?.data)) {
          if(value > 0){
            fields.push(this.getFirstLetterCapital(key))
            valueData.push(value)
          }else{
            if(response?.data?.contractors==0 && response?.data?.ltContractors==0 && response?.data?.staff==0 && response?.data?.visitors==0){
              this.nodataContract = "No Data"
            }
          }
        } 
      } else {
      }
      var myChart3 = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: valueData,
              // backgroundColor: this.DEFAULT_COLORS2,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                // 'rgb(54, 162, 235)',
              ],
              label: 'Dataset 1',
            },
          ],
          // labels: ['Contractor', 'LT Contractor', 'Visitor', 'Staff'],
          labels: fields,
        },
        options: {
          responsive: true,
          animation: {
            animateScale: true,
            animateRotate: true,
          },
        },
      });
    },
      (error) => {
        this.showLoader = false;
      }
    );
  }
  

}
