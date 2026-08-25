import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './app-header.js';
import './auth-modal.js';

@customElement('app-shell')
export class AppShell extends LitElement {
  @state() private _authModalOpen = false;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #090d16;
      color: #f8fafc;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
      width: 100%;
      box-sizing: border-box;
    }

    .workspace-card {
      background: #131b2e;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }

    .workspace-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #6366f1, #06b6d4);
    }

    .tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 0.75rem;
      color: #ffffff;
    }

    .description {
      color: #94a3b8;
      font-size: 1.05rem;
      line-height: 1.6;
      max-width: 600px;
      margin-bottom: 2rem;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }

    .status-box {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      padding: 1.25rem;
    }

    .status-title {
      font-size: 0.8125rem;
      color: #94a3b8;
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-val {
      font-size: 1.125rem;
      font-weight: 600;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #22c55e;
      box-shadow: 0 0 8px #22c55e;
    }
  `;

  render() {
    return html`
      <div @open-auth-modal="${() => (this._authModalOpen = true)}">
        <app-header></app-header>
        <main>
          <div class="workspace-card">
            <span class="tag">Active Workspace</span>
            <h1>Course Pipeline Studio</h1>
            <p class="description">
              Build and train interactive role-play scenarios with AI avatars.
            </p>

            <div class="status-grid">
              <div class="status-box">
                <div class="status-title">Session State</div>
                <div class="status-val">
                  <div class="indicator"></div>
                  <span>Guest Workspace (Unguarded)</span>
                </div>
              </div>
              <div class="status-box">
                <div class="status-title">Identity Provider</div>
                <div class="status-val">Unverified</div>
              </div>
              <div class="status-box">
                <div class="status-title">Storage Sync</div>
                <div class="status-val">IndexedDB Active</div>
              </div>
            </div>
          </div>
        </main>

        <auth-modal 
          .open="${this._authModalOpen}" 
          @close="${() => (this._authModalOpen = false)}">
        </auth-modal>
      </div>
    `;
  }
}
