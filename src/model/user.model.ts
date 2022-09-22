import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from 'config'

export interface UserDocument extends mongoose.Document {
    email: string
    name: string
    password: string
    createdAt: Date
    updatedAt: Date
    comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
)

//pre save function
UserSchema.pre('save', async function (next) {
    let user = this as UserDocument

    //Random additional data
    const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))

    const hash = await bcrypt.hash(user.password, salt)

    //replace the password with the hash
    user.password = hash

    return next()
})

//used for logging in
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    const user = this as UserDocument

    return bcrypt.compare(candidatePassword, user.password).catch(() => false)
}
const User = mongoose.model<UserDocument>('User', UserSchema)

export default User
