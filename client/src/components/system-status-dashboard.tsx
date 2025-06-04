import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  RefreshCw, 
  Server, 
  Database, 
  Users, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  MemoryStick,
  Globe,
  Zap
} from 'lucide-react';

interface SystemStatus {
  timestamp: string;
  status: 'healthy' | 'error';
  uptime: number;
  database: {
    status: 'up' | 'down';
    responseTime: number;
    error: string | null;
  };
  memory: {
    used: number;
    total: number;
    usagePercent: number;
    rss: number;
    external: number;
  };
  environment: {
    nodeVersion: string;
    platform: string;
    arch: string;
    timezone: string;
  };
  services: {
    openai: 'configured' | 'not_configured';
    stripe: 'configured' | 'not_configured';
    elevenlabs: 'configured' | 'not_configured';
    database: 'configured' | 'not_configured';
  };
  responseTime: number;
}

interface SystemMetrics {
  users: {
    total: number;
    active: number;
    growth: number;
  };
  readings: {
    total: number;
    today: number;
    avgPerUser: number;
  };
  journal: {
    totalEntries: number;
    avgPerUser: number;
  };
  subscriptions: {
    active: number;
    trial: number;
    canceled: number;
    total: number;
  };
  timestamp: string;
}

export default function SystemStatusDashboard() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchSystemStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/admin/system-status');
      if (!response.ok) {
        throw new Error('Failed to fetch system status');
      }
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching system status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system status. Please check your admin privileges.',
        variant: 'destructive'
      });
    }
  };

  const fetchSystemMetrics = async () => {
    try {
      const response = await apiRequest('GET', '/api/admin/system-metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch system metrics');
      }
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system metrics. Please check your admin privileges.',
        variant: 'destructive'
      });
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchSystemStatus(), fetchSystemMetrics()]);
      setLastRefresh(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getServiceIcon = (service: string, configured: boolean) => {
    if (configured) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'up':
        return <Badge variant="default" className="bg-green-500 text-white">Healthy</Badge>;
      case 'down':
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!status || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">System Status</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of system health and performance
          </p>
          {lastRefresh && (
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshData}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(status.status)}
            <p className="text-xs text-muted-foreground mt-1">
              Response: {status.responseTime}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(status.database.status)}
            <p className="text-xs text-muted-foreground mt-1">
              Response: {status.database.responseTime}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{formatUptime(status.uptime)}</p>
            <p className="text-xs text-muted-foreground">System running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MemoryStick className="h-4 w-4" />
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={status.memory.usagePercent} className="mb-2" />
            <p className="text-sm">{status.memory.usagePercent}% used</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(status.memory.used)} / {formatBytes(status.memory.total)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            External Services
          </CardTitle>
          <CardDescription>
            Configuration status of external API services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(status.services).map(([service, configured]) => (
              <div key={service} className="flex items-center gap-2">
                {getServiceIcon(service, configured === 'configured')}
                <span className="text-sm capitalize">
                  {service === 'elevenlabs' ? 'ElevenLabs' : service}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User & Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total Users</span>
              <span className="text-2xl font-bold text-primary">{metrics.users.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Active Users (30d)</span>
              <span className="text-lg font-semibold">{metrics.users.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Engagement Rate</span>
              <span className="text-lg font-semibold">{metrics.users.growth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Content Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total Readings</span>
              <span className="text-2xl font-bold text-primary">{metrics.readings.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Readings Today</span>
              <span className="text-lg font-semibold">{metrics.readings.today}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Journal Entries</span>
              <span className="text-lg font-semibold">{metrics.journal.totalEntries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Avg Readings/User</span>
              <span className="text-lg font-semibold">{metrics.readings.avgPerUser}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Overview</CardTitle>
          <CardDescription>
            Current subscription status breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{metrics.subscriptions.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{metrics.subscriptions.trial}</p>
              <p className="text-sm text-muted-foreground">Trial</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.subscriptions.canceled}</p>
              <p className="text-sm text-muted-foreground">Canceled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{metrics.subscriptions.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Environment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Node.js Version</p>
              <p className="text-muted-foreground">{status.environment.nodeVersion}</p>
            </div>
            <div>
              <p className="font-medium">Platform</p>
              <p className="text-muted-foreground">{status.environment.platform}</p>
            </div>
            <div>
              <p className="font-medium">Architecture</p>
              <p className="text-muted-foreground">{status.environment.arch}</p>
            </div>
            <div>
              <p className="font-medium">Timezone</p>
              <p className="text-muted-foreground">{status.environment.timezone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}