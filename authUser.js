// middleware/authUser.js
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Read token from Authorization header
    if (req.headers.authorization) {
      const authHeader = req.headers.authorization;

      // Accept "Bearer <token>"
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        // Accept raw token also
        token = authHeader;
      }
    }

    // 2️⃣ If still no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided",
      });
    }

    // 3️⃣ Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id || decoded._id;

    next();
  } catch (error) {
    console.log("AUTH ERROR = ", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized action",
    });
  }
};

export default authUser;



// import jwt from "jsonwebtoken";

// const authUser = (req, res, next) => {
//   try {
//     // support both lower/upper header names
//     const authHeader = req.headers.authorization || req.headers.Authorization;
//     if (!authHeader) {
//       return res.status(401).json({ success: false, message: "Not authorized: missing Authorization header" });
//     }

//     // must start with "Bearer "
//     if (!authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ success: false, message: "Not authorized: malformed Authorization header" });
//     }

//     const token = authHeader.split(" ")[1]; // extract token
//     if (!token) {
//       return res.status(401).json({ success: false, message: "Not authorized: token missing" });
//     }

//     // verify token (use your JWT secret)
//     const SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
//     let decoded;
//     try {
//       decoded = jwt.verify(token, SECRET);
//     } catch (err) {
//       console.error("JWT verify failed:", err.message);
//       return res.status(401).json({ success: false, message: "Not authorized: token invalid or expired" });
//     }

//     // store user id (adapt field name to how you signed token)
//     req.userId = decoded.id || decoded._id || decoded.userId;
//     req.user = decoded; // optional: full decoded payload

//     // debug: remove or reduce in production
//     console.log("authUser ok, userId:", req.userId);

//     next();
//   } catch (error) {
//     console.error("authUser middleware unexpected error:", error);
//     return res.status(401).json({ success: false, message: "Not authorized" });
//   }
// };

// export default authUser;




// import jwt from 'jsonwebtoken'

// const authUser = async (req, res, next) => {
//     const authHeader = req.headers.authorization

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ success: false, message: "Not Authorized! Login Again" })
//     }

//     const token = authHeader.split(" ")[1]

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decoded.id
//         next()
//     } catch (error) {
//         return res.status(401).json({ success: false, message: "Not Authorized! Login Again" })
//     }
// }

// export default authUser













// import jwt from 'jsonwebtoken'
// //user authentication middleware
// const authUser = async (req,res,next) => {
//     try {
    
//     const {token} = req.headers
//     if(!token)
//     {
//         return res.json({success:false,message:'Not Authorized Login Again'})
//     }
//     const token_decode = jwt.verify(token,process.env.JWT_SECRET)
//     req.userId = token_decode.id
//     next()

//     } catch(error) {
//         console.log(error)
//       res.json({success:false,message:error.message})
//     }
// }

// export default authUser;