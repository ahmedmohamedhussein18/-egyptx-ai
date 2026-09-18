import { createClient } from '@/lib/supabase/client';

export type AnalyticsEventType = 'page_view' | 'search' | 'attraction_view' | 'planner_started' | 'planner_completed' | 'qr_checkin' | 'favorite_added' | 'emergency_location_granted' | 'emergency_location_denied' | 'emergency_location_copied' | 'emergency_call_clicked';

let session_id: string | null = null;

// Helper to generate a simple session ID for the current browser session
function getSessionId() {
  if (typeof window === 'undefined') return null;
  if (!session_id) {
    session_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  return session_id;
}

export async function trackEvent(eventType: AnalyticsEventType, metadata?: Record<string, any>) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Prevent duplicate page views during React StrictMode double rendering
    if (typeof window !== 'undefined' && eventType === 'page_view') {
      const lastViewed = sessionStorage.getItem('last_page_view');
      const currentPath = window.location.pathname;
      if (lastViewed === currentPath) {
        // Debounce exact same page view within 2 seconds
        const lastViewedTime = parseInt(sessionStorage.getItem('last_page_view_time') || '0');
        if (Date.now() - lastViewedTime < 2000) {
          return; // Skip tracking
        }
      }
      sessionStorage.setItem('last_page_view', currentPath);
      sessionStorage.setItem('last_page_view_time', Date.now().toString());
    }

    const payload: any = {
      event_type: eventType,
      session_id: getSessionId(),
      metadata: metadata || {}
    };

    if (user) {
      payload.user_id = user.id;
    }

    if (metadata?.attraction_id) {
      payload.attraction_id = metadata.attraction_id;
    }

    if (metadata?.governorate_id) {
      payload.governorate_id = metadata.governorate_id;
    }

    // Fire and forget
    supabase.from('analytics_events').insert(payload).then(({ error }) => {
      if (error) {
        console.error('Analytics tracking error:', error);
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    // Silent fail
  }
}
