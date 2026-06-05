export interface User {
  id:       string;
  email:    string;
  name: string;
  lastname: string;
  isActive: boolean;
  roles:    Role[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}