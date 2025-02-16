import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/auth/auth.service";

const authRoutes = ["/login", "/register"];

export const middleware = async (req: NextRequest) => {
  const userInfo = await getCurrentUser();
  const { pathname } = req.nextUrl;

  if (!userInfo) {
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirectPath=${pathname}`, req.url)
      );
    }
  }
};

export const config = {
  matcher: ["/create-shop"],
};
