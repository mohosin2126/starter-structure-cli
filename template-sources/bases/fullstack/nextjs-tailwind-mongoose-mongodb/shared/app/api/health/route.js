export function GET() {
  return Response.json({
    ok: true,
    app: "__APP_NAME__",
    stack: "nextjs-mongoose"
  });
}
