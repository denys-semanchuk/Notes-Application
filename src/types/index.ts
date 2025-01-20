
export interface NavLink {
  label: string;
  path: string;
}

export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface CardProps {
  title: string;
  content: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?:string
}