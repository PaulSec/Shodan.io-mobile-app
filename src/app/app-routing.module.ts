import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from './login.guard'; 

const routes: Routes = [
  {
    path: '',
    redirectTo: '/ask-apikey',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
    canActivate: [LoginGuard],
  },
  { path: 'searches', loadChildren: './searches/searches.module#SearchesPageModule', canActivate: [LoginGuard] },
  { path: 'my-searches', loadChildren: './my-searches/my-searches.module#MySearchesPageModule', canActivate: [LoginGuard] },
  { path: 'queries', loadChildren: './queries/queries.module#QueriesPageModule', canActivate: [LoginGuard] },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule', canActivate: [LoginGuard] },
  { path: 'privacy-policy', loadChildren: './privacy-policy/privacy-policy.module#PrivacyPolicyPageModule', canActivate: [LoginGuard] },
  { path: 'about', loadChildren: './about/about.module#AboutPageModule', canActivate: [LoginGuard] },
  { path: 'search-results', loadChildren: './search-results/search-results.module#SearchResultsPageModule', canActivate: [LoginGuard] },
  { path: 'host-results', loadChildren: './host-results/host-results.module#HostResultsPageModule', canActivate: [LoginGuard] },
  { path: 'ask-apikey', loadChildren: './ask-apikey/ask-apikey.module#AskAPIKeyPageModule' },
  { path: 'alerts', loadChildren: './alerts/alerts.module#AlertsPageModule', canActivate: [LoginGuard] },
  { path: 'alerts-details', loadChildren: './alerts-details/alerts-details.module#AlertsDetailsPageModule', canActivate: [LoginGuard] },
  { path: 'history', loadChildren: './history/history.module#HistoryPageModule', canActivate: [LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
