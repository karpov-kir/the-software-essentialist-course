import { PostDetailsDto, PostFilter, PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { isServerErrorDto, ServerErrorDto } from "@dddforum/shared/dist/dtos/ServerErrorDto";
import { SignInDto, SignUpDto, UserDto } from "@dddforum/shared/dist/dtos/UserDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";

interface WithAbortSignal {
  abortSignal?: AbortSignal;
}

interface HttClientOptions extends WithAbortSignal {
  addAuthHeader?: boolean;
  query?: Record<string, string>;
}

export class ServerErrorResponse extends Error {
  constructor(
    public readonly serverError: ServerErrorDto,
    public readonly status: number,
  ) {
    super(serverError.message);
  }
}

class HttpClient {
  constructor(private readonly baseUrl: string) {}

  private constructUrl(path: string, { query }: HttClientOptions): URL {
    const url = new URL(path, this.baseUrl);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        url.searchParams.append(key, value);
      }
    }

    return url;
  }

  private prepareHeaders({ addAuthHeader: withCredentials }: HttClientOptions): Record<string, string> {
    if (withCredentials) {
      const token = localStorage.getItem("accessToken");

      // If there is no token we still may want to send the request because many endpoints have optional authentication
      // (e.g. `/posts` endpoint also returns if the current user has voted on the post).
      if (!token) {
        return {};
      }

      return { Authorization: `Bearer ${token}` };
    }

    return {};
  }

  private async processJsonResponse<T>(response: Response): Promise<T> {
    const responseBody = await response.json();

    if (isServerErrorDto(responseBody)) {
      throw new ServerErrorResponse(responseBody, response.status);
    }

    if (!response.ok) {
      throw new Error("Could not complete request");
    }

    return responseBody;
  }

  async get<T>(path: string, options: HttClientOptions = {}): Promise<T> {
    const response = await fetch(this.constructUrl(path, options), {
      headers: this.prepareHeaders(options),
      signal: options.abortSignal,
    });

    return this.processJsonResponse(response);
  }

  async postRaw(path: string, body: unknown, options: HttClientOptions = {}): Promise<Response> {
    const headers = this.prepareHeaders(options);

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    return fetch(new URL(path, this.baseUrl), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: options.abortSignal,
    });
  }

  async post<T>(path: string, body: unknown, options: HttClientOptions = {}): Promise<T> {
    return this.processJsonResponse(await this.postRaw(path, body, options));
  }

  async deleteRaw(path: string, options: HttClientOptions = {}): Promise<Response> {
    return fetch(new URL(path, this.baseUrl), {
      method: "DELETE",
      headers: this.prepareHeaders(options),
      signal: options.abortSignal,
    });
  }

  async delete<T>(path: string, options: HttClientOptions = {}): Promise<T> {
    return this.processJsonResponse(await this.deleteRaw(path, options));
  }
}

export class ApiClient {
  constructor(private readonly httpClient = new HttpClient("http://localhost:3000")) {}

  getPosts(filter: PostFilter, options?: WithAbortSignal): Promise<PostPreviewDto[]> {
    return this.httpClient.get("/posts", {
      ...options,
      query: { filter },
      addAuthHeader: true,
    });
  }

  getPost(id: string, options?: WithAbortSignal): Promise<PostDetailsDto> {
    return this.httpClient.get(`/posts/${id}`, {
      ...options,
      addAuthHeader: true,
    });
  }

  me(options?: WithAbortSignal): Promise<UserDto> {
    return this.httpClient.get("/users/me", {
      ...options,
      addAuthHeader: true,
    });
  }

  signIn(credentials: SignInDto, options?: WithAbortSignal): Promise<{ accessToken: string }> {
    return this.httpClient.post("/users/sign-in", credentials, options);
  }

  signUp(user: SignUpDto, options?: WithAbortSignal): Promise<{ accessToken: string }> {
    return this.httpClient.post("/users/sign-up", user, options);
  }

  async voteOnPost(id: number, voteType: VoteType, action: "add" | "remove", options?: WithAbortSignal): Promise<void> {
    if (action === "remove") {
      await this.httpClient.deleteRaw(`/posts/${id}/vote`, { ...options, addAuthHeader: true });
    }

    await this.httpClient.postRaw(
      voteType === VoteType.Upvote ? `/posts/${id}/upvote` : `/posts/${id}/downvote`,
      undefined,
      { ...options, addAuthHeader: true },
    );
  }

  async voteOnComment(
    id: number,
    voteType: VoteType,
    action: "add" | "remove",
    options?: WithAbortSignal,
  ): Promise<void> {
    if (action === "remove") {
      await this.httpClient.deleteRaw(`/comments/${id}/vote`, { ...options, addAuthHeader: true });
    }

    await this.httpClient.postRaw(
      voteType === VoteType.Upvote ? `/comments/${id}/upvote` : `/comments/${id}/downvote`,
      undefined,
      { ...options, addAuthHeader: true },
    );
  }
}
