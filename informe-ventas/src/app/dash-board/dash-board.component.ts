import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter } from '../constants/filter';
import { formatDate } from '../utils/form-utils';
import { link } from 'fs';
import { values } from '../constants/values';
import { SalesService } from '../services/sales.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit{
  

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Reporte Ventas', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Reporte Ventas', cols: 2, rows: 1 }
      ];
    })
  );

  
  public filterList:any[]=[];
  public headers:any[] = [];
  public valueList:any[]=[];
  public dataSource:any[] = [];
  public filterForm!:FormGroup;
  public columns:string = "columns[]=";
  public parameters:string = ''; 
  public linkParams:string="";
  public value:string = "";
  public total:any;
  public flagPrice:boolean=true;
  public subtotalesDate:any;
  public tableData:any[]=[];

  constructor(private breakpointObserver: BreakpointObserver, private formBuilder: FormBuilder,private snackBar: MatSnackBar,
              private salesService:SalesService) {}
  
  
  ngOnInit(): void {
      this.subtotalesDate = new Map<string, { cantidad: number; precio: number }>();
      this.initForm();
      this.getFilters();
      this.getValues();
  }


  getFilters():void{
    this.filterList = filter;
  }

  getValues():void{
    this.valueList = values;
  }
  initForm():void{
      this.filterForm = this.formBuilder.group({
         filter: new FormControl('',[Validators.required]),
         dateini: new FormControl("", [Validators.required]),
         datefin: new FormControl("", [Validators.required]),
         value: new FormControl("",[Validators.required])
      })
  }

  onChangeFilter(id:any):void{
    this.parameters = "";
    const field = this.filterList.filter(f => f.id == id)[0].fields.split(',');
    this.headers = field;
    console.log('FIELDS: ',field);
    for(let i = 0; i < field.length; i++ ){
        this.parameters = this.parameters.concat(this.columns).concat(field[i]).concat('&');
    }
    this.headers.push('value');
  }

  onChangeValue(id:any):void{
      this.value = "value=";
      this.headers.pop();
      this.headers.push(id);
      this.value = this.value.concat(id);
  }

  find():void{
      const dateIni = 'dateini='+formatDate(JSON.stringify(this.filterForm.get('dateini')?.value));
      const datefin = '&datefin='+formatDate(JSON.stringify(this.filterForm.get('datefin')?.value));
      this.linkParams = this.linkParams.concat(dateIni).concat(datefin).concat('&').concat(this.parameters).concat(this.value);
      this.salesService.reportSales(this.linkParams).subscribe(response =>{
            this.dataSource = response
            this.subtotalByDate(this.dataSource);
            if(this.value == 'value=price'){
              this.flagPrice = true;
              this.total = this.dataSource.reduce((total, item) => total + item.price, 0);
            }else{
              this.total = this.dataSource.reduce((total, item) => total + item.stems, 0);
              this.flagPrice = false;
            }
            
      });
  }

  subtotalByDate(data: any[]) {
    data.forEach((item: any) => {
      const date = item.date;
      if (!this.tableData.includes(date)) {
        this.tableData.push(date);
      }
    });
  }

}
