interface Industry {
  value: string | number;
  label: string;
}

interface IndustrySelection {
  industry: Industry;
  remove: boolean;
}

interface IndustrySelectorProps {
  selectedIndustries: Industry[];
  onSelect: (industry: Industry, remove?: boolean) => void;
}

interface OptionType {
  value: number;
  label: string;
}

interface UserSession {
  user: {
    id: string | number;
  };
}

interface HandleSelectProps {
  selectedIndustries: Industry[];
  onSelect: (industry: Industry) => void;
}

interface HandleRemoveProps {
  onSelect: (industry: Industry, remove: boolean) => void;
  session: UserSession | null;
}
