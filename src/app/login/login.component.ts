import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  invalidLogin: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  get username() { return this.form.get('username') }

  get password() { return this.form.get('password') }

  onSubmit() {
    this.authService.auth(this.form.value).subscribe(res => {
      if (res) {
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'
        this.router.navigate([returnUrl]);
      } else this.invalidLogin = true
    })
  }

}
