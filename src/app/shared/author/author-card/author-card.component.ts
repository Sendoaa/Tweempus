import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FollowService } from '../follow.service';
import { Author } from '../author.model';
import { AuthorService } from '../author.service';

@Component({
  selector: 'tweempus-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.css']
})
export class AuthorCardComponent implements OnInit, OnChanges {
  @Input() author!: Author;
  @Input() currentUserId!: string;
  isFollowing = false;
  followerCount: number = 0;
  showFollowersPopup = false;
  followers: Author[] = [];

  constructor(private followService: FollowService, private authorService: AuthorService) { }

  ngOnInit(): void {
    console.log('ngOnInit - author:', this.author, 'currentUserId:', this.currentUserId);
    this.updateFollowerCount();
    this.updateFollowingStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['author'] && this.author) {
      console.log('ngOnChanges - author:', this.author);
      this.updateFollowerCount();
      this.updateFollowingStatus();
    }
  }

  toggleFollow(): void {
    console.log('toggleFollow - isFollowing:', this.isFollowing);
    if (this.isFollowing) {
      this.followService.unfollowUser(this.currentUserId, this.author?.id).subscribe(() => {
        this.isFollowing = false;
        this.updateFollowerCount();
      });
    } else {
      this.followService.followUser(this.currentUserId, this.author?.id).subscribe(() => {
        this.isFollowing = true;
        this.updateFollowerCount();
      });
    }
  }

  private updateFollowerCount(): void {
    this.followService.getFollowerCount(this.author.id).subscribe(count => {
      this.followerCount = count;
    });
  }

  private updateFollowingStatus(): void {
    if (this.author?.id !== this.currentUserId) {
      this.followService.getFollowing(this.currentUserId).subscribe(following => {
        this.isFollowing = following.some(follow => follow.followingId === this.author?.id);
      });
    }
  }

  toggleFollowersPopup(): void {
    this.showFollowersPopup = !this.showFollowersPopup;
    if (this.showFollowersPopup) {
      this.loadFollowers();
    }
  }

  private loadFollowers(): void {
    this.followService.getFollowers(this.author.id).subscribe(follows => {
      const followerIds = follows.map(follow => follow.followerId);
      console.log('Follower IDs:', followerIds); // Añadir log para verificar los IDs de los seguidores
      if (followerIds.length > 0) {
        this.authorService.getAuthorsByIds(followerIds).subscribe(authors => {
          this.followers = authors.filter(author => author.id !== this.currentUserId); // Filtrar el usuario actual
          console.log('Followers loaded:', this.followers); // Añadir log para verificar los datos
        });
      } else {
        console.log('No followers found');
      }
    });
  }
}