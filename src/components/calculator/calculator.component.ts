import { FoodConstants } from './../../core/constants';
import { FoodComponentsModel, FoodDataModel, TotalFoodComponentsModel } from './../../models/calculator-model';
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
  total: TotalFoodComponentsModel;
  constructor() { }

  ngOnInit() {
    this.tableIdCounter = 0;
    this.total = new TotalFoodComponentsModel();
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

    if(event.source !== undefined && !event.source.selected){
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
    this.UpdateTotal();
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  public updateQuantity(event: any, food: FoodComponentsModel): void {
    food.quantity = event.target.value;

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
    let index = this.ELEMENT_DATA.indexOf(updateItem);

    return index;
  }

  private fillFoodData(food: FoodComponentsModel, foodData: FoodDataModel){
    food.fat = foodData.fat * food.quantity;
    food.hydrates = foodData.hydrates * food.quantity;
    food.proteins = foodData.proteins * food.quantity;
    food.food = foodData.name;
    food.kcal =  this.calculateKcal(foodData, food.quantity);

    return food;
  }
  private calculateKcal(food: FoodDataModel, quantity: number): number {
    return quantity * ((food.proteins * FoodConstants.PROTEINS_PARAMETER) 
                          + (food.hydrates * FoodConstants.HYDRATES_PARAMETER) 
                          + (food.fat * FoodConstants.FAT_PARAMETER));
  }

  private getFoodDataByName(name: string): FoodDataModel {
    return this.foods.find(x => x.name === name);
  }

  private UpdateTotal(): void {
    this.total.totalKcal = this.ELEMENT_DATA.map(x => x.kcal).reduce((acc, value) => acc + value, 0);
    this.total.totalProteins = this.ELEMENT_DATA.map(x => x.proteins).reduce((acc, value) => acc + value, 0);
    this.total.totalHydrates = this.ELEMENT_DATA.map(x => x.hydrates).reduce((acc, value) => acc + value, 0);
    this.total.totalFat = this.ELEMENT_DATA.map(x => x.fat).reduce((acc, value) => acc + value, 0);
  }
}

