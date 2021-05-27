const router = require("express").Router();
const passport = require("passport");

router.get("/discord", passport.authenticate("discord"));

router.get("/discord/redirect", passport.authenticate("discord"), (req, res) => {
    // res.redirect("https://Smiley-Face-Dashboard.benjics.repl.co/dashboard");
    // res.redirect("https://smileyface.xyz/dashboard");
    res.redirect("http://localhost:3000/dashboard");
  }
);

router.get("/", (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.status(401).send({ msg: "Unauthorized" });
  }
});

module.exports = router;
