import { cookies } from "next/headers";

export async function POST() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SPOTIFY_CLIENT_ID!,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  });

  const tokenResponse = await response.json();
  const cookieStore = await cookies(); // this is MutableCookies here

  cookieStore.set({
    name: "spotify_access_token",
    value: tokenResponse.access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600,
    sameSite: "lax",
  });

  return Response.json({ success: true });
}
