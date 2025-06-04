import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCommand,
  IconCreditCard,
  IconFile,
  IconFileText,
  IconHelpCircle,
  IconPhoto,
  IconDeviceLaptop,
  IconLayoutDashboard,
  IconLoader2,
  IconLogin,
  IconProps,
  IconShoppingBag,
  IconMoon,
  IconDotsVertical,
  IconPizza,
  IconPlus,
  IconSettings,
  IconSun,
  IconTrash,
  IconBrandTwitter,
  IconUser,
  IconUserCircle,
  IconUserEdit,
  IconUserX,
  IconUsers, // Added IconUsers
  IconRefresh, // Added IconRefresh
  IconUserPlus, // Added IconUserPlus
  IconCalendar, // Added IconCalendar
  IconSearch, // Added IconSearch
  IconFilter, // Added IconFilter
  IconPlaylistAdd, // Corrected to IconPlaylistAdd
  IconMail, // Added IconMail
  IconPhone, // Added IconPhone
  IconChevronsLeft, // Added IconChevronsLeft
  IconChevronsRight, // Added IconChevronsRight
  IconColumns, // Added IconColumns
  IconX,
  IconLayoutKanban,
  IconBrandGithub
} from '@tabler/icons-react';

export type Icon = React.ComponentType<IconProps>;

export const Icons = {
  dashboard: IconLayoutDashboard,
  logo: IconCommand,
  login: IconLogin,
  close: IconX,
  product: IconShoppingBag,
  spinner: IconLoader2,
  kanban: IconLayoutKanban,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  trash: IconTrash,
  employee: IconUserX,
  post: IconFileText,
  page: IconFile,
  userPen: IconUserEdit,
  user2: IconUserCircle,
  media: IconPhoto,
  settings: IconSettings,
  billing: IconCreditCard,
  ellipsis: IconDotsVertical,
  add: IconPlus,
  warning: IconAlertTriangle,
  user: IconUser,
  arrowRight: IconArrowRight,
  help: IconHelpCircle,
  pizza: IconPizza,
  sun: IconSun,
  moon: IconMoon,
  laptop: IconDeviceLaptop,
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  check: IconCheck,
  users: IconUsers, // Added IconUsers to the export
  refresh: IconRefresh, // Added IconRefresh to the export
  userPlus: IconUserPlus, // Added IconUserPlus to the export
  calendar: IconCalendar, // Added IconCalendar to the export
  search: IconSearch, // Added IconSearch to the export
  filter: IconFilter, // Added IconFilter to the export
  playlistAdd: IconPlaylistAdd, // Corrected to playlistAdd
  mail: IconMail, // Added IconMail
  phone: IconPhone, // Added IconPhone
  chevronsLeft: IconChevronsLeft, // Added IconChevronsLeft
  chevronsRight: IconChevronsRight, // Added IconChevronsRight
  columns: IconColumns // Added IconColumns
};
