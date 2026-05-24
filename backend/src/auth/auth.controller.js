const authService = require('./auth.service');

const COOKIE_OPTIONS = {
  httpOnly: true,       // JS cannot read this cookie — XSS-safe
  secure: process.env.NODE_ENV === 'production', // HTTPS-only in prod
  sameSite: 'lax',     // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
};

class AuthController {
  async signup(req, res, next) {
    try {
      const result = await authService.signup(req.body);

      // Set refresh token as httpOnly cookie — never exposed to JS
      res.cookie('refresh_token', result.refreshToken, COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);

      // Set refresh token as httpOnly cookie — never exposed to JS
      res.cookie('refresh_token', result.refreshToken, COOKIE_OPTIONS);

      res.status(200).json({
        success: true,
        message: 'Login Successful',
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      // Read from httpOnly cookie — body is ignored for security
      const refreshToken = req.cookies?.refresh_token;

      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token missing' });
      }

      const result = await authService.refreshToken(refreshToken);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refresh_token;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear the httpOnly cookie on the client
      res.clearCookie('refresh_token', { path: '/' });
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req, res, next) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      res.status(200).json({
        success: true,
        message: 'Reset token generated',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      await authService.resetPassword(req.params.token, req.body.password);
      res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();