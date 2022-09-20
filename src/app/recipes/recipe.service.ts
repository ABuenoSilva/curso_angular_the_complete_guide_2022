import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.module";

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe('Teste Recipe',
      'This is simply a test',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg',
      [
        new Ingredient('Farinha', 500),
        new Ingredient('Milk', 1)
      ]),
    new Recipe('Teste NOVO Recipe',
      'This is simply a NOVO test',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg',
      [
        new Ingredient('Bread',2),
        new Ingredient('Cheese',1),
        new Ingredient('Meat',2)
      ])
  ];

  constructor(private slService: ShoppingListService) {}

    getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes.slice()[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

}
