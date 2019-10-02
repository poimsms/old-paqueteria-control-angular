import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { DataService } from 'src/app/services/data.service';
// import * as pluginAnnotations from 'chartjs-plugin-annotation';
@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          ticks: {
            display: false,
          },
          gridLines: {
            drawOnChartArea: false
          }

        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  riders = [];
  dias = [];

  showBusqueda = false;

  filtro = {
    diaInput: {
      start: '2019-09-23',
      end: '2019-10-31'
    },
    dia: {
      start: new Date(2019, 8, 1, 0, 0).getTime(),
      end: new Date(2019, 9, 31, 23, 59).getTime()
    }
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(private _data: DataService) {

    this.lineChartData = [{ data: [100], label: 'Riders activos' }];
    this.lineChartLabels = ['15 Ago'];
    this.getRegistros(this.filtro);
  }

  ngOnInit() {
  }

  buscar() {

    const yearStart = Number(this.filtro.diaInput.start.split('-')[0]);
    const mesStart = Number(this.filtro.diaInput.start.split('-')[1]) - 1;
    const diaStart = Number(this.filtro.diaInput.start.split('-')[2]);

    const yearEnd = Number(this.filtro.diaInput.end.split('-')[0]);
    const mesEnd = Number(this.filtro.diaInput.end.split('-')[1]) - 1;
    const diaEnd = Number(this.filtro.diaInput.end.split('-')[2]);

    const startSeconds = new Date(yearStart, mesStart, diaStart).getTime();
    const endeconds = new Date(yearEnd, mesEnd, diaEnd, 23, 59).getTime();


    let filtro = {
      dia: {
        start: startSeconds,
        end: endeconds
      }
    }
    this.getRegistros(filtro);
  }

  close_busqueda() {
    this.showBusqueda = false;
  }

  getRegistros(filtro) {
    this._data.getRegistros(filtro).then((data: any) => {
      if (data.ok) {
        this.lineChartData = [{ data: data.riders, label: 'Riders activos' }];
        this.lineChartLabels = data.dias;
      }
    });
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }




}
