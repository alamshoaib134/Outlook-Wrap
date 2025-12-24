const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0';

interface GraphResponse<T> {
  value: T[];
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
}

export async function fetchWithPagination<T>(
  endpoint: string,
  token: string,
  maxPages: number = 10
): Promise<T[]> {
  const results: T[] = [];
  let url: string | null = `${GRAPH_BASE_URL}${endpoint}`;
  let pageCount = 0;

  console.log(`[Graph API] Fetching: ${endpoint}`);

  while (url && pageCount < maxPages) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ConsistencyLevel: 'eventual',
          Prefer: 'outlook.timezone="UTC"',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Graph API] Error fetching ${endpoint}:`, response.status, response.statusText, errorText);
        break;
      }

      const data: GraphResponse<T> = await response.json();
      console.log(`[Graph API] Page ${pageCount + 1}: Got ${data.value?.length || 0} items`);
      results.push(...(data.value || []));
      url = data['@odata.nextLink'] || null;
      pageCount++;
    } catch (error) {
      console.error(`[Graph API] Fetch error for ${endpoint}:`, error);
      break;
    }
  }

  console.log(`[Graph API] Total results for ${endpoint}: ${results.length}`);
  return results;
}

export async function fetchSingle<T>(
  endpoint: string,
  token: string
): Promise<T | null> {
  const response = await fetch(`${GRAPH_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error(`Error fetching ${endpoint}:`, response.status, response.statusText);
    return null;
  }

  return response.json();
}

export async function fetchUserPhoto(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${GRAPH_BASE_URL}/me/photo/$value`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch {
    return null;
  }
}

export async function fetchCount(
  endpoint: string,
  token: string
): Promise<number> {
  const response = await fetch(`${GRAPH_BASE_URL}${endpoint}/$count`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
      ConsistencyLevel: 'eventual',
    },
  });

  if (!response.ok) {
    console.error(`Error fetching count for ${endpoint}:`, response.status);
    return 0;
  }

  const text = await response.text();
  return parseInt(text, 10) || 0;
}

// Helper to parse date strings
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

// Get day of week name
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Get month name
export function getMonthName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long' });
}

// Calculate duration in hours between two dates
export function getDurationHours(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
}

