import fs from 'fs';
import path from 'path';
import { CACHE_DIR } from './constants';

// Define the structure for API usage data
export interface ApiUsageEntry {
  timestamp: string;
  endpoint: string;
  model: string;
  operation: string;
  status: 'success' | 'error' | 'rate_limited';
  estimatedCost: number;
  cardId?: string;
  cardName?: string;
}

// Define costs for different API operations (in USD)
export const API_COSTS = {
  'dall-e-3': {
    'image.generate': 0.04, // $0.04 per image at 1024x1024 standard quality
  },
  'gpt-4o': {
    'chat.completion': 0.01, // Approximate cost per completion
  },
  'gpt-3.5-turbo': {
    'chat.completion': 0.002, // Approximate cost per completion
  },
  'tts-1': {
    'audio.speech': 0.015, // Approximate cost per audio generation
  }
};

// Usage tracking functionality
class ApiUsageTracker {
  private usageLogPath: string;
  
  constructor() {
    // Create the directory if it doesn't exist
    const usageDirPath = path.join(CACHE_DIR, 'usage');
    if (!fs.existsSync(usageDirPath)) {
      fs.mkdirSync(usageDirPath, { recursive: true });
    }
    
    // Path to the usage log file
    this.usageLogPath = path.join(usageDirPath, 'api_usage.json');
    
    // Initialize the log file if it doesn't exist
    if (!fs.existsSync(this.usageLogPath)) {
      fs.writeFileSync(this.usageLogPath, JSON.stringify([], null, 2));
    }
  }
  
  /**
   * Track a new API usage entry
   */
  trackUsage(entry: Omit<ApiUsageEntry, 'timestamp'>): void {
    try {
      // Read existing log
      const usageLog: ApiUsageEntry[] = this.getUsageLog();
      
      // Add new entry with timestamp
      const newEntry: ApiUsageEntry = {
        ...entry,
        timestamp: new Date().toISOString()
      };
      
      usageLog.push(newEntry);
      
      // Write updated log back to file
      fs.writeFileSync(this.usageLogPath, JSON.stringify(usageLog, null, 2));
    } catch (error) {
      console.error('Error tracking API usage:', error);
    }
  }
  
  /**
   * Get the complete usage log
   */
  getUsageLog(): ApiUsageEntry[] {
    try {
      if (fs.existsSync(this.usageLogPath)) {
        const data = fs.readFileSync(this.usageLogPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading API usage log:', error);
    }
    return [];
  }
  
  /**
   * Get usage summary with total costs
   */
  getUsageSummary() {
    const usageLog = this.getUsageLog();
    
    // Get total cost
    const totalCost = usageLog.reduce((sum, entry) => sum + entry.estimatedCost, 0);
    
    // Get costs by operation type
    const costsByOperation: Record<string, number> = {};
    usageLog.forEach(entry => {
      const key = `${entry.model}-${entry.operation}`;
      costsByOperation[key] = (costsByOperation[key] || 0) + entry.estimatedCost;
    });
    
    // Count successful vs failed calls
    const successCount = usageLog.filter(entry => entry.status === 'success').length;
    const errorCount = usageLog.filter(entry => entry.status === 'error').length;
    const rateLimitCount = usageLog.filter(entry => entry.status === 'rate_limited').length;
    
    // Get usage over time (daily)
    const usageByDay: Record<string, number> = {};
    usageLog.forEach(entry => {
      const day = entry.timestamp.split('T')[0];
      usageByDay[day] = (usageByDay[day] || 0) + entry.estimatedCost;
    });
    
    // Get cards with generated images
    const cardsWithImages = new Set<string>();
    usageLog.forEach(entry => {
      if (entry.cardId && entry.operation === 'image.generate' && entry.status === 'success') {
        cardsWithImages.add(entry.cardId);
      }
    });
    
    return {
      totalRequests: usageLog.length,
      totalCost,
      costsByOperation,
      successCount,
      errorCount,
      rateLimitCount,
      usageByDay,
      cardsWithImages: Array.from(cardsWithImages),
      cardsWithImagesCount: cardsWithImages.size,
      recentUsage: usageLog.slice(-10).reverse() // Last 10 entries
    };
  }
  
  /**
   * Clear usage log
   */
  clearUsageLog() {
    fs.writeFileSync(this.usageLogPath, JSON.stringify([], null, 2));
  }
}

// Export a singleton instance
export const apiUsageTracker = new ApiUsageTracker();