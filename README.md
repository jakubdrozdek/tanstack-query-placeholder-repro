# TanStack Query placeholderData repro

Two reproductions for `@tanstack/react-query` 5.108.1.

- **Issue 1, render loop.** Pick a case, then click "re-render" once. Since 5.105.2 the cases marked "loops" throw "Maximum update depth exceeded". Set `@tanstack/react-query` to `5.105.1` in `package.json` and every case settles. Code: `src/issue1.jsx`.
- **Issue 2, selection of reset data.** Click "run". After `resetQueries`, `status` is `error` and `data` is still `"first"`, the selection of the data that was reset, with `isPlaceholderData: false`. The cache holds nothing. This uses a plain `QueryObserver`, so the loop from issue 1 does not hide it, and it happens on 5.105.1 too. Code: `src/issue2.js`.
