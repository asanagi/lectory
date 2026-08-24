import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import './app-header.js';

@customElement('app-shell')
export class AppShell extends LitElement {
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

    .hero-card {
      background: #131b2e;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }

    .hero-card::before {
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

    p {
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

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }

    .cta-btn {
      margin-top: 1.75rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #4f46e5;
      color: #ffffff;
      border: none;
      border-radius: 0.5rem;
      padding: 0.75rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .cta-btn:hover {
      background: #4338ca;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Register Service Worker for PWA installability
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.warn('Service Worker registration failed:', err));
    }
  }

  render() {
    return html`
      <app-header></app-header>
      <main>
        <div class="hero-card">
          <span class="tag">BARE-BONE APP SHELL</span>
          <h1>Welcome to Lectory Studio</h1>
          <p>
            Your AI-native learning workspace is initialized with native Lit Web Components,
            Shadow DOM style encapsulation, and PWA desktop installability.
          </p>

          <div class="status-grid">
            <div class="status-box">
              <div class="status-title">Runtime Engine</div>
              <div class="status-val"><span class="dot"></span> Lit + TypeScript</div>
            </div>
            <div class="status-box">
              <div class="status-title">Auth Integration</div>
              <div class="status-val" style="color: #cbd5e1;">Unwired (Queued for 2.7)</div>
            </div>
            <div class="status-box">
              <div class="status-title">PWA Support</div>
              <div class="status-val"><span class="dot"></span> Active & Installable</div>
            </div>
          </div>

          <button class="cta-btn" @click="${() => alert('Workspace initialized!')}">
            🚀 Launch Workspace
          </button>
        </div>
      </main>
    `;
  }
}
