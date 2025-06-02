import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./server/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("[Middleware] Pathname:", pathname);

  // Deixamos a proteção para a própria página admin
  // A proteção via middleware está causando ciclos de redirecionamento
  // devido a inconsistências com o NextAuth v5
  
  return NextResponse.next();
}

// Define os paths que o middleware deve aplicar
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

