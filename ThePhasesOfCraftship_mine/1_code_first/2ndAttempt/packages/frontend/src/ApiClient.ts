import { PostDetailsDto, PostPreviewDto } from "@dddforum/shared/dist/dtos/PostDto";
import { isServerErrorDto, ServerErrorDto } from "@dddforum/shared/dist/dtos/ServerErrorDto";
import { SignInDto, SignUpDto, UserDto } from "@dddforum/shared/dist/dtos/UserDto";
import { VoteType } from "@dddforum/shared/dist/dtos/VoteDto";

interface WithAbortSignal {
  abortSignal?: AbortSignal;
}

interface HttClientOptions extends WithAbortSignal {
  withCredentials?: boolean;
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

  private getHeaders({ withCredentials }: HttClientOptions): Record<string, string> {
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

  private async processResponse<T>(response: Response): Promise<T> {
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
    const response = await fetch(new URL(path, this.baseUrl), {
      headers: this.getHeaders(options),
      signal: options.abortSignal,
    });

    return this.processResponse(response);
  }

  async post<T>(path: string, body: unknown, options: HttClientOptions = {}): Promise<T> {
    const headers = this.getHeaders(options);

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(new URL(path, this.baseUrl), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: options.abortSignal,
    });

    return this.processResponse(response);
  }

  async delete<T>(path: string, options: HttClientOptions = {}): Promise<T> {
    const response = await fetch(new URL(path, this.baseUrl), {
      method: "DELETE",
      headers: this.getHeaders(options),
      signal: options.abortSignal,
    });

    return this.processResponse(response);
  }
}

export class ApiClient {
  constructor(private readonly httpClient = new HttpClient("http://localhost:3000")) {}

  getPosts(options?: WithAbortSignal): Promise<PostPreviewDto[]> {
    return this.httpClient.get("/posts", {
      ...options,
      withCredentials: true,
    });
  }

  getPost(id: string, options?: WithAbortSignal): Promise<PostDetailsDto> {
    return this.httpClient.get(`/posts/${id}`, {
      ...options,
      withCredentials: true,
    });
  }

  me(options?: WithAbortSignal): Promise<UserDto> {
    return this.httpClient.get("/users/me", {
      ...options,
      withCredentials: true,
    });
  }

  signIn(credentials: SignInDto, options?: WithAbortSignal): Promise<{ accessToken: string }> {
    return this.httpClient.post("/users/sign-in", credentials, options);
  }

  signUp(user: SignUpDto, options?: WithAbortSignal): Promise<{ accessToken: string }> {
    return this.httpClient.post("/users/sign-up", user, options);
  }

  voteOnPost(id: number, voteType: VoteType, options?: WithAbortSignal): Promise<void> {
    return this.httpClient.post(
      voteType === VoteType.Upvote ? `/posts/${id}/upvote` : `/posts/${id}/downvote`,
      undefined,
      { ...options, withCredentials: true },
    );
  }

  removeVoteOnPost(id: number, options?: WithAbortSignal): Promise<void> {
    return this.httpClient.delete(`/posts/${id}/vote`, { ...options, withCredentials: true });
  }

  voteOnComment(id: number, voteType: VoteType, options?: WithAbortSignal): Promise<void> {
    return this.httpClient.post(
      voteType === VoteType.Upvote ? `/comments/${id}/upvote` : `/comments/${id}/downvote`,
      undefined,
      { ...options, withCredentials: true },
    );
  }

  removeVoteOnComment(id: number, options?: WithAbortSignal): Promise<void> {
    return this.httpClient.delete(`/comments/${id}/vote`, { ...options, withCredentials: true });
  }
}
