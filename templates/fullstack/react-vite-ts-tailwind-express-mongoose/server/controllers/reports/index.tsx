export type StarterRequest = {
  params?: Record<string, string>;
  query?: Record<string, string>;
  body?: Record<string, unknown>;
  user?: {
    id: string;
    role: string;
  };
};

export type StarterResponse = {
  statusCode: number;
  body: Record<string, unknown>;
};

export async function listReports(request: StarterRequest): Promise<StarterResponse> {
  return {
    statusCode: 200,
    body: {
      feature: "reports",
      filters: request.query ?? {},
      items: []
    }
  };
}

export async function createReports(request: StarterRequest): Promise<StarterResponse> {
  return {
    statusCode: 201,
    body: {
      feature: "reports",
      payload: request.body ?? {}
    }
  };
}
