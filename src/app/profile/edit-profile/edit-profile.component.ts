import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthenticationService } from '../../core/authentication.service';
import { AuthorService } from '../../shared/author/author.service';

import { Author } from '../../shared/author/author.model';

@Component({
  selector: 'tweempus-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  editUserForm!: FormGroup;
  currentAuthor!: Author;
  showAlert = false;
  imageUrl: string = 'assets/images/google-icon.png';


  constructor(
    private authService: AuthenticationService,
    private authorService: AuthorService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.editUserForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      image: ['']
    });

    this.editUserForm.get('image')?.valueChanges.subscribe(value => {
      this.updateImage(value);
    });
  }

  updateImage(url: string) {
    const img = new Image();
    img.onload = () => {
      this.imageUrl = url;
    };
    img.onerror = () => {
      this.imageUrl = 'assets/images/google-icon.png';
    };
    img.src = url;
  }

  editProfile(form: any) {
    this.authorService.updateAuthor(this.authService.token.idAuthor, form.value.fullName, form.value.image).subscribe(
      response => {
        console.log('Usuario modificado');
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
            window.location.reload();
        }, 3000)
      }
    );
  }
}
