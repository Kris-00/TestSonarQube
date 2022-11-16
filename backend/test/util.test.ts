/*
*   This file contain the unit testing for the 'util.ts' file
*/

import {describe, expect, test } from '@jest/globals';
import * as util from '../src/utils/util';

describe('Utility Module', () => {
    test.each`
    a   |   expected
    ${'email@email.com'} |   ${true}
    ${'email@subdomain.email.com'} |   ${true}
    ${'email 1111@email.com'} |   ${false}
    ${'email!232@email.com'} |   ${true}
    ${'john@123.email.com'} |   ${true}
    `('Check if %s is a valid Email Address', ({ a, expected }) => {
        expect(util.is_valid_email(a as string)).toBe(expected);
    });

    test.each`
    a   |   expected
    ${'P@ssw0rd123'} |   ${true}
    ${'1234567'} |   ${false}
    ${'password'} |   ${false}
    ${'P@ssw0rd'} |   ${false}
    ${'password1234'} |   ${false}
    `('Check if passowrd value is a complex password', ({ a, expected }) => {
        const result = util.is_complex_password(a as string)
        
        expect(result).toBe(expected)
    })

    
});