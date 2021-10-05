import {Injectable} from "@angular/core";
import {changePageSize, searchFail, searchSubject, searchSuccess} from "../actions/actions";
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
    private actions: Actions,
    private http: HttpClient,
  ) {
  }

  getSubjectSearchURL({subject, limit, before, after}: SubjectSearchRequest): string {
    return `https://www.reddit.com/r/${subject}.json?limit=${limit?
      limit : DEFAULT_LIMIT}${before ? '&before=' + before : ''}${after ? '&after=' + after : ''}`;
  }

  sendSearchRequest(subjectSearchRequest: SubjectSearchRequest) {
    const subjectSearchURL = this.getSubjectSearchURL(subjectSearchRequest);
    return this.http.get<SubjectSearchResponse>(subjectSearchURL);
  }

  getIndexFromChild(child : any){
     return child.kind+ '_' + child.data.id;
  }


  subjectSearch$ = createEffect(() =>
    this.actions.pipe(
      ofType(searchSubject),
      mergeMap((searchRequest: SubjectSearchRequest) => {
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

  changePageSize$ = createEffect(() =>
    this.actions.pipe(
      ofType(changePageSize),
      mergeMap((searchRequest: SubjectSearchRequest)=>{
        // search for one element before the current set of PostList elements
        return this.sendSearchRequest({...searchRequest, limit: 1})
          .pipe(map((subjectSearchresponse: SubjectSearchResponse) =>
              // search for next set of elements after the obtained previous page element
              searchSubject({
                ...searchRequest,
                after: subjectSearchresponse.data?.dist !== 0 ?
                  this.getIndexFromChild(subjectSearchresponse.data?.children[0]) : undefined,
                before: undefined })
            ),
            catchError((error) =>
              of(searchFail({message: error && error.message ? error.message : 'An error occured'}))
            ));
      })
    )
  );


}



