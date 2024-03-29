import { FoodService } from './../../providers/food.service';
import { FoodComponentsModel, FoodDataModel, TotalFoodComponentsModel } from './../../models/calculator-model';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FoodConstants } from '../../models/constants';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  
  hasFileLoad : boolean = false;
  tableIdCounter: number;
  ELEMENT_DATA: FoodComponentsModel[] = [];
  displayedColumns: string[] = ['select','quantity', 'food', 'proteins', 'fat','hydrates','kcal'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  foods: FoodDataModel[] = []
  fullFoods: FoodDataModel[] = []
  quantities: number[] = [1,2,3,4,5,6,7,8,9,10];
  total: TotalFoodComponentsModel;
  selection = new SelectionModel<FoodComponentsModel>(true, []);

  constructor(private _foodService: FoodService) { }

  ngOnInit() {
    this.tableIdCounter = 0;
    this.total = new TotalFoodComponentsModel();
  }

  //public methods
  public addRow() {
    let newRow = new FoodComponentsModel();
    newRow.tableId = this.tableIdCounter;
    this.tableIdCounter ++;

    this.ELEMENT_DATA.push(newRow);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  public removeRow(): void{
    if(this.ELEMENT_DATA.length){
      this.ELEMENT_DATA.pop();
      this.tableIdCounter --;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    }
  }

  public updateFoodData(event: MatOptionSelectionChange, food: FoodComponentsModel, foodData: FoodDataModel): void {

    if(event.source !== undefined && !event.source.selected){
      return;
    }

    if(food.quantity == undefined){
      food.quantity = 0;    
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

  public fileUpload(event : Event) {
    var reader = new FileReader();
    console.log('EL EVENTO: ' + (<HTMLInputElement>event.target).files[0]);
    reader.readAsText((<HTMLInputElement>event.target).files[0]);
    var me = this;
    reader.onload = function () {
      me.foods = me._foodService.loadFood(reader.result.toString());
      me.fullFoods = me.foods;
    }
    this.hasFileLoad = true;
  }

  public filterMyOptions(searchInput : string) {
    this.foods = this.fullFoods;
    this.foods = this.foods.filter(x => x.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));
  }

  public deleteSelectedRows() : void {
    var noSelectedFoods: FoodComponentsModel[] = [];

    for(var i = 0; i < this.ELEMENT_DATA.length; i++){
      let row = this.ELEMENT_DATA[i];
      if(!this.selection.isSelected(row) && row !== undefined){
        row.tableId = i;
        noSelectedFoods.push(row);
      }
    }

    this.ELEMENT_DATA = noSelectedFoods;
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  //Select rows

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FoodComponentsModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${this.ELEMENT_DATA.indexOf(row) + 1}`;
  }

  //private methods
  private getIndexOfElementByTableId(tableId: number): number{
    let updateItem = this.ELEMENT_DATA.find(x => x.tableId == tableId);
    let index = this.ELEMENT_DATA.indexOf(updateItem);

    return index;
  }

  private fillFoodData(food: FoodComponentsModel, foodData: FoodDataModel){
    food.fat = parseFloat((foodData.fat * food.quantity).toFixed(2));
    food.hydrates = parseFloat((foodData.hydrates * food.quantity).toFixed(2));
    food.proteins = parseFloat((foodData.proteins * food.quantity).toFixed(2));
    food.food = foodData.name;
    food.kcal =  parseFloat(this.calculateKcal(foodData, food.quantity).toFixed(2));

    return food;
  }
  private calculateKcal(food: FoodDataModel, quantity: number): number {
    return (quantity * ((food.proteins * FoodConstants.PROTEINS_PARAMETER) 
                          + (food.hydrates * FoodConstants.HYDRATES_PARAMETER) 
                          + (food.fat * FoodConstants.FAT_PARAMETER)));
  }

  private getFoodDataByName(name: string): FoodDataModel {
    return this.foods.find(x => x.name === name);
  }

  private UpdateTotal(): void {
    this.total.totalKcal = parseFloat(this.ELEMENT_DATA.map(x => x.kcal).reduce((acc, value) => acc + value, 0).toFixed(2));
    this.total.totalProteins = parseFloat(this.ELEMENT_DATA.map(x => x.proteins).reduce((acc, value) => acc + value, 0).toFixed(2));
    this.total.totalHydrates = parseFloat(this.ELEMENT_DATA.map(x => x.hydrates).reduce((acc, value) => acc + value, 0).toFixed(2));
    this.total.totalFat = parseFloat(this.ELEMENT_DATA.map(x => x.fat).reduce((acc, value) => acc + value, 0).toFixed(2));
  }
}

