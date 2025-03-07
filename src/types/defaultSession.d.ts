export interface ExtendedSession extends DefaultSession {
  user?: DefaultSession["user"] & {
    id?: string;
  };
}
