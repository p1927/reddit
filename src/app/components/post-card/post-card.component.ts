import {Component, Input} from '@angular/core';
import {Post} from "../list-view/list-view.constants";
import {DetailViewComponent} from "../detail-view/detail-view.component";
import {MatDialog} from "@angular/material/dialog";

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

}
