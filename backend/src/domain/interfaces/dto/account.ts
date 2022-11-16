import internal from "stream";

export interface AccountLoginReqDto {
    email: string;
    password: string;
}

export interface AccountLoginResDto {
    statusCode: number|undefined;
    message: string|undefined;
    authCode: number;
    token: string|undefined;
}

export interface CreateCustomerAccountReqDto {
    first_name: string;
    last_name: string;
    dob: string;
    role: number;
    email: string;
    password: string;
}

export interface CreateCustomerAccountResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface InsertAccountIntoDBResDto {
    account: any|undefined,
    message: string|undefined
}

export interface GetSingleAccountReqDto {
    id: number;
}

export interface GetSingleAccountResDto {
    statusCode: number|undefined;
    message: string|undefined;
    accountId: number|undefined;
    email: string|undefined;
    role: number|undefined;
    is_deleted: boolean|undefined;
}

export interface GetSingleCustomerAccountReqDto {
    tokenUserId: string|undefined;
    id: string|undefined;
    email: string|undefined;
}

export interface GetSingleCustomerAccountResDto {
    statusCode: number|undefined;
    message: string|undefined;
    accountId: number|undefined;
    email: string|undefined;
    role: number|undefined;
    is_deleted: boolean|undefined;
    first_name: string|undefined;
    last_name: string|undefined;
    dob: string|undefined;
    updated_at: number|undefined;
}

export interface GetManyAccountResDto {
    statusCode: number|undefined;
    message: string|undefined;
    result: [];
}

export interface CustomerUpdateAccountReqDto {
    updated_at: number|undefined;
    accountId: string|undefined;
    email: string|undefined;
    prev_password: string|undefined;
    password: string|undefined;
    first_name: string|undefined;
    last_name: string|undefined;
    dob: string|undefined;
}

export interface CustomerUpdateAccountResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface UpdateAccountResDto {
    statusCode: number;
    message: string|undefined;
}

export interface ResetPasswordReqDto {
    type: number;
    accountId: string|undefined;
    email: string|undefined;
    token: string|undefined;
    password: string|undefined;
}

export interface ResetPasswordResDto {
    statusCode: number|undefined;
    message: string|undefined;
}

export interface CreateVendorAccountReqDto {
    store_name: string|undefined;
    role: number;
    email: string;
    password: string;
}

export interface CreateVendorAccountResDto {
    statusCode: number|undefined;
    message: string|undefined;
}