export const isInCurrentPathStyle = (path: string) =>
    pathname === path ? 'active-path' : '';

export const pathTitleGenerator = (path: string) => {
  if (path === '/') return 'Generator';
  if (path === '/feed') return 'Feed';
  if (path === '/history') return 'History';
  if (path === '/collection') return 'Collection';
  return '';
