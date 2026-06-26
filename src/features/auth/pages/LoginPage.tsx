import { useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { appConfig } from "@/config/env";
import {
  registerAccount,
  requestPasswordReset,
  type RegisterAccountRequest,
} from "@/features/auth/api/authApi";

type AuthMode = "login" | "register" | "forgot" | "otp" | "recover";

interface AuthPageProps {
  mode?: AuthMode;
}

interface AuthFieldProps {
  id: string;
  label: string;
  icon: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
}

type RegisterFormState = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const footerLinks = [
  { label: "Dieu khoan", href: "/pricing" },
  { label: "Bao mat", href: "/pricing" },
  { label: "Lien he", href: "/contact" },
];

const initialRegisterForm: RegisterFormState = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function LoginPage({ mode = "login" }: AuthPageProps) {
  if (mode === "otp" || mode === "recover") {
    return <Navigate to="/forgot-password" replace />;
  }

  if (mode === "register") {
    return <RegisterScreen />;
  }

  if (mode === "forgot") {
    return <ForgotPasswordScreen />;
  }

  return <LoginScreen />;
}

function AuthShell({ children, wide = false, cardClassName = "" }: { children: ReactNode; wide?: boolean; cardClassName?: string }) {
  return (
    <div className="vm-auth-shell">
      <header className="vm-auth-topbar">
        <Link className="vm-auth-brand" to="/pricing">
          <span className="vm-auth-brand-mark">
            <img src="/assets/admin/dist/img/AdminLTELogo.png" alt="CoParking" />
          </span>
          <span>CoParking</span>
        </Link>
        <Link className="vm-auth-help" to="/contact" aria-label="Tro giup">
          <i className="far fa-question-circle" />
        </Link>
      </header>

      <main className="vm-auth-main">
        <section className={`vm-auth-card ${wide ? "vm-auth-card-wide" : ""} ${cardClassName}`}>{children}</section>
      </main>

      <footer className="vm-auth-footer">
        <span>© 2026 Vehicle Management Platform. All rights reserved.</span>
        <nav>
          {footerLinks.map((link) => (
            <Link to={link.href} key={link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}

function AuthHeader({ title, description, compact = false }: { title: string; description?: string; compact?: boolean }) {
  return (
    <div className={`vm-auth-header ${compact ? "vm-auth-header-compact" : ""}`}>
      <div className="vm-auth-logo">
        <img src="/assets/admin/dist/img/AdminLTELogo.png" alt="CoParking" />
      </div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}

function AuthField({ id, label, icon, type = "text", placeholder, autoComplete, value, onChange, children }: AuthFieldProps) {
  return (
    <div className="vm-auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="vm-auth-input-shell">
        <i className={icon} />
        {children ?? (
          <input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
          />
        )}
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "********",
  autoComplete,
}: Pick<AuthFieldProps, "id" | "label" | "placeholder" | "autoComplete" | "value" | "onChange">) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="vm-auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="vm-auth-input-shell">
        <i className="fas fa-lock" />
        <input
          id={id}
          name={id}
          type={isPasswordVisible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
        <button
          className="vm-auth-eye"
          type="button"
          aria-label={isPasswordVisible ? "An mat khau" : "Hien thi mat khau"}
          aria-pressed={isPasswordVisible}
          onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
        >
          <i className={isPasswordVisible ? "far fa-eye-slash" : "far fa-eye"} />
        </button>
      </div>
    </div>
  );
}

function AuthAlert({ tone, message }: { tone: "success" | "error" | "info"; message: string }) {
  const className = tone === "success" ? "vm-auth-note-success" : tone === "error" ? "vm-auth-note-error" : "";

  return (
    <div className={`vm-auth-note ${className}`.trim()}>
      <i className={tone === "success" ? "fas fa-check-circle" : tone === "error" ? "fas fa-exclamation-circle" : "fas fa-info-circle"} />
      <span>{message}</span>
    </div>
  );
}

function LoginScreen() {
  const isLoginConfigured = appConfig.keycloakLoginUrl.trim().length > 0;

  function handleLoginRedirect() {
    if (!isLoginConfigured) {
      return;
    }

    window.location.assign(appConfig.keycloakLoginUrl);
  }

  return (
    <AuthShell>
      <AuthHeader
        title="Dang nhap an toan"
        description="Dang nhap duoc xu ly boi Keycloak de giu chuan OAuth2/OIDC, MFA va session trung tam."
      />

      <div className="vm-auth-form">
        <AuthAlert
          tone="info"
          message="Tai khoan nhan vien va khach hang se duoc xac thuc tren trang dang nhap Keycloak da custom theme."
        />

        <button className="vm-auth-submit" type="button" onClick={handleLoginRedirect} disabled={!isLoginConfigured}>
          Dang nhap voi Keycloak
        </button>

        {!isLoginConfigured && (
          <AuthAlert
            tone="error"
            message="Chua cau hinh VITE_KEYCLOAK_LOGIN_URL. Hay cap nhat env de frontend redirect dung toi trang login Keycloak."
          />
        )}

        <div className="vm-auth-options">
          <span>Can tao tai khoan moi hoac yeu cau dat lai mat khau?</span>
          <Link to="/forgot-password">Quen mat khau?</Link>
        </div>
      </div>

      <AuthSwitch text="Chua co tai khoan?" label="Dang ky" href="/register" />
    </AuthShell>
  );
}

function RegisterScreen() {
  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function updateField<Key extends keyof RegisterFormState>(field: Key, value: RegisterFormState[Key]) {
    setForm((currentValue) => ({ ...currentValue, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Mat khau xac nhan khong khop.");
      return;
    }

    setIsSubmitting(true);

    const payload: RegisterAccountRequest = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    try {
      const response = await registerAccount(payload);
      setSuccessMessage(response.message);
      setForm(initialRegisterForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Khong the tao tai khoan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <AuthHeader
        title="Tao tai khoan moi"
        description="Dang ky tai khoan chi voi username, email va password. Ho so noi bo se duoc tao toi thieu va co the bo sung sau."
      />

      <form className="vm-auth-form" onSubmit={handleSubmit}>
        {successMessage && <AuthAlert tone="success" message={successMessage} />}
        {errorMessage && <AuthAlert tone="error" message={errorMessage} />}

        <AuthField
          id="registerUsername"
          label="Ten dang nhap"
          icon="fas fa-user"
          placeholder="vovantu"
          autoComplete="username"
          value={form.username}
          onChange={(value) => updateField("username", value)}
        />
        <AuthField
          id="email"
          label="Email"
          icon="far fa-envelope"
          type="email"
          placeholder="customer@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(value) => updateField("email", value)}
        />
        <PasswordField
          id="registerPassword"
          label="Mat khau"
          autoComplete="new-password"
          value={form.password}
          onChange={(value) => updateField("password", value)}
        />
        <PasswordField
          id="confirmPassword"
          label="Xac nhan mat khau"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(value) => updateField("confirmPassword", value)}
        />

        <div className="vm-auth-note">
          <i className="fas fa-shield-alt" />
          <span>Sau khi tao tai khoan, he thong se gui email verification va tai khoan noi bo se o trang thai PENDING.</span>
        </div>

        <button className="vm-auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Dang tao tai khoan..." : "Tao tai khoan va gui email xac minh"}
          <i className="fas fa-arrow-right" />
        </button>
      </form>

      <AuthSwitch text="Da co tai khoan?" label="Dang nhap" href="/login" />
    </AuthShell>
  );
}

function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await requestPasswordReset({ email });
      setSuccessMessage(response.message);
      setEmail("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Khong the gui yeu cau dat lai mat khau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell cardClassName="vm-auth-card-reset">
      <AuthHeader
        title="Quen mat khau?"
        description="Nhap email da dang ky. Backend se yeu cau Keycloak gui email reset password den ban."
      />

      <form className="vm-auth-form" onSubmit={handleSubmit}>
        {successMessage && <AuthAlert tone="success" message={successMessage} />}
        {errorMessage && <AuthAlert tone="error" message={errorMessage} />}

        <AuthField
          id="forgotEmail"
          label="Email"
          icon="far fa-envelope"
          type="email"
          placeholder="customer@example.com"
          autoComplete="email"
          value={email}
          onChange={setEmail}
        />

        <p className="vm-auth-field-note">
          Link trong email se dua ban toi themed page cua Keycloak de dat lai mat khau mot cach an toan.
        </p>

        <button className="vm-auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Dang gui yeu cau..." : "Gui email dat lai mat khau"}
        </button>
      </form>

      <AuthBackLink />
    </AuthShell>
  );
}

function AuthSwitch({ text, label, href }: { text: string; label: string; href: string }) {
  return (
    <div className="vm-auth-switch">
      <span>{text}</span>
      <Link to={href}>{label}</Link>
    </div>
  );
}

function AuthBackLink() {
  return (
    <div className="vm-auth-back">
      <Link to="/login">
        <i className="fas fa-arrow-left" />
        Quay lai dang nhap
      </Link>
    </div>
  );
}
