import {Routes} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layouts/auth-layout/auth-layout.component";
import {LoginPageComponent} from "./login-page/login-page.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {isAuthGuard} from "./shared/classes/auth.guard";
import {DashboardPageComponent} from "./admin-pages/dashboard-page/dashboard-page.component";
import {OverviewPageComponent} from "./restaurateur-pages/overview-page/overview-page.component";
import {UsersPageComponent} from "./admin-pages/users-page/users-page.component";

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent}
    ]
  },
  {
    path: '', component: SiteLayoutComponent,canActivate: [isAuthGuard], children: [
      {path: 'dashboard', component: DashboardPageComponent},
      {path: 'overview', component: OverviewPageComponent},
      {path: 'users', component: UsersPageComponent}
    ]
  }
];
