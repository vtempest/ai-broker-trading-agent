export declare const auth: import('better-auth').Auth<{
    baseURL: string;
    secret: string;
    database: (options: import('better-auth').BetterAuthOptions) => import('better-auth').DBAdapter<import('better-auth').BetterAuthOptions>;
    socialProviders: {
        google: {
            clientId: string;
            clientSecret: string;
        };
    };
    plugins: [{
        id: "siwe";
        schema: {
            walletAddress: {
                fields: {
                    userId: {
                        type: "string";
                        references: {
                            model: string;
                            field: string;
                        };
                        required: true;
                        index: true;
                    };
                    address: {
                        type: "string";
                        required: true;
                    };
                    chainId: {
                        type: "number";
                        required: true;
                    };
                    isPrimary: {
                        type: "boolean";
                        defaultValue: false;
                    };
                    createdAt: {
                        type: "date";
                        required: true;
                    };
                };
            };
        };
        endpoints: {
            getSiweNonce: import('better-auth').StrictEndpoint<"/siwe/nonce", {
                method: "POST";
                body: import('better-auth').ZodObject<{
                    walletAddress: import('better-auth').ZodString;
                    chainId: import('better-auth').ZodDefault<import('better-auth').ZodOptional<import('better-auth').ZodNumber>>;
                }, import('better-auth').$strip>;
            }, {
                nonce: string;
            }>;
            verifySiweMessage: import('better-auth').StrictEndpoint<"/siwe/verify", {
                method: "POST";
                body: import('better-auth').ZodObject<{
                    message: import('better-auth').ZodString;
                    signature: import('better-auth').ZodString;
                    walletAddress: import('better-auth').ZodString;
                    chainId: import('better-auth').ZodDefault<import('better-auth').ZodOptional<import('better-auth').ZodNumber>>;
                    email: import('better-auth').ZodOptional<import('better-auth').ZodEmail>;
                }, import('better-auth').$strip>;
                requireRequest: true;
            }, {
                token: string;
                success: boolean;
                user: {
                    id: string;
                    walletAddress: string;
                    chainId: number;
                };
            }>;
        };
    }];
    emailAndPassword: {
        enabled: true;
        minPasswordLength: number;
    };
    trustedOrigins: string[];
    session: {
        expiresIn: number;
        updateAge: number;
    };
}>;
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
