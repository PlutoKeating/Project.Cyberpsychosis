export interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/health" || url.pathname === "/api/info") {
      return new Response(
        JSON.stringify({
          name: "cyberpsychosis",
          version: "0.1.0",
          license: "Apache-2.0",
          repository: "https://github.com/PlutoKeating/Project.Cyberpsychosis",
          packages: [
            "cyberpsychosis",
            "cyberpsychosis-core",
            "cyberpsychosis-plugins",
            "cyberpsychosis-demo",
            "cyberpsychosis-tui",
            "cyberpsychosis-web",
          ],
          status: "ok",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=60",
          },
        }
      );
    }

    return env.ASSETS.fetch(request);
  },
};
