export type RouteNavLink = {
  label: string
  name: string
}

export type ExternalNavLink = {
  label: string
  href: string
}

const routeMap = {
  about: { label: 'About Us', name: 'about' },
  gallery: { label: 'Gallery', name: 'gallery' },
  menu: { label: 'Menu', name: 'menu' },
  recipes: { label: 'Recipes', name: 'recipes' },
  reservations: { label: 'Reservations', name: 'reservations' },
  catering: { label: 'Catering', name: 'catering' },
  blog: { label: 'Blog', name: 'blog' },
  contact: { label: 'Contact Us', name: 'contact' }
} as const satisfies Record<string, RouteNavLink>

export const headerNavigation: RouteNavLink[] = [
  routeMap.about,
  routeMap.gallery,
  routeMap.menu,
  routeMap.recipes,
  { label: 'Private Dining', name: routeMap.reservations.name },
  routeMap.catering,
  routeMap.blog,
  routeMap.contact
]

export const footerNavigation: Array<RouteNavLink | ExternalNavLink> = [
  routeMap.menu,
  routeMap.reservations,
  routeMap.recipes,
  routeMap.catering,
  routeMap.blog,
  routeMap.contact,
  { label: 'Follow Us', href: '#' },
  { label: 'Privacy Policy', href: '#' }
]
