import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { UserService } from './gen/app/v1/user_pb.js';
import './user-menu.js';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:8082',
});

const userClient = createClient(UserService, transport);

@customElement('app-header')
export class AppHeader extends LitElement {
  @state() private _userName = '';
  @state() private _userRole = '';

  async connectedCallback() {
    super.connectedCallback();
    try {
      const profile = await userClient.getProfile({ userId: 'current-user' });
      this._userName = profile.displayName;
      this._userRole = profile.roles.join(', ');
    } catch (err) {
      console.warn('UserService.GetProfile unavailable, falling back to local auth state', err);
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
      position: sticky;
      top: 0;
      z-index: 50;
      font-family: inherit;
    }

    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.875rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: #ffffff;
    }

    .brand-logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.125rem;
      color: #ffffff;
    }

    .brand-name {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .nav-link:hover, .nav-link.active {
      color: #f8fafc;
    }

    .right-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .website-link {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.15s ease;
    }

    .website-link:hover {
      color: #38bdf8;
    }
  `;

  render() {
    return html`
      <header class="header-inner">
        <a href="/" class="brand">
          <div class="brand-logo">L</div>
          <span class="brand-name">Lectory Studio</span>
        </a>

        <nav class="nav-links">
          <a href="#" class="nav-link active">Dashboard</a>
          <a href="#" class="nav-link">Pipelines</a>
          <a href="#" class="nav-link">Analytics</a>
        </nav>

        <div class="right-actions">
          <a href="https://lectory.dev" class="website-link" target="_blank" rel="noopener">
            <span>Go to Website</span>
            <span>↗</span>
          </a>
          <user-menu
            .userName="${this._userName || 'Guest Developer'}"
            .userRole="${this._userRole || 'Pro Tier'}"
          ></user-menu>
        </div>
      </header>
    `;
  }
}

