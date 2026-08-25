import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from './firebase.js';

@customElement('user-menu')
export class UserMenu extends LitElement {
  @property({ type: String }) userName = 'Guest Developer';
  @property({ type: String }) userRole = 'Pro Tier';
  @property({ type: Boolean }) isSignedIn = false;

  @state() private _isOpen = false;
  @state() private _userEmail = '';
  private _unsubscribeAuth?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        this.isSignedIn = true;
        this.userName = user.displayName || user.email?.split('@')[0] || 'Developer';
        this._userEmail = user.email || '';
        // Synchronize presence cookie across domain
        document.cookie = 'lectory_auth=1; path=/; max-age=2592000; SameSite=Lax';
      } else {
        this.isSignedIn = false;
        this.userName = 'Guest Developer';
        this._userEmail = '';
        // Clear presence cookie
        document.cookie = 'lectory_auth=; path=/; max-age=0; SameSite=Lax';
      }
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsubscribeAuth) {
      this._unsubscribeAuth();
    }
  }

  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      font-family: inherit;
    }

    .avatar-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 9999px;
      padding: 0.35rem 0.75rem 0.35rem 0.35rem;
      color: #f8fafc;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .avatar-btn:hover {
      background: #334155;
      border-color: #6366f1;
    }

    .signin-btn {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border: 1px solid rgba(99, 102, 241, 0.4);
      border-radius: 0.5rem;
      padding: 0.45rem 0.9rem;
      color: #ffffff;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .signin-btn:hover {
      opacity: 0.9;
    }

    .avatar-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: #ffffff;
    }

    .chevron {
      font-size: 0.65rem;
      color: #94a3b8;
      transition: transform 0.2s ease;
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    .dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 220px;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
      padding: 0.75rem;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .user-info {
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #334155;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: #f8fafc;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.75rem;
      color: #38bdf8;
      margin-top: 0.15rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.4rem 0.5rem;
      font-size: 0.8125rem;
      color: #cbd5e1;
      border-radius: 0.375rem;
      background: transparent;
      border: none;
      text-align: left;
      cursor: pointer;
      transition: background 0.15s ease;
      width: 100%;
    }

    .menu-item:hover {
      background: #334155;
      color: #ffffff;
    }

    .menu-item.signout {
      color: #f87171;
    }

    .menu-item.signout:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
    }
  `;

  private _toggleDropdown() {
    this._isOpen = !this._isOpen;
  }

  private _openAuthModal() {
    this.dispatchEvent(new CustomEvent('open-auth-modal', { bubbles: true, composed: true }));
  }

  private async _handleSignOut() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
    this._isOpen = false;
  }

  render() {
    if (!this.isSignedIn) {
      return html`
        <button class="signin-btn" @click="${this._openAuthModal}">
          Sign In
        </button>
      `;
    }

    const initials = this.userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    return html`
      <button class="avatar-btn" @click="${this._toggleDropdown}" aria-expanded="${this._isOpen}">
        <span class="avatar-circle">${initials}</span>
        <span>${this.userName.split(' ')[0]}</span>
        <span class="chevron ${this._isOpen ? 'open' : ''}">▼</span>
      </button>

      ${this._isOpen
        ? html`
            <div class="dropdown">
              <div class="user-info">
                <div class="user-name">${this.userName}</div>
                <div class="user-role">${this._userEmail || this.userRole}</div>
              </div>
              <button class="menu-item">⚙ Workspace Settings</button>
              <button class="menu-item">📚 My Courses</button>
              <button class="menu-item signout" @click="${this._handleSignOut}">↪ Sign Out</button>
            </div>
          `
        : ''}
    `;
  }
}
