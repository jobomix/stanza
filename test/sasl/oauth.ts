import * as SASL from '../../src/lib/sasl';

test('SASL - OAUTH', () => {
    const factory = new SASL.Factory();
    factory.register('OAUTHBEARER', SASL.OAUTH, 10);

    const mech = factory.createMechanism(['OAUTHBEARER'])!;

    expect(mech.name).toBe('OAUTHBEARER');
    expect(mech.providesMutualAuthentication).toBeFalsy();

    const neededCreds = mech.getExpectedCredentials();
    expect(neededCreds).toStrictEqual({
        optional: [],
        required: ['token']
    });

    const creds: SASL.Credentials = {
        token: 'bearer-token'
    };

    const response = mech.createResponse(creds)!;
    expect(response.toString('utf8')).toBe('bearer-token');

    mech.processSuccess();

    const result = mech.finalize(creds);
    expect(result).toStrictEqual({
        authenticated: true,
        mutuallyAuthenticated: false
    });

    const cacheable = mech.getCacheableCredentials()!;
    expect(cacheable).toBeNull();
});