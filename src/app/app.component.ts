import { Component, OnInit } from '@angular/core';
import { SfdataService } from './sfdata.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  chart = []; // This will hold our chart info

  constructor(private _sfdata: SfdataService) {}

  ngOnInit() {
    this._sfdata.weeklyData()
      .subscribe(res => {
        //console.log(res)
        // let temp_max = res['list'].map(res => res.main.temp_max);
        // let temp_min = res['list'].map(res => res.main.temp_min);
        // let alldates = res['list'].map(res => res.dt)

        let bookings = res['bookings']['data'];
        let cancells = res['cancellations']['data']

        let dailyArr = [];

        for (let item in bookings) {
            let tempItem = {date: "",booking: 0};

            tempItem.date = bookings[item]['label']


            tempItem.booking = bookings[item]['amount']



            dailyArr.push(tempItem)
        }

        for (let item in cancells) {
            let tempItem = {date: "",cancel: 0};
            tempItem.date = cancells[item]['label']
            tempItem.cancel = cancells[item]['amount']

            // loop through dailyArr
            // if object date matches tempItem.date append cancel amount
            // if not found make new tempItem with zero booking amount
            //
            let finddate = dailyArr.find(o => o.date === tempItem.date);

            if(finddate == undefined) {
                //console.log('no')
                dailyArr.push(tempItem)
            }

            for (let obj in dailyArr) {
                //console.log(dailyArr[obj].date)
                if(dailyArr[obj].date == tempItem.date) {
                    dailyArr[obj].cancellation = tempItem.cancel
                }
            }
            //dailyArr.push(tempItem)
        }

        //console.log("cancells: "+cancells.length)

        // loop through dailyArr get date, booking, and cancellation amounts
        // append them to their respective arrays
        // if its missing a cancel amount put zero for that



        //
        for (let daily in dailyArr) {
            dailyArr[daily].realdate = new Date(dailyArr[daily].date)
        }

        const sortedDaily = dailyArr.sort((a, b) => a.realdate - b.realdate)
        //console.log(sortedDaily)

        let days = []
        let bookingTotal = []
        let cancelTotal = []

        for (let chartitem in sortedDaily) {
            days.push(sortedDaily[chartitem].date)
            bookingTotal.push(sortedDaily[chartitem].booking)
            cancelTotal.push(sortedDaily[chartitem].cancellation)
        }


        this.chart = new Chart('canvas', {
          type: 'line',
          data: {
            labels: days,
            datasets: [
              {
                label: 'Bookings',
                data: bookingTotal,
                borderColor: "#1E90FF",
                borderWidth: 3,
                fill: false
              },
              {
                label: 'Cancellations',
                data: cancelTotal,
                borderColor: "#df4248",
                borderWidth: 3,
                fill: false
              },
            ]
          },
          options: {
            spanGaps: true,
            legend: {
              display: true
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                  scaleLabel: {
                      display: true,
                      labelString: 'USD'
                  },
                display: true,
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        value = value.toString();
                        value = value.split(/(?=(?:...)*$)/);
                        value = value.join(',');
                        return '$' + value;
                    }
                }
              }],
            }
          }
        });
      })
  }
}
