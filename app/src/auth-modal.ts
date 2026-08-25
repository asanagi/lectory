import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from './firebase.js';

@customElement('auth-modal')
export class AuthModal extends LitElement {
  @property({ type: Boolean }) open = false;

  @state() private _mode: 'signin' | 'signup' = 'signin';
  @state() private _email = '';
  @state() private _password = '';
  @state() private _errorMessage = '';
  @state() private _isLoading = false;

  static styles = css`
    :host {
      display: block;
      font-family: inherit;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease-in-out;
    }

    .backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-card {
      background: #131b2e;
      border: 1px solid #1e293b;
      border-radius: 1rem;
      width: 100%;
      max-width: 400px;
      margin: 1rem;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      position: relative;
      transform: scale(0.95);
      transition: transform 0.2s ease-out;
    }

    .backdrop.open .modal-card {
      transform: scale(1);
    }

    .close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem;
      line-height: 1;
    }

    .close-btn:hover {
      color: #ffffff;
    }

    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }

    p.subtitle {
      color: #94a3b8;
      font-size: 0.875rem;
      margin: 0 0 1.5rem 0;
    }

    .google-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      background: #1e293b;
      border: 1px solid #334155;
      color: #f8fafc;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .google-btn:hover {
      background: #334155;
      border-color: #6366f1;
    }

    .google-icon {
      width: 18px;
      height: 18px;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
      color: #64748b;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #1e293b;
    }

    .divider span {
      padding: 0 0.75rem;
    }

    .tabs {
      display: flex;
      border-bottom: 1px solid #1e293b;
      margin-bottom: 1.25rem;
    }

    .tab-btn {
      flex: 1;
      background: transparent;
      border: none;
      padding: 0.6rem;
      color: #94a3b8;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.15s ease;
    }

    .tab-btn.active {
      color: #38bdf8;
      border-bottom-color: #38bdf8;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      font-size: 0.8125rem;
      color: #94a3b8;
      margin-bottom: 0.35rem;
      font-weight: 500;
    }

    input {
      width: 100%;
      background: #090d16;
      border: 1px solid #334155;
      border-radius: 0.5rem;
      padding: 0.65rem 0.75rem;
      color: #ffffff;
      font-size: 0.875rem;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s;
    }

    input:focus {
      border-color: #6366f1;
    }

    .submit-btn {
      width: 100%;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border: none;
      color: #ffffff;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: opacity 0.15s ease;
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-box {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      font-size: 0.8125rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
    }
  `;

  private _close() {
    this.open = false;
    this._errorMessage = '';
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private async _handleGoogleSignIn() {
    this._isLoading = true;
    this._errorMessage = '';
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      this._close();
    } catch (err: any) {
      this._errorMessage = err.message || 'Google sign-in failed.';
    } finally {
      this._isLoading = false;
    }
  }

  private async _handleSubmit(e: Event) {
    e.preventDefault();
    if (!this._email || !this._password) {
      this._errorMessage = 'Please enter both email and password.';
      return;
    }

    this._isLoading = true;
    this._errorMessage = '';

    try {
      if (this._mode === 'signin') {
        await signInWithEmailAndPassword(auth, this._email, this._password);
      } else {
        await createUserWithEmailAndPassword(auth, this._email, this._password);
      }
      this._close();
    } catch (err: any) {
      this._errorMessage = err.message || 'Authentication failed.';
    } finally {
      this._isLoading = false;
    }
  }

  render() {
    return html`
      <div class="backdrop ${this.open ? 'open' : ''}" @click="${(e: MouseEvent) => e.target === e.currentTarget && this._close()}">
        <div class="modal-card">
          <button class="close-btn" @click="${this._close}">✕</button>
          <h2>${this._mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
          <p class="subtitle">Access your cloud workspace and AI courses</p>

          <button class="google-btn" @click="${this._handleGoogleSignIn}" ?disabled="${this._isLoading}">
            <svg class="google-icon" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.54 0 2.9.54 3.98 1.43l2.96-2.96C17.14 1.8 14.77 1 12 1 7.5 1 3.66 3.56 1.77 7.28l3.66 2.84C6.31 7.21 8.91 5 12 5z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"/>
              <path fill="#FBBC05" d="M5.43 14.88c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.77 7.48C.64 9.74 0 12.3 0 15s.64 5.26 1.77 7.52l3.66-2.84z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.09 0-5.69-2.21-6.57-5.12L1.77 16.1C3.66 19.82 7.5 23 12 23z"/>
            </svg>
            Continue with Google
          </button>

          <div class="divider">
            <span>or with email</span>
          </div>

          <div class="tabs">
            <button 
              class="tab-btn ${this._mode === 'signin' ? 'active' : ''}" 
              @click="${() => { this._mode = 'signin'; this._errorMessage = ''; }}">
              Sign In
            </button>
            <button 
              class="tab-btn ${this._mode === 'signup' ? 'active' : ''}" 
              @click="${() => { this._mode = 'signup'; this._errorMessage = ''; }}">
              Create Account
            </button>
          </div>

          ${this._errorMessage ? html`<div class="error-box">${this._errorMessage}</div>` : ''}

          <form @submit="${this._handleSubmit}">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                .value="${this._email}" 
                @input="${(e: any) => this._email = e.target.value}" 
                required 
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                .value="${this._password}" 
                @input="${(e: any) => this._password = e.target.value}" 
                required 
              />
            </div>
            <button class="submit-btn" type="submit" ?disabled="${this._isLoading}">
              ${this._isLoading ? 'Processing...' : (this._mode === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    `;
  }
}
