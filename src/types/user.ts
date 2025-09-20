export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

export interface UpdateUserData extends CreateUserData {
  id: string;
}