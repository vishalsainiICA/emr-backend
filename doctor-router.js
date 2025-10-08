import authRouter from './routes/doctor/auth.js'
import patient from './routes/patient.js'

export const doctorRouter = (app) => {
    app.use('/api/doctor/auth', authRouter)
    app.use('/api/doctor/patient', patient)
}

