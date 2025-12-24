import { NextResponse } from 'next/server';
import {
  fetchWithPagination,
  fetchSingle,
  fetchUserPhoto,
  getDayName,
  getMonthName,
  getDurationHours,
} from '@/lib/graph';
import type {
  WrapData,
  UserProfile,
  EmailStats,
  CalendarStats,
  GroupStats,
  PeopleStats,
  TaskStats,
  ContactCount,
  MonthlyCount,
  DayCount,
} from '@/lib/types';

// The token will be passed as a query param for now
// In production, use proper OAuth flow
const YEAR = 2025;
const START_DATE = `${YEAR}-01-01T00:00:00Z`;
const END_DATE = `${YEAR}-12-31T23:59:59Z`;

interface GraphMessage {
  id: string;
  subject: string;
  receivedDateTime: string;
  sender?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  toRecipients?: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
  }>;
}

interface GraphEvent {
  id: string;
  subject: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  isAllDay?: boolean;
  attendees?: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
    status: { response: string };
  }>;
}

interface GraphGroup {
  id: string;
  displayName: string;
  description?: string;
}

interface GraphPerson {
  displayName: string;
  jobTitle?: string;
  department?: string;
  userPrincipalName?: string;
}

interface GraphTaskList {
  id: string;
  displayName: string;
}

interface GraphTask {
  id: string;
  title: string;
  status: string;
  completedDateTime?: { dateTime: string };
  createdDateTime: string;
}

