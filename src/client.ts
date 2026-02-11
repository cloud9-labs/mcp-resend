const BASE_URL = "https://api.resend.com";

/**
 * Resend API Client
 *
 * Reads API key from the RESEND_API_KEY environment variable.
 * Rate limiting: 10 req/sec with sliding window and 429 retry.
 */
export class ResendClient {
  private readonly apiKey: string;
  private requestTimestamps: number[] = [];

  constructor() {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error(
        "RESEND_API_KEY environment variable is not set. " +
          "Get your API key from https://resend.com/api-keys"
      );
    }
    this.apiKey = key;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const windowMs = 1_000;
    const maxRequests = 10;

    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < windowMs
    );

    if (this.requestTimestamps.length >= maxRequests) {
      const oldest = this.requestTimestamps[0];
      const waitMs = windowMs - (now - oldest) + 50;
      if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    this.requestTimestamps.push(Date.now());
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    await this.throttle();

    const url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = { method, headers };

    if (body !== undefined && (method === "POST" || method === "PATCH")) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After");
      const waitSec = retryAfter ? Number(retryAfter) : 2;
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      return this.request<T>(method, path, body);
    }

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new Error(
        `Resend API error (${res.status} ${res.statusText}): ${errorBody}`
      );
    }

    if (res.status === 204) {
      return {} as T;
    }

    return (await res.json()) as T;
  }

  // ----------------------------------------------------------
  // Email Operations
  // ----------------------------------------------------------

  async sendEmail(
    from: string,
    to: string | string[],
    subject: string,
    html: string,
    text?: string,
    cc?: string | string[],
    bcc?: string | string[],
    replyTo?: string | string[],
    scheduledAt?: string
  ): Promise<ResendSendResult> {
    const payload: Record<string, unknown> = { from, to, subject, html };
    if (text) payload.text = text;
    if (cc) payload.cc = cc;
    if (bcc) payload.bcc = bcc;
    if (replyTo) payload.reply_to = replyTo;
    if (scheduledAt) payload.scheduled_at = scheduledAt;
    return this.request<ResendSendResult>("POST", "/emails", payload);
  }

  async getEmail(emailId: string): Promise<ResendEmail> {
    return this.request<ResendEmail>("GET", `/emails/${emailId}`);
  }

  async listEmails(): Promise<ResendListResult<ResendEmail>> {
    return this.request<ResendListResult<ResendEmail>>("GET", "/emails");
  }

  // ----------------------------------------------------------
  // Contact Operations
  // ----------------------------------------------------------

  async createContact(
    audienceId: string,
    email: string,
    firstName?: string,
    lastName?: string,
    unsubscribed?: boolean
  ): Promise<ResendContact> {
    const payload: Record<string, unknown> = { email };
    if (firstName) payload.first_name = firstName;
    if (lastName) payload.last_name = lastName;
    if (unsubscribed !== undefined) payload.unsubscribed = unsubscribed;
    return this.request<ResendContact>(
      "POST",
      `/audiences/${audienceId}/contacts`,
      payload
    );
  }

  async getContact(audienceId: string, contactId: string): Promise<ResendContact> {
    return this.request<ResendContact>(
      "GET",
      `/audiences/${audienceId}/contacts/${contactId}`
    );
  }

  async updateContact(
    audienceId: string,
    contactId: string,
    properties: Record<string, unknown>
  ): Promise<ResendContact> {
    return this.request<ResendContact>(
      "PATCH",
      `/audiences/${audienceId}/contacts/${contactId}`,
      properties
    );
  }

  async deleteContact(audienceId: string, contactId: string): Promise<ResendDeleteResult> {
    return this.request<ResendDeleteResult>(
      "DELETE",
      `/audiences/${audienceId}/contacts/${contactId}`
    );
  }

  async listContacts(audienceId: string): Promise<ResendListResult<ResendContact>> {
    return this.request<ResendListResult<ResendContact>>(
      "GET",
      `/audiences/${audienceId}/contacts`
    );
  }

  // ----------------------------------------------------------
  // Audience Operations
  // ----------------------------------------------------------

  async createAudience(name: string): Promise<ResendAudience> {
    return this.request<ResendAudience>("POST", "/audiences", { name });
  }

  async getAudience(audienceId: string): Promise<ResendAudience> {
    return this.request<ResendAudience>("GET", `/audiences/${audienceId}`);
  }

  async listAudiences(): Promise<ResendListResult<ResendAudience>> {
    return this.request<ResendListResult<ResendAudience>>("GET", "/audiences");
  }

  async deleteAudience(audienceId: string): Promise<ResendDeleteResult> {
    return this.request<ResendDeleteResult>("DELETE", `/audiences/${audienceId}`);
  }

  // ----------------------------------------------------------
  // Domain Operations
  // ----------------------------------------------------------

  async getDomain(domainId: string): Promise<ResendDomain> {
    return this.request<ResendDomain>("GET", `/domains/${domainId}`);
  }

  async listDomains(): Promise<ResendListResult<ResendDomain>> {
    return this.request<ResendListResult<ResendDomain>>("GET", "/domains");
  }
}

// ============================================================
// Response Types
// ============================================================

export interface ResendSendResult {
  id: string;
}

export interface ResendEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  created_at: string;
  last_event?: string;
}

export interface ResendContact {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  unsubscribed: boolean;
}

export interface ResendAudience {
  id: string;
  name: string;
  created_at: string;
}

export interface ResendDomain {
  id: string;
  name: string;
  status: string;
  created_at: string;
  region: string;
}

export interface ResendDeleteResult {
  id: string;
  deleted: boolean;
}

export interface ResendListResult<T> {
  data: T[];
}
