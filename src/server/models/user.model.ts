import * as mongoose from 'mongoose';
import * as httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true
  },
  schemaVersion: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  details: {
    type: Object,
    default: {
      recoveryAccount: 'steem',
      connectedToSteem: false,
      lastUpdate: Date.now(),
      votingForWiteness: false,
    }
  },
  email_verified: Boolean,
  sms_verified: Boolean,
  email: String,
  social_data: [{
    provider: String,
    social_name: String,
    social_id: String,
    social_verified: Boolean
  }],
  privacy: [{
    date: Date,
    ip: String,
  }],
  tos: [{
    date: Date,
    ip: String,
  }],
  last_passwords: [], // last 4 digits of the last passwords for recovery reasons
});

UserSchema.index({
  'account': 1
}, {
  unique: true
});

UserSchema.post('init', function(this: any) {
  if (this.banned && this.bannedUntil.getTime() < Date.now()) {
    this.banned = 0;
    this.save().catch(e => {
      console.log('Failed to save removed banned status', e);
    });
  }
});

export interface UserModelListOpts {
  skip?: number;
  limit?: number;
}

export interface UserSchemaDoc extends mongoose.Document {}

export interface UserSchemaModel extends mongoose.Model<UserSchemaDoc> {
  get(account: any): any;
  list(opts?: UserModelListOpts): any;
}

UserSchema.methods = {
  async updateBannedStatus() {
    if (this.banned && new Date(this.bannedUntil).getTime() < Date.now()) {
      this.banned = 0;
      await this.save();
    }
  }
};

UserSchema.statics = {
  get(account) {
    return this.findOne({account})
      .exec()
      .then(user => {
        if (!user) {
          const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
          return Promise.reject(err);
        }
        return user;
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 }: UserModelListOpts = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model<UserSchemaDoc, UserSchemaModel>('User', UserSchema);
