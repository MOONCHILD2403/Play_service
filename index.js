const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const HapiAuthJwt2 = require('hapi-auth-jwt2');
require('dotenv').config({ path: '.env' });
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const {handlePostPreference,handleGetPreference,handleSimilarProfiles} = require("./Routes/index");
const base_url = "/api/v1/play";

const init = async () => {

    const server = Hapi.server({
        port: 3002,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], 
                headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'], 
                credentials: true, 
            },
        },
    });

    await server.register(HapiAuthJwt2);

    const validate = async function (decoded, request, h) {
        if (decoded && decoded.email) {
            return { isValid: true };
        } else {
            return { isValid: false };
        }
    };

    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET, 
        validate
    });

    server.auth.default('jwt');

    server.route({
        method: 'POST',
        path: `${base_url}/preferences`,
        handler: handlePostPreference,
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().required(),
                    dob: Joi.date().required(),
                    hobbies: Joi.array()
                        .items(Joi.string())
                        .unique() 
                        .required(),
                    skills: Joi.array()
                        .items(Joi.string())
                        .unique() 
                        .required(),
                    teach: Joi.string().required(),
                    learn: Joi.string().required(),
                })
            }
        }
    });

    server.route({
        method: 'GET',
        path: `${base_url}/preferences`,
        handler: handleGetPreference,
    });

    server.route({
        method: 'POST',
        path: `${base_url}/similar-profiles`,
        handler: handleSimilarProfiles,
        options: {
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                })
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();