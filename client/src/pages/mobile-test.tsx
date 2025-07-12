import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { API_CONFIG } from '@/config/api-config';

export default function MobileTest() {
  const [deviceInfo, setDeviceInfo] = useState<any>({});
  const [apiStatus, setApiStatus] = useState<string>('checking...');

  useEffect(() => {
    // Gather device info
    const info = {
      userAgent: navigator.userAgent,
      isMobile: API_CONFIG.isMobile,
      apiURL: API_CONFIG.apiURL,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
    };
    setDeviceInfo(info);

    // Test API connectivity
    fetch(`${API_CONFIG.apiURL}/health`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setApiStatus('✅ API Connected');
        } else {
          setApiStatus(`❌ API Error: ${response.status}`);
        }
      })
      .catch(error => {
        setApiStatus(`❌ API Failed: ${error.message}`);
      });
  }, []);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mobile Compatibility Test</CardTitle>
          <CardDescription>Testing mobile device capabilities and API connectivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Device Detection:</strong>
              <p>Mobile: {deviceInfo.isMobile ? 'Yes' : 'No'}</p>
              <p>Screen: {deviceInfo.screenWidth}x{deviceInfo.screenHeight}</p>
              <p>Viewport: {deviceInfo.viewportWidth}x{deviceInfo.viewportHeight}</p>
            </div>
            <div>
              <strong>Network:</strong>
              <p>Online: {deviceInfo.onlineStatus ? 'Yes' : 'No'}</p>
              <p>Connection: {deviceInfo.connection}</p>
              <p>Cookies: {deviceInfo.cookieEnabled ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div>
            <strong>API Status:</strong>
            <p>{apiStatus}</p>
            <p className="text-xs text-gray-600">API URL: {deviceInfo.apiURL}</p>
          </div>
          
          <div>
            <strong>User Agent:</strong>
            <p className="text-xs break-all">{deviceInfo.userAgent}</p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-green-600 font-semibold">✅ Page Loaded Successfully!</p>
            <p className="text-sm text-gray-600">
              If you can see this page, the mobile app is loading correctly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}