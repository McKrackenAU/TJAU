import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { DownloadIcon, Loader2, RefreshCw, Trash2 } from 'lucide-react';

// API usage entry type
interface ApiUsageEntry {
  timestamp: string;
  endpoint: string;
  model: string;
  operation: string;
  status: 'success' | 'error' | 'rate_limited';
  estimatedCost: number;
  cardId?: string;
  cardName?: string;
}

// Summary data type
interface ApiUsageSummary {
  totalRequests: number;
  totalCost: number;
  costsByOperation: Record<string, number>;
  successCount: number;
  errorCount: number;
  rateLimitCount: number;
  usageByDay: Record<string, number>;
  cardsWithImages: string[];
  cardsWithImagesCount: number;
  recentUsage: ApiUsageEntry[];
}

export default function ApiUsageDashboard() {
  const [summary, setSummary] = useState<ApiUsageSummary | null>(null);
  const [logs, setLogs] = useState<ApiUsageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);
  const { toast } = useToast();

  // Function to format costs as USD
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  // Function to fetch summary data
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/admin/api-usage');
      if (!response.ok) {
        throw new Error('Failed to fetch API usage data');
      }
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching API usage summary:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch API usage data. Make sure you have admin privileges.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch detailed logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/admin/api-usage/logs');
      if (!response.ok) {
        throw new Error('Failed to fetch API usage logs');
      }
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching API usage logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch API usage logs. Make sure you have admin privileges.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to clear logs
  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all API usage logs? This action cannot be undone.')) {
      return;
    }

    setClearingLogs(true);
    try {
      const response = await apiRequest('POST', '/api/admin/api-usage/clear');
      if (!response.ok) {
        throw new Error('Failed to clear API usage logs');
      }
      
      toast({
        title: 'Success',
        description: 'API usage logs cleared successfully.',
      });
      
      // Refresh data
      await fetchSummary();
      await fetchLogs();
    } catch (error) {
      console.error('Error clearing API usage logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear API usage logs.',
        variant: 'destructive'
      });
    } finally {
      setClearingLogs(false);
    }
  };

  // Function to export logs as CSV
  const exportLogsAsCsv = () => {
    if (!logs.length) return;

    // Create CSV content
    const headers = ['Timestamp', 'Endpoint', 'Model', 'Operation', 'Status', 'Cost ($)', 'Card ID', 'Card Name'];
    const csvContent = [
      headers.join(','),
      ...logs.map(log => [
        log.timestamp,
        log.endpoint,
        log.model,
        log.operation,
        log.status,
        log.estimatedCost.toFixed(4),
        log.cardId || '',
        log.cardName || ''
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `api_usage_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!summary) return [];
    
    return Object.entries(summary.usageByDay).map(([date, cost]) => ({
      date,
      cost
    })).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Prepare operations chart data
  const prepareOperationsChartData = () => {
    if (!summary) return [];
    
    return Object.entries(summary.costsByOperation).map(([operation, cost]) => ({
      operation,
      cost
    })).sort((a, b) => b.cost - a.cost);
  };

  // Initial data fetch
  useEffect(() => {
    fetchSummary();
    fetchLogs();
  }, []);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Usage Dashboard</h2>
        <Button variant="outline" size="sm" onClick={() => { fetchSummary(); fetchLogs(); }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Cost</CardTitle>
              <CardDescription>All-time API usage cost</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{formatCost(summary.totalCost)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Requests</CardTitle>
              <CardDescription>Success vs Error vs Rate Limited</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.totalRequests}</p>
              <div className="text-sm mt-2 grid grid-cols-3 gap-1">
                <div>
                  <p className="text-green-500 font-medium">{summary.successCount}</p>
                  <p className="text-xs text-muted-foreground">Success</p>
                </div>
                <div>
                  <p className="text-red-500 font-medium">{summary.errorCount}</p>
                  <p className="text-xs text-muted-foreground">Error</p>
                </div>
                <div>
                  <p className="text-yellow-500 font-medium">{summary.rateLimitCount}</p>
                  <p className="text-xs text-muted-foreground">Rate Limited</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Generated Images</CardTitle>
              <CardDescription>Cards with images generated</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.cardsWithImagesCount}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {summary.cardsWithImagesCount > 0 
                  ? `~${formatCost(summary.cardsWithImagesCount * 0.04)} total image cost`
                  : 'No images generated yet'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="costs">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="logs">Detailed Logs</TabsTrigger>
          <TabsTrigger value="export">Export & Manage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Cost Breakdown</CardTitle>
              <CardDescription>API costs over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toFixed(2)}`} 
                    label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']} 
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="cost" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cost by Operation</CardTitle>
              <CardDescription>API costs by model and operation type</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareOperationsChartData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `$${value.toFixed(2)}`} />
                  <YAxis type="category" dataKey="operation" width={150} />
                  <Tooltip 
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Cost']} 
                    labelFormatter={(label) => `Operation: ${label}`}
                  />
                  <Bar dataKey="cost" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Logs</CardTitle>
              <CardDescription>Detailed record of all API calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border max-h-[500px] overflow-auto">
                <Table>
                  <TableCaption>Complete list of API calls made to OpenAI</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Card</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No logs available
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">{log.endpoint}</TableCell>
                          <TableCell>{log.model}</TableCell>
                          <TableCell>{log.operation}</TableCell>
                          <TableCell>
                            <span className={
                              log.status === 'success' ? 'text-green-500' :
                              log.status === 'error' ? 'text-red-500' : 'text-yellow-500'
                            }>
                              {log.status}
                            </span>
                          </TableCell>
                          <TableCell>{formatCost(log.estimatedCost)}</TableCell>
                          <TableCell className="max-w-[120px] truncate">{log.cardName || 'N/A'}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export & Manage Data</CardTitle>
              <CardDescription>Export logs to CSV and manage storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Export Options</h3>
                <Button 
                  variant="outline" 
                  onClick={exportLogsAsCsv}
                  disabled={logs.length === 0}
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export All Logs to CSV
                </Button>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Data Management</h3>
                <Button
                  variant="destructive"
                  onClick={clearLogs}
                  disabled={clearingLogs || logs.length === 0}
                >
                  {clearingLogs ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All API Usage Logs
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Warning: This will permanently delete all API usage logs. This action cannot be undone.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}