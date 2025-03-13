
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
  SidebarHeader
} from "@/components/ui/sidebar";
import { 
  Calendar, 
  Home, 
  BookOpen, 
  CheckSquare, 
  BarChart2, 
  Settings as SettingsIcon,
  LogOut
} from "lucide-react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Journal",
      url: "/journal",
      icon: BookOpen,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: CheckSquare,
    },
    {
      title: "Habits",
      url: "/habits",
      icon: BarChart2,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-journal-blue" />
          <h1 className="text-xl font-bold">ProductiveJournal</h1>
        </div>
        <SidebarTrigger className="absolute right-2 top-5" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className={`w-full ${
                      location.pathname === item.url
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/")}>
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
