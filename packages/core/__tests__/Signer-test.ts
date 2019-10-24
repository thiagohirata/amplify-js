jest.mock('url', () => {
    return {
        parse() {
            return {
                host: 'host'
            }
        }
    }
});

jest.mock('../src/Facet', () => {
    let ret = {util:{crypto:{lib:{}}, date:{}}};
    ret['util']['crypto']['lib']['createHmac'] = () => {
        const update = () => {
            return { 
                digest() {
                    return 'encrypt'
                } 
            }};
        return { update };
    }
    ret['util']['crypto']['createHash'] = () => {
        const update = () => {
            return { 
                digest() {
                    return 'hash'
                } 
            }};
        return { update };
    }
    ret['util']['date']['getDate'] = () => new Date()
    return {
        AWS: ret
    }; 
});

import Signer from '../src/Signer';
import { AWS }  from '../src/Facet';


describe('Signer test', () => {
    describe('sign test', () => {
        test('happy case', () => {
            const request = {
                headers: {}
            }
            const access_info = {
                session_token: 'session_token'
            }
        
            const spyon = jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce('0');
            const getDateSpy = jest.spyOn(AWS['util']['date'], 'getDate')

            const res = {"headers": {
                "Authorization": "AWS4-HMAC-SHA256 Credential=undefined/0///aws4_request, SignedHeaders=host;x-amz-date;x-amz-security-token, Signature=encrypt", 
                "X-Amz-Security-Token": "session_token", 
                "host": "host", 
                "x-amz-date": "0"}}
            expect(Signer.sign(request, access_info)).toEqual(res);
            expect(getDateSpy).toHaveBeenCalledTimes(1)

            spyon.mockClear();
        });
    });

});
