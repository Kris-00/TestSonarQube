import * as DTO from "../dto/account";

export interface AccountRepository {
    getUserByLogin(loginCredentials: DTO.AccountLoginReqDto): Promise<any|null>;
    createCustomerAccount(accountDetails: DTO.CreateCustomerAccountReqDto): Promise<DTO.InsertAccountIntoDBResDto>;
    createVendorAccount(params: DTO.CreateVendorAccountReqDto): Promise<any|null>;

    getAllAccount(): Promise<any|null>;
    getAccountById(id: string): Promise<any|null>;
    getAccountByEmail(email: string): Promise<any|null>;
    updateAccount(accountDetails: DTO.CustomerUpdateAccountReqDto): Promise<any|null>;
    addResetPasswordToken(params: DTO.ResetPasswordReqDto): Promise<any|null>;
    getResetToken(params: DTO.ResetPasswordReqDto): Promise<any|null>
    updateNewPassword(params: DTO.ResetPasswordReqDto) : Promise<any|null>;
}