// Vercel serverless entry point.
// The api-server build (pnpm --filter @workspace/api-server run build) produces
// dist/app.mjs which exports the Express app without calling listen().
import app from "../artifacts/api-server/dist/app.mjs";

export default app;
