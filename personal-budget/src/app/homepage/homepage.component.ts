import { AfterViewInit, Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import * as d3 from 'd3';
import { DataService } from '../data.service';

Chart.register(...registerables);

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {
  constructor(private dataService: DataService) {}

  myBudget: any[] = []; 

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
    labels: []
  };

  private width = 500;  
  private height = 350;  
  private radius = Math.min(this.width, this.height) / 2.2;
  private svg: any;
  private color: any;
  private pie: any;
  private arc: any;
  private outerArc: any;


  ngAfterViewInit(): void {
    this.dataService.getBudget().subscribe(data => {
      this.myBudget = data;

      this.dataSource.datasets[0].data = data.map(item => item.budget);
      this.dataSource.labels = data.map(item => item.title);

      this.createChart();
      this.setupChart();
      this.transposeData();
    });
  }
  
  createChart() {
    const canvas = document.getElementById('myChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'pie',
          data: this.dataSource
        });
      }
    }
  }
  private setupChart(): void {
    const container = document.getElementById('myChart2');

    this.svg = d3.select(container)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

    this.svg.append("g").attr("class", "slices");
    this.svg.append("g").attr("class", "labels");
    this.svg.append("g").attr("class", "lines");

    this.color = d3.scaleOrdinal()
      .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    this.pie = d3.pie<any>()
      .sort(null)
      .value((d: any) => d.value);

    this.arc = d3.arc()
      .outerRadius(this.radius * 0.75) 
      .innerRadius(this.radius * 0.4);

    this.outerArc = d3.arc()
      .outerRadius(this.radius * 0.85) 
      .innerRadius(this.radius * 0.5);
  }

  private transposeData(): void {
    const budgetData = this.myBudget.map((d: any) => ({
      label: d.title,
      value: d.budget
    }));
    this.updateChart(budgetData);
  }

  private updateChart(data: any[]): void {
    const key = (d: any) => d.data.label;

    const slice = this.svg.select(".slices").selectAll("path.slice")
      .data(this.pie(data), key);

    slice.enter()
      .append("path")
      .attr("class", "slice")
      .style("fill", (d: any) => this.color(d.data.label))
      .merge(slice)
      .transition().duration(1000)
      .attrTween("d", (d: any) => {
        let _current = d;
        const interpolate = d3.interpolate(_current, d);
        _current = interpolate(0);
        return (t: any) => this.arc(interpolate(t));
      });

    slice.exit().remove();

    const text = this.svg.select(".labels").selectAll("text").data(this.pie(data), key);
    
    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    const radius = this.radius;

    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text((d) => d.data.label)
      .merge(text)
      .transition().duration(1000)
      .attrTween("transform", function(d) {
        const interpolate = d3.interpolate(d, d);
        return function(t) {
          const d2 = interpolate(t);
          let pos = d3.arc().outerRadius(radius * 1.01).innerRadius(radius * 1.01).centroid(d2); 
          return `translate(${pos[0]}, ${pos[1]})`;
        };
      })
      .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end")) 
      .style("font-size", "14px")
      .style("font-weight", "bold");

    text.exit().remove();
  }
}
