import { Router } from "express";
import EnquiryController from "./components/enquiry/EnquiryController";

const router = Router();

const enquiryController = new EnquiryController();
const enquiryRoutes = enquiryController.routes();

router.use("/enquiries", enquiryRoutes);

export default router;
