import { Router, type IRouter } from "express";
import healthRouter from "./health";
import whisperRouter from "./whisper";

const router: IRouter = Router();

router.use(healthRouter);
router.use(whisperRouter);

export default router;
