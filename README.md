# Resend Email MCP Server

A Model Context Protocol (MCP) server that provides seamless integration with the [Resend](https://resend.com) email API. Send transactional emails, manage contacts and audiences, and monitor domains directly from Claude, Cursor, or any MCP-compatible client.

## Features

- **Email Sending** - Send emails with HTML/text content, CC, BCC, reply-to, and scheduling
- **Email Tracking** - Get delivery status and email details
- **Contact Management** - Create, update, delete, and list contacts in audiences
- **Audience Management** - Organize contacts into audiences
- **Domain Management** - View domain verification status
- **Built-in Rate Limiting** - Automatic throttling (10 req/s) with 429 retry

## Available Tools (14)

| Tool | Description |
|------|-------------|
| `resend_send_email` | Send an email with HTML/text, CC, BCC, scheduling |
| `resend_get_email` | Get email details and delivery status |
| `resend_list_emails` | List all sent emails |
| `resend_create_contact` | Create a new contact in an audience |
| `resend_get_contact` | Get contact details by ID |
| `resend_update_contact` | Update contact properties |
| `resend_delete_contact` | Delete a contact from an audience |
| `resend_list_contacts` | List all contacts in an audience |
| `resend_create_audience` | Create a new audience |
| `resend_get_audience` | Get audience details |
| `resend_list_audiences` | List all audiences |
| `resend_delete_audience` | Delete an audience |
| `resend_get_domain` | Get domain verification status |
| `resend_list_domains` | List all verified domains |

## Quick Start

```bash
npx @cloud9-labs/mcp-resend
```

## Prerequisites

- Node.js >= 20.0.0
- Resend API key from [Resend Dashboard](https://resend.com/api-keys)

## Installation

### Via npx (Recommended)

No installation needed - configure your MCP client to use npx.

### Via npm

```bash
npm i -g @cloud9-labs/mcp-resend
```

### From Source

```bash
git clone https://github.com/cloud9-labs/mcp-resend.git
cd mcp-resend
npm ci
npm run build
```

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": ["-y", "@cloud9-labs/mcp-resend"],
      "env": {
        "RESEND_API_KEY": "re_your_api_key_here"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "resend": {
      "command": "npx",
      "args": ["-y", "@cloud9-labs/mcp-resend"],
      "env": {
        "RESEND_API_KEY": "re_your_api_key_here"
      }
    }
  }
}
```

## Usage Examples

- "Send a welcome email to john@example.com from onboarding@mycompany.com"
- "List all my email audiences"
- "Create a contact for Jane Doe in audience abc123"
- "Check the delivery status of email xyz789"
- "List all verified domains"
- "Schedule an email for tomorrow at 10am"

## Building an AI Sales Automation System?

This MCP server is part of an open-source toolkit for AI-powered sales automation. We are building MCP servers that connect your entire sales stack.

Follow our progress and get updates:

- **X (Twitter)**: [@cloud9_ai_labs](https://x.com/cloud9_ai_labs)
- **GitHub**: [cloud9-labs](https://github.com/cloud9-labs)

## License

MIT
