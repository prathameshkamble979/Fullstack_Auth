import emailjs from "@emailjs/browser";

// ── EmailJS Config ───────────────────────────────────────────
const SERVICE_ID = "service_ytjt17j";
const TEMPLATE_ID = "template_o9zuo5c";
const PUBLIC_KEY = "z0ySDWBdSIT8_i47V";

// ── Types ────────────────────────────────────────────────────

export interface ForgotPasswordData {
  email: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordResult {
  success: boolean;
  message: string;
}

// ── Mock OTP Store ───────────────────────────────────────────
// In production this lives on the server, never in the browser.
const otpStore: Record<string, string> = {};

// ── Validation ───────────────────────────────────────────────

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
  return null;
}

export function validateOTP(otp: string): string | null {
  if (!otp.trim()) return "OTP is required";
  if (!/^\d{6}$/.test(otp)) return "OTP must be 6 digits";
  return null;
}

export function validateNewPassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
}

// ── Handlers ─────────────────────────────────────────────────

export async function handleForgotPassword(
  data: ForgotPasswordData,
): Promise<ForgotPasswordResult> {
  const emailError = validateEmail(data.email);
  if (emailError) return { success: false, message: emailError };

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[data.email] = otp;

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: data.email,
        otp: otp,
      },
      PUBLIC_KEY,
    );

    return {
      success: true,
      message: "OTP sent! Check your email inbox.",
    };
  } catch (error) {
    console.error("EmailJS error:", error);
    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    };
  }
}

export async function handleVerifyOTP(
  data: VerifyOTPData,
): Promise<ForgotPasswordResult> {
  const otpError = validateOTP(data.otp);
  if (otpError) return { success: false, message: otpError };

  const storedOTP = otpStore[data.email];

  if (!storedOTP) {
    return {
      success: false,
      message: "OTP expired. Please request a new one.",
    };
  }

  if (storedOTP !== data.otp) {
    return { success: false, message: "Incorrect OTP. Please try again." };
  }

  return { success: true, message: "OTP verified successfully." };
}

export async function handleResetPassword(
  data: ResetPasswordData,
): Promise<ForgotPasswordResult> {
  const passwordError = validateNewPassword(data.newPassword);
  if (passwordError) return { success: false, message: passwordError };

  if (data.newPassword !== data.confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  const storedOTP = otpStore[data.email];
  if (!storedOTP || storedOTP !== data.otp) {
    return { success: false, message: "Invalid session. Please start again." };
  }

  // In production: await updatePassword(data.email, data.newPassword)
  delete otpStore[data.email];

  return {
    success: true,
    message: "Password reset successful! Please sign in.",
  };
}
