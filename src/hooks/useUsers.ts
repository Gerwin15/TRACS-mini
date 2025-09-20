import { useState, useEffect } from "react";
import { User, CreateUserData, UpdateUserData } from "@/types/user";
import { mockUsers } from "@/data/mockUsers";
import { toast } from "@/hooks/use-toast";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const addUser = (userData: CreateUserData) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    setUsers(prev => [newUser, ...prev]);
    toast({
      title: "User added successfully",
      description: `${userData.name} has been added to the system.`,
    });
  };

  const updateUser = (userData: UpdateUserData) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userData.id 
          ? { ...user, ...userData }
          : user
      )
    );
    toast({
      title: "User updated successfully", 
      description: `${userData.name}'s information has been updated.`,
    });
  };

  const deleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User deleted successfully",
      description: `${user?.name} has been removed from the system.`,
      variant: "destructive",
    });
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
  };
};