import { Fragment } from "react/jsx-runtime";

import { Posts } from "./Posts";
import { PostSortSwitcher } from "./PostSortSwitcher";

export function MainPage() {
  return (
    <Fragment>
      <PostSortSwitcher />
      <Posts />
    </Fragment>
  );
}
