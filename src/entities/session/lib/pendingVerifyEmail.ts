const KEY = "pending_verify_email";

/**
 * The address waiting for an OTP confirmation, handed from the page that asked
 * for a code to the page that consumes it. Four pages used to agree on this
 * string by hand, which nothing but grep could verify.
 */
export const pendingVerifyEmail = {
  read() {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(KEY) ?? "";
  },
  save(email: string) {
    window.sessionStorage.setItem(KEY, email);
  },
  clear() {
    window.sessionStorage.removeItem(KEY);
  },
};
