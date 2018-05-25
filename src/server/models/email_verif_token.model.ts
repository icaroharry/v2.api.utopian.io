import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'pending_user' },
  token: { type: String, required: true },
  manual_approval_token: { type: Boolean, required: true, default: false },
  createdAt: { type: Date, required: true, default: Date.now, expires: 43200 } // 12 hours
})

export default mongoose.model('Email_Verif_Token', schema)