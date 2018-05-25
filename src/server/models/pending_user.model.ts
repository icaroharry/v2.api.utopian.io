import * as mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
  social_name: { type: String, required: true },
  last_digits_password: { type: String }, // last 4 digits of the last passwords for recovery reasons
  social_id: String,
  social_verified: { type: Boolean, default: false },
  social_email: String,
  social_provider: String,
  email: String,
  phone_number: String,
  has_created_account: { type: Boolean, default: false },
  steem_account: { type: String, default: '' },
  sms_verified: { type: Boolean, default: false },
  sms_verif_tries: { type: Number, default: 0 },
  invite_verified: { type: Boolean, default: false },
  email_verified: { type: Boolean, default: false },
  pending_approval: { type: Boolean, default: false },
  approved: { type: Boolean, default: false },
  approval_verified: { type: Boolean, default: false },
  salt: { type: String },
  privacy: [{
    date: Date,
    ip: String,
  }],
  tos: [{
    date: Date,
    ip: String,
  }],
})

export interface UserSchemaDoc extends mongoose.Document {
}

export interface UserSchemaModel extends mongoose.Model<UserSchemaDoc> {
    get(id: any): any
}

pendingUserSchema.statics = {
  get(social_id) {
    return this.findOne({social_id})
      .exec()
      .then(user => { return user })
  }
};


export default mongoose.model<UserSchemaDoc, UserSchemaModel>('Pending_User', pendingUserSchema);
