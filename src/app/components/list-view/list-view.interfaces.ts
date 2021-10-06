export interface PageIndex {
  last: string | null;
  first: string | null;
}

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
