import {Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {isAuthGuard} from "./shared/classes/auth.guard";
import {DashboardPageComponent} from "./admin-pages/dashboard-page/dashboard-page.component";
import {OverviewPageComponent} from "./restaurateur-pages/overview-page/overview-page.component";
import {UsersPageComponent} from "./admin-pages/users-page/users-page.component";
import {RestaurantsPageComponent} from "./admin-pages/restaurants-page/restaurants-page.component";
import {RestaurantFormComponent} from "./form-pages/restaurant-form/restaurant-form.component";
import {UserFormComponent} from "./form-pages/user-form/user-form.component";
import {CategoryFormComponent} from "./form-pages/category-form/category-form.component";
import {KitchenFormComponent} from "./form-pages/kitchen-form/kitchen-form.component";
import {PositionsPageComponent} from "./admin-pages/positions-page/positions-page.component";
import {PositionFormComponent} from "./form-pages/position-form/position-form.component";
import {AssortmentComponent} from "./admin-pages/assortment/assortment.component";

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent}
    ]
  },
  {
    path: 'admin', component: SiteLayoutComponent, canActivate:[isAuthGuard], children: [
      {path: '', redirectTo: '/admin/users', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardPageComponent},
      {path: 'overview', component: OverviewPageComponent},
      {path: 'users', component: UsersPageComponent},
      {path: 'restaurants', component: RestaurantsPageComponent},
      {path: 'assortment', component: AssortmentComponent},
      {path: 'form-user', component: UserFormComponent},
      {path: 'form-user/:id', component: UserFormComponent},
      {path: 'form-restaurant', component: RestaurantFormComponent},
      {path: 'form-restaurant/:id', component: RestaurantFormComponent},
      {path: 'form-kitchen', component: KitchenFormComponent},
      {path: 'form-kitchen/:id', component: KitchenFormComponent},
      {path: 'form-category', component: CategoryFormComponent},
      {path: 'form-category/:id', component: CategoryFormComponent},
      {path: 'form-position', component: PositionFormComponent},
      {path: 'form-position/:id', component: PositionFormComponent},
    ]
  }
];
