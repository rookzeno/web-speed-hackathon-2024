import { ArrowBack, Close, NavigateNext, Search } from '@mui/icons-material';

const ICONS = {
  ArrowBack,
  Close,
  NavigateNext,
  Search,
} as const;

type Props = {
  color: string;
  height: number;
  type: keyof typeof ICONS;
  width: number;
};

export const SvgIcon: React.FC<Props> = ({ color, height, type, width }) => {
  const Icon = ICONS[type];
  return <Icon style={{ color, height, width }} />;
};
