import express from 'express';
import { addDoctor, allDoctor, adminLogin,appointmentAdmin,appointmentCancel ,adminDashboard} from '../controllers/adminController.js';
import { toggleDoctorAvailability } from '../controllers/doctorController.js'; // ✅ named import
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', adminLogin);
adminRouter.get('/all-doctors', authAdmin, allDoctor);
adminRouter.patch('/toggle-availability/:docId', authAdmin, toggleDoctorAvailability);
adminRouter.get('/appointments', authAdmin, appointmentAdmin);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard);

export default adminRouter;
