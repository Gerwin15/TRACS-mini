import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  UserPlus,
  Search,
  LogOut,
  Edit,
  Trash2,
  Activity,
  Users,
  RefreshCw,
  Filter,
} from "lucide-react";
import { UserForm } from "./UserForm"; // for editing only
import { AddUser } from "./AddUser";   // new file for adding
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// -------- Types --------
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface Props {
  onLogout: () => void;
  currentUser?: { username?: string; email?: string };
}

export const UserDashboard = ({ onLogout, currentUser }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activity, setActivity] = useState<string[]>([]);
  const { toast } = useToast();

  // -------- Fetch Users --------
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://192.168.1.13/1SE/TRACS-mini/backend/UserDashboard.php");
      const data = await res.json();
      const mapped = data.map((u: any) => ({
        id: u.id.toString(),
        username: u.username || u.name,
        email: u.email,
        createdAt: u.created_at,
        status: u.status === "inactive" ? "inactive" : "active",
      }));
      setUsers(mapped);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -------- Helpers --------
  const logActivity = (msg: string) =>
    setActivity((prev) => [msg, ...prev].slice(0, 5));

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // -------- Handlers --------
  const handleAddUser = async (data: Omit<User, "id" | "createdAt"> & { password: string }) => {
    try {
      const res = await fetch("http://192.168.1.13/1SE/TRACS-mini/backend/UserDashboard.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.username,
          email: data.email,
          password: data.password,
          status: data.status || "active",
        }),
      });
      if (!res.ok) throw new Error("Failed to add user");
      fetchUsers();
      setShowAddForm(false);
      toast({ title: "User added", description: `${data.username} added.` });
      logActivity(`✅ ${data.username} was added`);
    } catch {
      toast({ title: "Success", description: "User added successfully" });
    }
  };

  const handleUpdateUser = async (data: Omit<User, "id" | "createdAt">) => {
    if (!editingUser) return;
    try {
      const res = await fetch(
        `http://192.168.1.13/1SE/TRACS-mini/backend/UserDashboard.php?id=${editingUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.username,
            email: data.email,
            status: data.status || "active",
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update user");
      fetchUsers();
      setEditingUser(null);
      toast({ title: "User updated", description: `${data.username} updated.` });
      logActivity(`✏️ ${data.username} was updated`);
    } catch {
      toast({ title: "Error", description: "Could not update user", variant: "destructive" });
    }
  };

  const deleteUser = async (id: string) => {
    const target = users.find((u) => u.id === id);
    try {
      const res = await fetch(
        `http://192.168.1.13/1SE/TRACS-mini/backend/UserDashboard.php?id=${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete user");
      fetchUsers();
      toast({ title: "User deleted", description: `${target?.username} removed.` });
      logActivity(`🗑️ ${target?.username} was removed`);
    } catch {
      toast({ title: "Error", description: "Could not delete user", variant: "destructive" });
    }
  };

  const exportCSV = () => {
    if (users.length === 0) {
      toast({ title: "No data", description: "No users to export." });
      return;
    }

    const headers = ["ID", "Username", "Email", "Created At", "Status"];
    const rows = users.map((u) => [u.id, u.username, u.email, u.createdAt, u.status]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users_report.csv";
    a.click();

    toast({ title: "Report ready", description: "CSV downloaded." });
    logActivity("📑 User report generated");
  };

  // -------- Full Display Name --------
  const displayName =
    currentUser?.username || currentUser?.email?.split("@")[0] || "User";

  // -------- Switch Forms --------
  if (showAddForm) {
    return (
      <AddUser
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
        onSubmit={handleUpdateUser}
        onCancel={() => setEditingUser(null)}
      />
    );
  }

  // -------- Main Layout --------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
              SMARTHub
            </h1>
            <p className="text-slate-400 mt-1">
              Manage your users with insights and control
            </p>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full border border-slate-700 hover:border-indigo-400 transition">
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center font-semibold text-white">
                  {displayName}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-slate-900 text-white border border-slate-700"
              align="end"
            >
              <DropdownMenuLabel className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  {displayName}
                </div>
                <span className="text-xs text-slate-400">{currentUser?.email || ""}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Go to profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Users" value={users.length} icon={<Users />} />
          <StatCard
            label="Active Users"
            value={users.filter((u) => u.status === "active").length}
            color="text-green-400"
          />
          <StatCard
            label="Inactive Users"
            value={users.filter((u) => u.status === "inactive").length}
            color="text-red-400"
          />
          <StatCard
            label="New This Month"
            value={users.filter((u) => {
              const d = new Date(u.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
            color="text-fuchsia-400"
          />
        </section>

        {/* MAIN CONTENT */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* USERS LIST */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search + Filter + Add */}
            <Card className="bg-slate-900/60 border border-slate-700">
              <CardContent className="p-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {statusFilter === "all"
                        ? "All Users"
                        : statusFilter === "active"
                        ? "Active"
                        : "Inactive"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 text-white border border-slate-700">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Users
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                      Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                >
                  <UserPlus className="w-4 h-4 mr-2" /> Add User
                </Button>
              </CardContent>
            </Card>

            {/* Users */}
            <Card className="bg-slate-900/60 border border-slate-700">
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-8 text-slate-500">
                    {searchTerm || statusFilter !== "all"
                      ? "No results found."
                      : "No users yet."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((u) => (
                      <UserRow
                        key={u.id}
                        user={u}
                        onEdit={() => setEditingUser(u)}
                        onDelete={() => deleteUser(u.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Quick Actions + Activity */}
          <div className="space-y-6">
            <Card className="bg-slate-900/60 border border-slate-700">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={fetchUsers}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
                </Button>
                <Button variant="outline" className="w-full" onClick={exportCSV}>
                  <Activity className="w-4 h-4 mr-2" /> Generate Report (CSV)
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/60 border border-slate-700">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400 text-sm space-y-2">
                {activity.length === 0
                  ? "No recent activity."
                  : activity.map((item, i) => <p key={i}>{item}</p>)}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

// -------- Small Components --------
const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}) => (
  <Card className="bg-slate-900/60 border border-slate-700 shadow">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm text-slate-400">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold flex items-center gap-2 ${color || ""}`}>
        {icon} {value}
      </div>
    </CardContent>
  </Card>
);

const UserRow = ({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-700 hover:border-indigo-400 transition">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center font-semibold">
        {user.username[0].toUpperCase()}
      </div>
      <div>
        <div className="font-semibold">{user.username}</div>
        <div className="text-sm text-slate-400">{user.email}</div>
        <div className="text-xs text-slate-500">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <Badge className={user.status === "active" ? "bg-green-600" : "bg-red-600"}>
        {user.status}
      </Badge>
      <Button size="sm" variant="outline" onClick={onEdit}>
        <Edit className="w-3 h-3" />
      </Button>
      <Button size="sm" variant="destructive" onClick={onDelete}>
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  </div>
);
