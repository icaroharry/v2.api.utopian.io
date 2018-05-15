import * as HttpStatus from 'http-status';
import * as request from 'superagent';
import User from '../models/user.model';
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

function list(req, res) {
    return res.json({
        hello: "hello"
    });
}

export default {get, create, list};
