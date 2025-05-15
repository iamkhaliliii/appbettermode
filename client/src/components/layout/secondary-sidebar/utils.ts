export const isActiveUrl = (url: string | undefined, currentPathname: string | undefined): boolean => {
  if (!url || !currentPathname) return false;
  if (currentPathname === url) return true;
  if (
    url.includes("/") &&
    currentPathname.startsWith(url) &&
    url !== "/content/activity" &&
    url !== "/content/inbox"
  )
    return true;

  // Special case for content route handling root path
  if (url === "/content/posts" && currentPathname === "/content") return true;
  if (url === "/content/activity" && currentPathname === "/content/comments")
    return true;

  return false;
}; 