import {Component, Input} from '@angular/core';
import {DetailViewComponent} from "../detail-view/detail-view.component";
import {MatDialog} from "@angular/material/dialog";
import {Post} from "../list-view/list-view.interfaces";

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css']
})
export class PostCardComponent {
  @Input() post: Post = {
    title: '',
    selfText: '',
    thumbnail: '',
    score: '',
    num_comments: 0,
    created: '',
    author: '',
    id: '',
    kind: ''
  }

  constructor(public dialog: MatDialog) {
  }

  openDialog(post: Post) {
    this.dialog.open(DetailViewComponent, {data: post});
  }

  getThumbnail(thumbnail: string) {
    switch (true) {
      case thumbnail === 'self' : {
        return '../../../assets/self.png';
      }
      case thumbnail === 'nsfw' : {
        return '../../../assets/nsfw2.png';
      }
      case (thumbnail !== 'default' && thumbnail.length > 0) : {
        return thumbnail;
      }
      default:
        return '../../../assets/default.png';
    }
  }
}
