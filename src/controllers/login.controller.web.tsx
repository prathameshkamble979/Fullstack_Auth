export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
  redirectTo?: string;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export function validateLoginForm(data: LoginFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const emailError = validateEmail(data.email);
  const passwordError = validatePassword(data.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
}

export function validateRegisterForm(
  data: RegisterFormData,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Full name is required";
  const emailError = validateEmail(data.email);
  const passwordError = validatePassword(data.password);
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (!data.confirmPassword)
    errors.confirmPassword = "Please confirm your password";
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  return errors;
}

// ── Mock User Store ────────────────────────────────────────────
// In production this lives on the server, never in the browser.
const mockUsers: Record<string, RegisterFormData> = {};

export async function handleLogin(data: LoginFormData): Promise<AuthResult> {
  const errors = validateLoginForm(data);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: Object.values(errors)[0] };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const user = mockUsers[data.email];
  if (!user || user.password !== data.password) {
    return { success: false, message: "Invalid email or password. Please check your credentials." };
  }

  return {
    success: true,
    message: "Login successful!",
    redirectTo: "/dashboard",
  };
}

export async function handleRegister(
  data: RegisterFormData,
): Promise<AuthResult> {
  const errors = validateRegisterForm(data);
  if (Object.keys(errors).length > 0) {
    return { success: false, message: Object.values(errors)[0] };
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (mockUsers[data.email]) {
    return { success: false, message: "Email is already registered. Please login instead." };
  }

  // Save to mock database
  mockUsers[data.email] = {
    name: data.name,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword, // Store temporarily to match type
  };

  return {
    success: true,
    message: "Account created successfully! You can now log in.",
    redirectTo: "/dashboard",
  };
}