async function fetchEmailStats(token: string, userEmail?: string): Promise<EmailStats> {
  // Fetch sent emails
  const sentEmails = await fetchWithPagination<GraphMessage>(
    `/me/mailFolders/SentItems/messages?$filter=sentDateTime ge ${START_DATE} and sentDateTime le ${END_DATE}&$select=id,subject,sentDateTime,toRecipients&$top=999`,
    token,
    20
  );

  // Fetch received emails
  const receivedEmails = await fetchWithPagination<GraphMessage>(
    `/me/mailFolders/Inbox/messages?$filter=receivedDateTime ge ${START_DATE} and receivedDateTime le ${END_DATE}&$select=id,subject,receivedDateTime,sender&$top=999`,
    token,
    20
  );

  const userEmailLower = userEmail?.toLowerCase() || '';

  // Count recipients (exclude self)
  const recipientCounts: Record<string, ContactCount> = {};
  sentEmails.forEach((email) => {
    email.toRecipients?.forEach((recipient) => {
      const key = recipient.emailAddress.address.toLowerCase();
      // Exclude user's own email
      if (key === userEmailLower) return;
      if (!recipientCounts[key]) {
        recipientCounts[key] = {
          name: recipient.emailAddress.name || recipient.emailAddress.address,
          email: recipient.emailAddress.address,
          count: 0,
        };
      }
      recipientCounts[key].count++;
    });
  });

  // Count senders (exclude self)
  const senderCounts: Record<string, ContactCount> = {};
  receivedEmails.forEach((email) => {
    if (email.sender) {
      const key = email.sender.emailAddress.address.toLowerCase();
      // Exclude user's own email
      if (key === userEmailLower) return;
      if (!senderCounts[key]) {
        senderCounts[key] = {
          name: email.sender.emailAddress.name || email.sender.emailAddress.address,
          email: email.sender.emailAddress.address,
          count: 0,
        };
      }
      senderCounts[key].count++;
    }
  });

  // Emails by month
  const monthCounts: Record<string, number> = {};
  const dayCounts: Record<string, number> = {};

  [...sentEmails, ...receivedEmails].forEach((email) => {
    const date = new Date((email as GraphMessage).receivedDateTime || '');
    const month = getMonthName(date);
    const day = getDayName(date);
    monthCounts[month] = (monthCounts[month] || 0) + 1;
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  const topRecipients = Object.values(recipientCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topSenders = Object.values(senderCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const emailsByMonth: MonthlyCount[] = Object.entries(monthCounts)
    .map(([month, count]) => ({ month, count }));

  const emailsByDayOfWeek: DayCount[] = Object.entries(dayCounts)
    .map(([day, count]) => ({ day, count }));

  const busiestDay = emailsByDayOfWeek.sort((a, b) => b.count - a.count)[0]?.day || 'N/A';
  const busiestMonth = emailsByMonth.sort((a, b) => b.count - a.count)[0]?.month || 'N/A';

  return {
    sent: sentEmails.length,
    received: receivedEmails.length,
    topRecipients,
    topSenders,
    busiestDay,
    busiestMonth,
    emailsByMonth,
    emailsByDayOfWeek,
  };
}

async function fetchCalendarStats(token: string, userEmail?: string): Promise<CalendarStats> {
  // Try calendarView first with proper date format, include isAllDay to filter
  let events = await fetchWithPagination<GraphEvent>(
    `/me/calendarview?startdatetime=${YEAR}-01-01T00:00:00.000Z&enddatetime=${YEAR}-12-31T23:59:59.000Z&$select=id,subject,start,end,isAllDay,attendees&$top=100`,
    token,
    10
  );

  // Fallback to events endpoint if calendarView returns empty
  if (events.length === 0) {
    console.log('[Calendar] calendarView returned 0, trying /me/events...');
    events = await fetchWithPagination<GraphEvent>(
      `/me/events?$filter=start/dateTime ge '${YEAR}-01-01T00:00:00Z'&$select=id,subject,start,end,isAllDay,attendees&$orderby=start/dateTime desc&$top=100`,
      token,
      10
    );
  }

  // Filter out all-day events (they skew the duration stats)
  const regularMeetings = events.filter(event => !event.isAllDay);
  console.log(`[Calendar] Total events: ${events.length}, Regular meetings (excluding all-day): ${regularMeetings.length}`);

  let totalHours = 0;
  let longestMeeting = { subject: '', duration: 0 };
  const attendeeCounts: Record<string, ContactCount> = {};
  const monthCounts: Record<string, number> = {};
  const dayCounts: Record<string, number> = {};

  // Max duration cap: 8 hours per meeting (to handle edge cases)
  const MAX_MEETING_HOURS = 8;

  regularMeetings.forEach((event) => {
    let duration = getDurationHours(event.start.dateTime, event.end.dateTime);
    
    // Cap duration at MAX_MEETING_HOURS to avoid multi-day events skewing stats
    duration = Math.min(duration, MAX_MEETING_HOURS);
    totalHours += duration;

    if (duration > longestMeeting.duration && duration <= MAX_MEETING_HOURS) {
      longestMeeting = { subject: event.subject || 'Untitled', duration };
    }

    const date = new Date(event.start.dateTime);
    const month = getMonthName(date);
    const day = getDayName(date);
    monthCounts[month] = (monthCounts[month] || 0) + 1;
    dayCounts[day] = (dayCounts[day] || 0) + 1;

    event.attendees?.forEach((attendee) => {
      const key = attendee.emailAddress.address.toLowerCase();
      // Exclude the user's own email from meeting buddies
      if (userEmail && key === userEmail.toLowerCase()) {
        return;
      }
      if (!attendeeCounts[key]) {
        attendeeCounts[key] = {
          name: attendee.emailAddress.name || attendee.emailAddress.address,
          email: attendee.emailAddress.address,
          count: 0,
        };
      }
      attendeeCounts[key].count++;
    });
  });

  const topAttendees = Object.values(attendeeCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const meetingsByMonth: MonthlyCount[] = Object.entries(monthCounts)
    .map(([month, count]) => ({ month, count }));

  const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  const busiestMonth = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return {
    totalMeetings: regularMeetings.length,
    totalHours: Math.round(totalHours),
    busiestDay,
    busiestMonth,
    topAttendees,
    meetingsByMonth,
    averageMeetingDuration: regularMeetings.length > 0 ? Math.round((totalHours / regularMeetings.length) * 60) : 0,
    longestMeeting,
  };
}

async function fetchGroupStats(token: string): Promise<GroupStats> {
  const groups = await fetchWithPagination<GraphGroup>(
    '/me/transitiveMemberOf/microsoft.graph.group?$select=id,displayName,description&$top=999',
    token,
    5
  );

  return {
    totalGroups: groups.length,
    groups: groups.slice(0, 10).map((g) => ({
      id: g.id,
      displayName: g.displayName,
      description: g.description,
    })),
  };
}

async function fetchPeopleStats(token: string): Promise<PeopleStats> {
  const people = await fetchWithPagination<GraphPerson>(
    '/me/people?$top=10',
    token,
    1
  );

  return {
    topCollaborators: people.slice(0, 8).map((p) => ({
      displayName: p.displayName,
      jobTitle: p.jobTitle,
      department: p.department,
      userPrincipalName: p.userPrincipalName,
    })),
  };
}

async function fetchTaskStats(token: string): Promise<TaskStats> {
  // Get task lists
  const taskLists = await fetchWithPagination<GraphTaskList>(
    '/me/todo/lists?$select=id,displayName',
    token,
    1
  );

  let totalTasks = 0;
  let completedTasks = 0;

  // Fetch tasks from each list
  for (const list of taskLists.slice(0, 5)) {
    const tasks = await fetchWithPagination<GraphTask>(
      `/me/todo/lists/${list.id}/tasks?$select=id,title,status,completedDateTime,createdDateTime`,
      token,
      2
    );

    tasks.forEach((task) => {
      // Check if task was created or completed in the year
      const createdDate = new Date(task.createdDateTime);
      if (createdDate.getFullYear() === YEAR) {
        totalTasks++;
        if (task.status === 'completed') {
          completedTasks++;
        }
      }
    });
  }

  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    // Fetch user profile first (needed to exclude user from meeting buddies)
    const userProfile = await fetchSingle<{ displayName: string; mail: string; jobTitle?: string }>(
      '/me?$select=displayName,mail,jobTitle',
      token
    );

    const userEmail = userProfile?.mail || '';

    // Fetch all stats in parallel (pass user email to exclude self from lists)
    const [userPhoto, emailStats, calendarStats, groupStats, peopleStats, taskStats] = await Promise.all([
      fetchUserPhoto(token),
      fetchEmailStats(token, userEmail),
      fetchCalendarStats(token, userEmail),
      fetchGroupStats(token),
      fetchPeopleStats(token),
      fetchTaskStats(token),
    ]);

    const wrapData: WrapData = {
      user: {
        displayName: userProfile?.displayName || 'User',
        mail: userProfile?.mail || '',
        jobTitle: userProfile?.jobTitle,
        photo: userPhoto || undefined,
      },
      email: emailStats,
      calendar: calendarStats,
      groups: groupStats,
      people: peopleStats,
      tasks: taskStats,
      year: YEAR,
    };

    return NextResponse.json(wrapData);
  } catch (error) {
    console.error('Error fetching wrap data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Microsoft Graph API' },
      { status: 500 }
    );
  }
}

