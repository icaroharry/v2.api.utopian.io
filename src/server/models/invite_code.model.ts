import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'pending_user' },
  code: { type: String, required: true },
  used: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now }
})

export default mongoose.model('Invite_Code', schema)
