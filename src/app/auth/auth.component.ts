import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
 '../shared/alert/alert.component'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode: boolean = false;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;

  private closeSub: Subscription;

  //ComponentFactoryResolver só é necessário para Angular < 13
  constructor(private authService: AuthService, private router: Router, /*private componentFactoryResolver: ComponentFactoryResolver*/) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.closeSub) this.closeSub.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {

    if (!form.valid) return;

    this.isLoading = true;
    this.error = null;

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: resData => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: error => {
        this.error = error;
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    });

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(error: string) {
    //const alertCmp = new AlertComponent(); não funciona

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    //Versões anteriores precisam do componentFactory
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    // hostViewContainerRef.createComponent(componentFactory);

    //Funciona direto com o componente em Angular >= 13
    const componentRef = hostViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = error;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });

  }

}
