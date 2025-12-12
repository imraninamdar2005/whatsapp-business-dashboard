import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Key,
  Smartphone,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';

const settingsNav = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'devices', label: 'Connected Devices', icon: Smartphone },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

const Settings = () => {
  const { theme, toggleTheme } = useAppStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 flex-shrink-0"
          >
            <div className="bg-card rounded-xl shadow-card p-2">
              {settingsNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    activeSection === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  <ChevronRight className={cn(
                    "w-4 h-4 ml-auto transition-transform",
                    activeSection === item.id && "rotate-90"
                  )} />
                </button>
              ))}
              <Separator className="my-2" />
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div className="bg-card rounded-xl shadow-card p-6">
              {/* Profile Section */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Profile Settings</h2>
                    <p className="text-sm text-muted-foreground">Update your personal information</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Notification Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                      </div>
                      <Switch 
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">Receive promotional content and updates</p>
                      </div>
                      <Switch 
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Section */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Appearance</h2>
                    <p className="text-sm text-muted-foreground">Customize the look and feel of your dashboard</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-foreground mb-3">Theme</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => theme === 'dark' && toggleTheme()}
                          className={cn(
                            "relative p-4 rounded-xl border-2 transition-all",
                            theme === 'light' 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Sun className="w-5 h-5 text-amber-500" />
                            <span className="font-medium text-foreground">Light</span>
                          </div>
                          <div className="h-16 rounded-lg bg-white border border-gray-200" />
                          {theme === 'light' && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                        <button
                          onClick={() => theme === 'light' && toggleTheme()}
                          className={cn(
                            "relative p-4 rounded-xl border-2 transition-all",
                            theme === 'dark' 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Moon className="w-5 h-5 text-indigo-500" />
                            <span className="font-medium text-foreground">Dark</span>
                          </div>
                          <div className="h-16 rounded-lg bg-gray-900 border border-gray-700" />
                          {theme === 'dark' && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Security</h2>
                    <p className="text-sm text-muted-foreground">Manage your account security settings</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Password</p>
                          <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Active Sessions</p>
                          <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                        </div>
                        <Button variant="outline" size="sm">View All</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other sections placeholder */}
              {!['profile', 'notifications', 'appearance', 'security'].includes(activeSection) && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    {settingsNav.find(n => n.id === activeSection)?.icon && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        {(() => {
                          const Icon = settingsNav.find(n => n.id === activeSection)?.icon;
                          return Icon ? <Icon className="w-8 h-8 text-muted-foreground" /> : null;
                        })()}
                      </motion.div>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    {settingsNav.find(n => n.id === activeSection)?.label}
                  </h3>
                  <p className="text-muted-foreground">
                    This section is coming soon
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
