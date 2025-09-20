import { UserTable } from "@/components/UserTable";
import { useUsers } from "@/hooks/useUsers";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <UserTable
          users={users}
          onAddUser={addUser}
          onUpdateUser={updateUser}
          onDeleteUser={deleteUser}
        />
      </div>
    </div>
  );
};

export default Index;
