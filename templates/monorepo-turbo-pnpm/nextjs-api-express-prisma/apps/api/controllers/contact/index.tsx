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

export async function listContact(request: StarterRequest): Promise<StarterResponse> {
  return {
    statusCode: 200,
    body: {
      feature: "contact",
      filters: request.query ?? {},
      items: []
    }
  };
}

export async function createContact(request: StarterRequest): Promise<StarterResponse> {
  return {
    statusCode: 201,
    body: {
      feature: "contact",
      payload: request.body ?? {}
    }
  };
}
