import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { FoodAdminComponent } from './components/food-admin/food-admin.component';

const routes: Routes = [
    {path: 'calculator', component: CalculatorComponent},
    {path:'', redirectTo: '/calculator', pathMatch: 'full'},
    {path: 'admin', component: FoodAdminComponent}
  ];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
