import { signupSchema, otpRequestSchema } from "../schemas/zod-schemas";
import prisma from "../libs/prisma";
import { generateNumericOtp, createOtp } from "../libs/otp";
import { Elysia } from "elysia";

const users = new Elysia({ prefix: "/user" })
  .post("/sign-in", "Sign in")
  .post("/sign-up", "Sign up")
  .post("/profile", "Profile");

export default (app: Elysia) => {
  // Group routes under /auth
  app.group("/auth", (group) => {
    // Email/password signup
    group.post("/signup", async (c) => {
      const body = signupSchema.parse(await c.body());
      if (!body.email || !body.password)
        return c.error("email+password required", { status: 400 });
      const exist = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (exist) return c.error("User exists", { status: 409 });
      const hash = await bcrypt.hash(body.password!, 10);
      const user = await prisma.user.create({
        data: { email: body.email, passwordHash: hash },
      });
      const token = signAccess({ id: user.id });
      return { user: { id: user.id, email: user.email }, token };
    });

    // Request OTP (email) for signup/login
    group.post("/otp/request", async (c) => {
      const body = otpRequestSchema.parse(await c.body());
      if (!body.email) return c.error("email required", { status: 400 });
      const code = generateNumericOtp(6);
      // createOtp should use prisma.otp in real code
      await createOtp({ code, purpose: "login", minutes: 10 });
      await sendEmail(body.email, "Your OTP", `Your code is ${code}`);
      return { ok: true };
    });

    // Verify OTP
    group.post("/otp/verify", async (c) => {
      const { email, code } = await c.body();
      if (!email || !code)
        return c.error("email+code required", { status: 400 });
      const user = await prisma.user.findUnique({ where: { email } });
      // find Otp model, verify expiry and code. If user doesn't exist, create (signup flow)
      // then sign token and return.
      return { ok: true };
    });

    // Forgot password: generate reset token and email link
    group.post("/forgot", async (c) => {
      const { email } = await c.body();
      if (!email) return c.error("email required", { status: 400 });
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return { ok: true }; // avoid leaking existence
      const token = Math.random().toString(36).slice(2);
      await prisma.resetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      });
      await sendEmail(email, "Reset your password", `Use token: ${token}`);
      return { ok: true };
    });

    // Reset password endpoint: validate token and change password
    group.post("/reset", async (c) => {
      const { token, newPassword } = await c.body();
      if (!token || !newPassword)
        return c.error("token+newPassword required", { status: 400 });
      const rt = await prisma.resetToken.findUnique({ where: { token } });
      if (!rt || rt.used || rt.expiresAt < new Date())
        return c.error("Invalid token", { status: 400 });
      await prisma.user.update({
        where: { id: rt.userId },
        data: { passwordHash: await bcrypt.hash(newPassword, 10) },
      });
      await prisma.resetToken.update({
        where: { id: rt.id },
        data: { used: true },
      });
      return { ok: true };
    });
  });
};
