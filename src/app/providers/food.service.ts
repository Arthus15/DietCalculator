import { FoodDataModel } from './../models/calculator-model';
import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  foodData: FoodDataModel[] = [];

  constructor(private _electronService: ElectronService) { }

  public loadFood(): FoodDataModel[] {

    try{      
    //Read File
    var data = this._electronService.fs.readFileSync('dist/db.txt', {encoding: 'utf8'});  

    var parsedData = data.split('/');

    for(var i = 0; i < parsedData.length; i++){
        this.foodData.push(this.createFoodModelFromString(parsedData[i]));
    }

    }
    catch(err){
      console.log(err);
    }
    return this.foodData;
  }

  private createFoodModelFromString(food: string): FoodDataModel{

    var foodSplited = food.split(',');

    let foodDataModel = new FoodDataModel();

    foodDataModel.name = foodSplited[0].trim();
    foodDataModel.weight = Number.parseInt(foodSplited[1].trim());
    foodDataModel.weightUnit = foodSplited[2].trim();
    foodDataModel.proteins = Number.parseInt(foodSplited[3].trim());
    foodDataModel.fat = Number.parseInt(foodSplited[4].trim());
    foodDataModel.hydrates = Number.parseInt(foodSplited[5].trim());
    
    return foodDataModel;
  }
}
