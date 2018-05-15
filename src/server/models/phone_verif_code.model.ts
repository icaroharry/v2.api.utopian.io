import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'pending_user' },
  code: { type: String, required: true },
  phone_number: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 300 } // 5 Minutes
})

export default mongoose.model('Phone_Verif_Code', schema)