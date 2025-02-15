import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {
 
  public dataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#175e1a',
                '#5e175a',
                '#e238bb'
            ]
        }
    ],
    labels: [
    ]
};


  constructor(private http: HttpClient) { 

  }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res:any) => {
      for (let i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
      }
      this.createChart();
    });
  }


  createChart() {
    var canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
        var ctx = canvas.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'pie',
                data: this.dataSource
            });
        }
    }
  }

}
