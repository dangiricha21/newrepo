import express from "express";
import { deployToNetlify } from "../services/netlify.ts";

const router = express.Router();

// ✅ POST route for deployment
router.post("/", async (req, res) => {
  try {
   
    const { html, css, js } = req.body;

    // ✅ Basic validation
    if (!html) {
      return res.status(400).json({
        success: false,
        message: "HTML code is required",
      });
    }

    // ✅ Deploy function call
    const url = await deployToNetlify(html, css, js);

    // ✅ Single response
    console.log(url)
    console.log("hii from returning server")
    return res.status(200).json({
      success: true,
      url,
    });

  } catch (err:any) {
    console.error("Deploy Error:", err);

    return res.status(500).json({
      success: false,
      message: "Deployment failed",
      error: err.message, // optional but useful for debugging
    });
  }
});

export default router;