// Route-level loading UI for the app directory.
// We intentionally render nothing here because we handle
// skeletons explicitly inside `app/page.tsx` and the grid.
// This avoids double-skeleton flashes between route transitions.
export default function Loading() {
  return null
}
