# api.utopian.io
This is the **node API for Utopian.io**, built in TypeScript.
Utopian wants to reward Open Source contributors for their hard work.

## Contributing
Get in touch on Discord: https://discord.gg/h52nFrV

### Run a MongoDB Instance
Create a database named utopian-io

### Clone and Install
`git clone https://github.com/utopian-io/v2.api.utopian.io api.utopian.io`

`cd api.utopian.io`

`npm install`

### Create .env file
NODE_ENV=production
SERVER_SSL_CERT=[path to certificate]
SERVER_SSL_KEY=[path to key]

MONGO_HOST=mongodb://localhost/utopian-io
SERVER_PORT=443

ROOT_PATH=https://signup.utopian.io
API_PATH=https://api.utopian.io

UTOPIAN_SOCIAL_GITHUB_SECRET=[github secret]
UTOPIAN_SOCIAL_GITHUB_CLIENT_ID=[github client id]
UTOPIAN_SOCIAL_FACEBOOK_SECRET=
UTOPIAN_SOCIAL_FACEBOOK_CLIENT_ID=
UTOPIAN_SOCIAL_LINKEDIN_SECRET=
UTOPIAN_SOCIAL_LINKEDIN_CLIENT_ID=

UTOPIAN_MAIL_ACCOUNT=[account for sending verification emails]
GOOGLE_MAIL_ACCOUNT=[account for sending verification emails]
GOOGLE_MAIL_PASSWORD=[password account for sending verification emails]

NEXMO_API_KEY=[api key]
NEXMO_API_SECRET=[api secret]

ACCOUNT_CREATOR=[account used for creating accounts]
ACCOUNT_CREATOR_ACTIVE_KEY=[private active key for creating account]

ACCOUNT_CREATOR_TEST=[account used for creating accounts on the testnet]
ACCOUNT_CREATOR_PASSWORD_TEST=[password used for creating accounts on the testnet]
ACCOUNT_CREATOR_ACTIVE_KEY_TEST=[active key used for creating accounts on the testnet]

DECRYPT_KEY=[key for decrypting stored data]

REGISTRATION_FRONTEND_PORT=9090
REG_TESTNET=false


### Generate and Export SSL Certificates
`export NODE_TLS_REJECT_UNAUTHORIZED=0`

`openssl req -x509 -sha512 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes`

`export SERVER_SSL_CERT="/path/cert.pem"`

`export SERVER_SSL_KEY="/path/key.pem"`

Replace path with the path to the generated .pem files.
You may need to authorise your browser in using a self-signed SSL certificate

### Run The Backend
`npm run build`

`npm run dev-server`

`npm run start`

## License
MIT. Copyright Utopian.io
