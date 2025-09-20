import { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    role: "Admin",
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    role: "Editor",
    status: "active",
    createdAt: "2024-02-20T14:15:00Z",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol.davis@company.com",
    role: "Viewer",
    status: "inactive",
    createdAt: "2024-01-10T09:00:00Z",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david.wilson@company.com",
    role: "Editor",
    status: "active",
    createdAt: "2024-03-05T16:45:00Z",
  },
  {
    id: "5",
    name: "Eva Martinez",
    email: "eva.martinez@company.com",
    role: "Admin",
    status: "active",
    createdAt: "2024-02-28T11:20:00Z",
  },
  {
    id: "6",
    name: "Frank Thompson",
    email: "frank.thompson@company.com",
    role: "Viewer",
    status: "inactive",
    createdAt: "2024-01-25T13:10:00Z",
  },
];