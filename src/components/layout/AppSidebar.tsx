import React, { useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  PlusCircle,
  BarChart3,
  Settings,
  Users,
  Workflow,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['employee', 'manager', 'hr', 'admin'] },
  { label: 'My Requests', href: '/my-requests', icon: FileText, roles: ['employee', 'manager', 'hr', 'admin'] },
  { label: 'Create Request', href: '/create-request', icon: PlusCircle, roles: ['employee'] },
  { label: 'Approvals', href: '/approvals', icon: CheckSquare, roles: ['manager', 'admin'] },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['manager', 'admin'] },
  { label: 'Workflow Builder', href: '/workflows', icon: Workflow, roles: ['admin'] },
  { label: 'Users & Roles', href: '/users', icon: Users, roles: ['admin'] },
  { label: 'Audit Logs', href: '/audit-logs', icon: Shield, roles: ['admin'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['employee', 'manager', 'hr', 'admin'] },
];

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Wrap logout in useCallback to ensure stable reference and prevent render-time execution
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (!user) return null;

  // Filter menu items based on user role - ensure role is lowercase for comparison
  const userRole = (user.role as UserRole).toLowerCase() as UserRole;
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Workflow className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">WorkflowPro</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent',
                    isCollapsed && 'justify-center'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User Profile */}
      <div className={cn('p-4', isCollapsed && 'flex justify-center')}>
        {isCollapsed ? (
          <Avatar className="h-8 w-8 cursor-pointer" onClick={handleLogout} title="Sign out">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-muted capitalize">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
