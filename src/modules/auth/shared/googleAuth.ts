import { User } from "./../../../entity/User";
import { confirmEmail } from "./../../../routes/confirmEmail";
import { Strategy } from "passport-google-oauth20";
import passport from "passport";
import { Request, Response } from "express";

export const googleAuth = (app: any) => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      async (_, __, profile, cb) => {
        const { id, displayName, emails } = profile;

        let user = await User.findOne({
          where: {
            email: emails![0].value,
          },
        });

        if (!user) {
          user = await User.create({
            email: emails![0].value,
            username: displayName,
            googleId: id,
            confirmed: true,
          }).save();
        } else if (!user.googleId) {
          user.googleId = id;
          await user.save();
        }

        return cb(null, { id: user.id });
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/confirm/:id", confirmEmail);

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req: Request, res: Response) => {
      (req.session as any).userId = (req.user as any).id;
      res.redirect("/graphql");
    }
  );
};
