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
  let response = NextResponse.next({ request });

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
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  if (isProtected && !user) {
    if (pathname.startsWith('/government')) {
      return NextResponse.redirect(new URL('/government/login', request.url));
    }
    if (pathname.startsWith('/national')) {
      return NextResponse.redirect(new URL('/national/login', request.url));
    }
    return NextResponse.redirect(new URL(`/login?redirectTo=${pathname}`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
