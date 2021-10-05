import {Injectable} from "@angular/core";
import {saveSearch, SearchAction, searchFail, searchSubject, searchSuccess} from "../actions/actions";
import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map, mergeMap, switchMap, tap} from "rxjs/operators";
import {SubjectSearchRequest, SubjectSearchResponse} from "../models/model";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Store} from "@ngrx/store";
import {EMPTY, Observable, of} from "rxjs";
import {DEFAULT_LIMIT} from "../../list-view/list-view.constants";

@Injectable()
export class RedditEffects {

  constructor(
    // inject Actions from @ngrx/effects
    private actions: Actions,
    private http: HttpClient,
    private store: Store
  ) {
  }

  getSubjectSearchURL({subject, limit, before, after}: SubjectSearchRequest): string {
    return `https://www.reddit.com/r/${subject}.json?limit=${limit? limit : DEFAULT_LIMIT}${before ? '&before=' + before : ''}${after ? '&after=' + after : ''}`;
  }

  sendSearchRequest(subjectSearchRequest: SubjectSearchRequest) {
    const subjectSearchURL = this.getSubjectSearchURL(subjectSearchRequest);
    return this.http.get<SubjectSearchResponse>(subjectSearchURL);
  }


  subjectSearch$ = createEffect(() =>
    this.actions.pipe(
      ofType(searchSubject),
      mergeMap((searchRequest: SubjectSearchRequest) => {
        console.log(233,searchRequest);
        return this.sendSearchRequest(searchRequest)
          .pipe(
            map((subjectSearchresponse: SubjectSearchResponse) =>
              searchSuccess(subjectSearchresponse)
            ),
            catchError((error) =>
              of(searchFail({message: error && error.message ? error.message : 'An error occured'}))
            )
          );
      })
    )
    );


}



