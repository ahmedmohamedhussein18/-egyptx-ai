import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  '/memories', 
  '/planner', 
  '/expenses', 
  '/travel-card', 
  '/tourist-passport', 
  '/government/dashboard', 
  '/national/dashboard',
  '/command-center'
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isProtected && !user) {
    let redirectUrl = new URL(`/login?redirectTo=${pathname}`, request.url);
    if (pathname.startsWith('/government')) {
      redirectUrl = new URL('/government/login', request.url);
    } else if (pathname.startsWith('/national')) {
      redirectUrl = new URL('/national/login', request.url);
    }
    
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // VERY IMPORTANT: Propagate any cookies set by Supabase during getUser()
    // (e.g. token refreshes or clearing dead tokens) to the redirect response.
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
