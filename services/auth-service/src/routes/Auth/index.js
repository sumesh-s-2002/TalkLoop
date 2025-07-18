import { Router } from "express";
import signupRoute from "./auth.signup.routes.js";
import singinRoute from "./auth.signin.js"
import refreshRoute from "./auth.refresh.route.js"
import logoutRoute from "./auth.logout.route.js"
import verifyEmailRoute from "./auth.verify.email.route.js"
import forgotPasswordRoute from "./auth.forgot.password.route.js"
import verifyPasswordTokenRoute from "./auth.verify.password.token.route.js"
import passwordResetRoute from "../Auth/auth.password.reset.route.js"

const router = Router();

router.use("/auth", signupRoute);
router.use("/auth", singinRoute);
router.use("/auth", refreshRoute);
router.use("/auth", logoutRoute);
router.use("/auth", verifyEmailRoute);
router.use("/auth", forgotPasswordRoute);
router.use("/auth", verifyPasswordTokenRoute);
router.use("/auth", passwordResetRoute);

export default router;