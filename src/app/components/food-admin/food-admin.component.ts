import { Component, OnInit, ViewChild } from '@angular/core';
import { FoodService } from '../../providers/food.service';
import { FoodDataModel } from '../../models/calculator-model';
import { MatTableDataSource, MatPaginator } from '@angular/material';


@Component({
  selector: 'app-food-admin',
  templateUrl: './food-admin.component.html',
  styleUrls: ['./food-admin.component.css']
})
export class FoodAdminComponent implements OnInit {
  
  //Properties
  ELEMENT_DATA: FoodDataModel[] = [];
  displayedColumns: string[] = ['food', 'unit', 'proteins', 'fat','hydrates'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  hasFileLoad = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private _foodService: FoodService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  //Public Method

  public fileUpload(event : Event) {
    var reader = new FileReader();
    console.log('EL EVENTO: ' + (<HTMLInputElement>event.target).files[0]);
    reader.readAsText((<HTMLInputElement>event.target).files[0]);
    var me = this;
    reader.onload = function () {
      var fileElement = me._foodService.loadFood(reader.result.toString());
      
      fileElement.forEach(element => {
        me.ELEMENT_DATA.push(element);
      });
      me.dataSource = new MatTableDataSource(me.ELEMENT_DATA);
      me.dataSource.paginator = me.paginator;
      me.hasFileLoad = true;
    }
  }
}