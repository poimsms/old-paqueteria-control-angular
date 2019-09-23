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
  // public lineChartPlugins = [pluginAnnotations];

  riders = [];
  dias = [];

  showBusqueda = false;

  filtro = {
    diaInput: {
      start: '2019-08-23',
      end: '2019-08-23'
    },
    dia: {
      start: new Date(2019, 8, 23).getTime(),
      stop: new Date(2019, 9, 5).getTime()
    },
    hora: {
      start: 10,
      end: 18
    },
    horaInput: {
      start: '10:00',
      end: '18:00'
    }
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  constructor(private _data: DataService) {

    this.lineChartData = [{
      data: [
        100, 59, 80, 81, 56, 55, 40,
        100, 59, 80, 81, 56, 55, 40,
        100, 59, 80, 81, 56, 55, 40,
        100, 59, 80, 81, 56, 55, 40
      ], label: 'Riders activos | 10:00 - 18:00 | 14 de Junio 2019 - 14 de Agosto 2019'
    }]
    this.lineChartLabels = [
      '15 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago',
      '15 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago',
      '15 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago',
      '15 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago', '16 Ago'

    ]
  }

  ngOnInit() {
  }

  buscar() {

    const yearStart = Number(this.filtro.diaInput.start.split('-')[0]);
    const mesStart = Number(this.filtro.diaInput.start.split('-')[1]);
    const diaStart = Number(this.filtro.diaInput.start.split('-')[2]);

    const yearEnd = Number(this.filtro.diaInput.end.split('-')[0]);
    const mesEnd = Number(this.filtro.diaInput.end.split('-')[1]);
    const diaEnd = Number(this.filtro.diaInput.end.split('-')[2]);

    const startSeconds = new Date(yearStart, mesStart, diaStart).getTime();
    const endeconds = new Date(yearEnd, mesEnd, diaEnd, 23, 59).getTime();


    let body = {
      dia: {
        start: startSeconds,
        end: endeconds
      },
      hora: {
        start: this.filtro.hora.start,
        end: this.filtro.hora.end
      }
    }
    
    console.log(body)

    // this._data.getRidersEnPlataforma(this.filtro).then((data: any) => {
    //   if (data.ok) {
    //     this.lineChartData = [{ data: data.riders, label: 'Riders activos' }];
    //     this.lineChartLabels = data.dias
    //   }
    // });
  }

  close_busqueda() {
    this.showBusqueda = false;
  }

  updateFiltro(num, texto, tipo) {
    if (tipo == 'hora_start') {
      this.filtro.horaInput.start = texto;
      this.filtro.hora.start = num;
    }
    if (tipo == 'hora_end') {
      this.filtro.horaInput.end = texto;
      this.filtro.hora.end = num;
    }
    if (tipo == 'dia_start') {
      this.filtro.diaInput.start = texto;
      this.filtro.dia.start = new Date(num[0], num[1], num[2]).getTime();
    }
  }

  
  obtenerRiders() {
    this._data.getRidersEnPlataforma(this.filtro).then((data: any) => {
      if (data.ok) {
        this.lineChartData = [{ data: data.riders, label: 'Riders activos' }];
        this.lineChartLabels = data.dias
      }
    })
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  


}
