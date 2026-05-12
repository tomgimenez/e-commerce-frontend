export interface User {
  id:       string;
  email:    string;
  fullName: string;
  isActive: boolean;
  roles:    Role[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}