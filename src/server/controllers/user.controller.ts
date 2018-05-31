import * as HttpStatus from 'http-status';
import * as request from 'superagent';
import User from '../models/user.model';
import PendingUser from '../models/pending_user.model'

import * as SteemConnect from 'sc2-sdk'
/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
    const user = req.user;
    return res.json({
        account: user.account,
        banReason: user.banReason,
        bannedBy: user.bannedBy,
        bannedUntil: user.bannedUntil,
        banned: user.banned,
        details: user.details,
        repos: user.repos ? (user.repos) : undefined,
        tos: user.tos,
        privacy: user.privacy,
        reputation: user.reputation,
        influence: user.influence,
        github: user.github ? {
            login: user.github.login,
            account: user.github.account,
            scopeVersion: user.github.scopeVersion,
            lastSynced: (user.github.lastSynced) ? (user.github.lastSynced) : undefined,
            avatar_url: user.github.avatar_url,
        } : undefined
    });
}

async function create(req, res, next) {
    const {code, state, scopeVersion} = req.body;
    if (!(code && state && (code !== "-") && (state !== "-"))) {
        return res.sendStatus(HttpStatus.BAD_REQUEST);
    }

    try {
        const tokenRes = await (request.post('https://github.com/login/oauth/access_token')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                code,
                state,
                client_id: process.env.UTOPIAN_GITHUB_CLIENT_ID,
                client_secret: process.env.UTOPIAN_GITHUB_SECRET,
                redirect_uri: process.env.UTOPIAN_GITHUB_REDIRECT_URL,
            }));
        const access_token = tokenRes.body.access_token;
        if (!access_token) {
            return res.sendStatus(500);
        }

        const githubUserRes = await (request.get('https://api.github.com/user')
            .query({access_token}));
        const githubUser = githubUserRes.body;
        const githubUserName = githubUser.login;
        if (!githubUserName) {
            return res.sendStatus(500);
        }

        const user = res.locals.user;
        user.github = {
            account: githubUserName,
            token: access_token,
            scopeVersion: scopeVersion,
            lastSynced: new Date(),
            ...githubUser,
        };

        req.user = await user.save();
        get(req, res);
    } catch (e) {
        console.log('Error syncing GitHub', e);
        return res.sendStatus(500);
    }
}

async function create_user_from_existing_account(req, res, next) {
    try {
      let { steem_account, user_id, access_token } = req.body
  
      let found_user:any = await PendingUser.findOne({ _id: user_id })
      if(!found_user) return res.status(500).send({message: 'User not found'})
      const sc2 = SteemConnect.Initialize({
        accessToken: access_token,
      });

      const steem_user = await sc2.me();

      let { social_provider, social_name, social_id, social_verified, social_email } = found_user;
  
      let user:any = new User({ account: steem_account, email: social_email, test_net: process.env.REG_TESTNET === 'true' || false})
  
      if(!user.social_data) user.social_data = []
      user.social_data.push({ provider: social_provider, social_name, social_id, social_verified })
  
      user.privacy = found_user.privacy
      user.tos = found_user.tos
      user.connectedToSteem = true
  
      await user.save()
  
      if(user) { res.status(200).send({ message: "Account has been created.", user}) }
      else { res.status(500).json({ message: `We couldn't create your account. Please contact us on discord!`}) }
    } catch (error) {
      res.status(500).json({ message: filter_error_message(error.message)})
    }
}


function filter_error_message(message) {
    if(message === 'No recipients defined') { message = 'You entered an invalid Email'}
    else if(message === '1') { message = 'Unknown Error while trying to send SMS' }
    else if(message === '2'  || message === '7'  || message === '8') { message = 'Temporary Error - please try again!' }
    else if(message === '3' || message === '4' ) { message = 'Invalid Number' }
    else if(message === '5') { message = 'Your number has been declined due to Spam-Rejection' }
    else if(message === '9') { message = 'Illegal Number' }
    else if(message === '15') { message = 'Please contact us on discord with the error code: NM' }
    else if(message.includes('could not insert object, most likely a uniqueness constraint was violated:')) { message = 'Account Name is already getting used. Please go back and choose another one.' }
    else { message = 'We had an internal error. Please try again or contact us on discord!' }
    return message
}

export default {get, create, create_user_from_existing_account};
