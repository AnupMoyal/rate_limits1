import { getOrCreateAndIncrement } from "../models/ratelimitmodel.js";
const USER_LIMIT =5;
const IP_LIMIT =20;

function getClientIp(req){
    const xff = req.header["x-forwarded-for"];
    if(xff) return xff.split(",")[0].trim();
    let ip =req.ip;
    if(ip?.startswith("::ffff:")) ip= ip.substring(7);
    return ip === "::1" ? "127.0.0.1" : ip ;

}
export default async function rate_limiter(req , res, next){
    try{
        const userId =req.headers["userid"];
        if(!userId)
            return res.status(400).json({error: "missing userId header"});
            const ip = getClientIp(req);
            const now =Math.floor(Date.now()/1000);
            const windowstart =now - (now % 60);

            const userCount = await getOrCreateAndIncrement("user", userId, windowstart);
            if(userCount>USER_LIMIT)
                return res.status(429).json({
            
            error:"Too many Requests",
            message: `User limit exceeded(${USER_LIMIT}/min)`
                });

                const ipCount = await getOrCreateAndIncrement("ip", ip, windowstart);
                if(ipCount>IP_LIMIT)
                    returnres.status(429).json({
                error: "Too Many Requests",
            message: `IP limit exceeded (${IP_LIMIT}/min)`
        });
        next();
        }
        catch(err){
            console.error("Eate Limiter Error:",err);
            return res.status(500).json({error:"internal_server_error"});
        }
    }

    
