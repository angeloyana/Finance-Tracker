import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CommuteIcon from '@mui/icons-material/Commute';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HomeIcon from '@mui/icons-material/Home';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PaidIcon from '@mui/icons-material/Paid';
import SavingsIcon from '@mui/icons-material/Savings';
import SchoolIcon from '@mui/icons-material/School';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WorkIcon from '@mui/icons-material/Work';

const categoryIcons = {
  'Attach Money': AttachMoneyIcon,
  'Card Giftcard': CardGiftcardIcon,
  Commute: CommuteIcon,
  Fastfood: FastfoodIcon,
  'Health And Safety': HealthAndSafetyIcon,
  Home: HomeIcon,
  'Local Grocery Store': LocalGroceryStoreIcon,
  Paid: PaidIcon,
  Savings: SavingsIcon,
  School: SchoolIcon,
  'Shopping Cart': ShoppingCartIcon,
  'Sports Esports': SportsEsportsIcon,
  Work: WorkIcon,
} as const;

export type CategoryIcons = keyof typeof categoryIcons;

export default categoryIcons;
