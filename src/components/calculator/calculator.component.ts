import { FoodConstants } from './../../core/constants';
import { FoodComponentsModel, FoodDataModel } from './../../models/calculator-model';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatOptionSelectionChange} from '@angular/material';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  //constants
   PROTEINS_CONST: number = 4;

  tableIdCounter: number;
  ELEMENT_DATA: FoodComponentsModel[] = [];
  displayedColumns: string[] = ['quantity', 'food', 'proteins', 'fat','hydrates','kcal'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  foods: FoodDataModel[] = [{name: 'Pollo', weight: 100,weightUnit: 'gr', proteins: 22.2, fat: 4.3, hydrates: 0}, {name: 'Ternera', weight: 100,weightUnit: 'gr', proteins: 52.2, fat: 2.3, hydrates: 0}];
  quantities: number[] = [1,2,3,4,5,6,7,8,9,10];
  constructor() { }

  ngOnInit() {
    this.tableIdCounter = 0;
  }

  //public methods
  public addRow() {
    console.log('AddRow');

    let newRow = new FoodComponentsModel();
    newRow.tableId = this.tableIdCounter;
    this.tableIdCounter ++;

    this.ELEMENT_DATA.push(newRow);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  public removeRow(): void{
    if(this.ELEMENT_DATA.length){
      console.log('DeleteRow');
      this.ELEMENT_DATA.pop();
      this.tableIdCounter --;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    }
  }

  public updateFoodData(event: MatOptionSelectionChange, food: FoodComponentsModel, foodData: FoodDataModel): void {

    if(!event.source.selected){
      return;
    }

    if(food.quantity <= 0 || food.quantity == undefined){
      food.quantity = 1;    
    }    

    if(foodData == null){
      return;
    }
    
    food = this.fillFoodData(food, foodData);

    let index = this.getIndexOfElementByTableId(food.tableId);

    this.ELEMENT_DATA[index] = food;
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  public updateQuantity(event: MatOptionSelectionChange, food: FoodComponentsModel, quantity: number): void{

    if(!event.source.selected){
      return;
    }

    food.quantity = quantity;

    if(food.food === undefined || food.food === ''){   
      let index = this.getIndexOfElementByTableId(food.tableId);
      this.ELEMENT_DATA[index] = food;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);      
    }
    else{
      let foodData = this.getFoodDataByName(food.food);
      this.updateFoodData(event,food, foodData);
    }
  }

  //private methods
  private getIndexOfElementByTableId(tableId: number): number{
    let updateItem = this.ELEMENT_DATA.find(x => x.tableId == tableId);
    console.log('PARA ACTUALIZAR: ' + updateItem.tableId);
    let index = this.ELEMENT_DATA.indexOf(updateItem);
    console.log('EL INDICE: ' + index);

    return index;
  }

  private fillFoodData(food: FoodComponentsModel, foodData: FoodDataModel){
    food.fat = foodData.fat;
    food.hydrates = foodData.hydrates;
    food.proteins = foodData.proteins;
    food.food = foodData.name;
    food.kcal =  this.calculateKcal(food);

    return food;
  }
  private calculateKcal(food: FoodComponentsModel): number {
    return food.quantity * ((food.proteins * FoodConstants.PROTEINS_PARAMETER) 
                          + (food.hydrates * FoodConstants.HYDRATES_PARAMETER) 
                          + (food.fat * FoodConstants.FAT_PARAMETER));
  }

  private getFoodDataByName(name: string): FoodDataModel {
    return this.foods.find(x => x.name === name);
  }
}

