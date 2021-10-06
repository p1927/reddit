export interface Post {
  id: string;
  thumbnail: string;
  created: string;
  num_comments: number;
  author: string;
  score: string;
  kind: string;
  title: string;
  selfText: string;
}

export interface PageIndex {
  last: string | null;
  first: string | null;
}

export const LAST_PAGE_REACHED = 'No more posts on this topic';
export const FIRST_PAGE_REACHED = 'We are at the first posts on this topic';
export const SNACKBAR_TIMEOUT = 3000;
export const DEFAULT_LIMIT = 10;
