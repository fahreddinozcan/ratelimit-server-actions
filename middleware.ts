import { NextResponse, NextRequest } from "next/server";
import {
  ResponseCookies,
  RequestCookies,
} from "next/dist/server/web/spec-extension/cookies";

function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export function middleware(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  //   console.log("ip address", forwarded);
  const ip = forwarded ? forwarded.split(/, /)[0] : "0.0.0.1";

  const response = NextResponse.next();

  response.cookies.set("ip_address", ip as string);
  applySetCookie(req, response);
  return response;
}
