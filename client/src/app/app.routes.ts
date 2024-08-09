import {Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {isAuthGuard} from "./shared/classes/auth.guard";
import {DashboardPageComponent} from "./admin-pages/dashboard-page/dashboard-page.component";
import {OverviewPageComponent} from "./restaurateur-pages/overview-page/overview-page.component";
import {UsersPageComponent} from "./admin-pages/users-page/users-page.component";
import {RestaurantsPageComponent} from "./admin-pages/restaurants-page/restaurants-page.component";
import {CategoriesPageComponent} from "./restaurateur-pages/categories-page/categories-page.component";
import {RestaurantFormComponent} from "./form-pages/restaurant-form/restaurant-form.component";
import {UserFormComponent} from "./form-pages/user-form/user-form.component";
import {CategoryFormComponent} from "./form-pages/category-form/category-form.component";
import {KitchenFormComponent} from "./form-pages/kitchen-form/kitchen-form.component";

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent, canActivate: [isAuthGuard], children: [
      {path: 'dashboard', component: DashboardPageComponent},
      {path: 'overview', component: OverviewPageComponent},
      {path: 'users', component: UsersPageComponent},
      {path: 'restaurants', component: RestaurantsPageComponent},
      {path: 'categories', component: CategoriesPageComponent},
      {path: 'new-user', component: UserFormComponent},
      {path: 'new-restaurant', component: RestaurantFormComponent},
      {path: 'new-category', component: CategoryFormComponent},
      {path: 'new-kitchen', component: KitchenFormComponent}
    ]
  }
];
