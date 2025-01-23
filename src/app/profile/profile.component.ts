import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthorService } from '../shared/author/author.service';
import { AuthenticationService } from '../core/authentication.service';

import { Author } from '../shared/author/author.model';

@Component({
  selector: 'tweempus-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  idAuthor!: string;
  author!: Author;
  currentUserId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    this.idAuthor = this.route.snapshot.params['id'];
    this.authorService.getAuthor(this.idAuthor).subscribe(author => {
      this.author = author;
      console.log('Author loaded:', this.author);
    });
    this.currentUserId = this.authService.token.idAuthor; // Obtener el ID del usuario autenticado
  }

  checkLogin() {
    if (this.authService.token != null) {
      if(this.idAuthor == this.authService.token.idAuthor)
        return true;
    }
    return false;
  }
}