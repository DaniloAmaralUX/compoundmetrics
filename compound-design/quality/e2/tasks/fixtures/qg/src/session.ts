export function getSession(req: Request) {
  const currentUserId = req.headers.get("x-user-id");
  if (!currentUserId) return null;
  return { currentUserId, startedAt: Date.now() };
}
