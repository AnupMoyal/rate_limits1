
import rate_limiter from "../middlewares/ratelimiter";
import { getData } from "../controllers/datacontroller";

const router =router();

router.get("/data", rate_limiter, getData);

export default router;