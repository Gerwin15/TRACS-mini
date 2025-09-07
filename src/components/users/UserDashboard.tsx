import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, LogOut, Edit, Trash2 } from "lucide-react";
import { UserForm } from "./UserForm";
import { useToast } from "@/hooks/use-toast";

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface UserDashboardProps {
  onLogout: () => void;
}

export const UserDashboard = ({ onLogout }: UserDashboardProps) => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "john_doe",
      email: "john@example.com",
      createdAt: "2024-01-15",
      status: "active"
    },
    {
      id: "2", 
      username: "jane_smith",
      email: "jane@example.com",
      createdAt: "2024-01-20",
      status: "active"
    },
    {
      id: "3",
      username: "bob_wilson",
      email: "bob@example.com", 
      createdAt: "2024-01-25",
      status: "inactive"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (userData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    setShowAddForm(false);
    toast({
      title: "User added successfully!",
      description: `${userData.username} has been added to the system.`,
    });
  };

  const handleEditUser = (userData: Omit<User, "id" | "createdAt">) => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? { ...user, ...userData }
        : user
    );
    setUsers(updatedUsers);
    setEditingUser(null);
    toast({
      title: "User updated successfully!",
      description: `${userData.username}'s information has been updated.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User deleted",
      description: `${userToDelete?.username} has been removed from the system.`,
    });
  };

  if (showAddForm) {
    return (
      <UserForm
        title="Add New User"
        onSubmit={handleAddUser}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  if (editingUser) {
    return (
      <UserForm
        title="Edit User"
        initialData={editingUser}
        onSubmit={handleEditUser}
        onCancel={() => setEditingUser(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SMARTHub Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage your users efficiently</p>
          </div>
          <Button onClick={onLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/50 shadow-card hover:shadow-primary/10 transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-card hover:shadow-primary/10 transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {users.filter(u => u.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-card hover:shadow-primary/10 transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {users.filter(u => u.status === "inactive").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add */}
        <Card className="border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowAddForm(true)} variant="gradient">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No users found matching your search." : "No users found."}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-semibold">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{user.username}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};