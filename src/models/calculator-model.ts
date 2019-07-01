export class FoodComponentsModel {
  tableId: number;
  quantity: number;
  food: string;
  proteins: number;
  fat: number;
  hydrates: number;
  kcal: number;
}

export class FoodDataModel {
  name: string;
  weight: number;
  weightUnit: string;
  proteins: number;
  fat: number;
  hydrates: number;
}

export class TotalFoodComponentsModel {
  totalProteins: number;
  totalFat: number;
  totalHydrates: number;
  totalKcal: number;

  constructor(){
    this.totalProteins = 0;
    this.totalFat = 0;
    this.totalHydrates = 0;
    this.totalKcal = 0;
  }
}