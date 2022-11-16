import { PrismaClient, Prisma } from '@prisma/client'
import moment from 'moment'
import * as DTO from '../interfaces/dto/account'
import { AccountRepository } from '../interfaces/repositories/account-repository'

export class AccountRepositoryImpl implements AccountRepository{
    _db: PrismaClient
    constructor(prisma: PrismaClient){
        this._db = prisma
    }

    async getUserByLogin(loginCredentials: DTO.AccountLoginReqDto): Promise<any|null> {
        const account = await this._db.account.findFirst({
            where: { email: loginCredentials.email },
            include: {
                admin: true,
                customer: true,
                vendor: true
            }
        })
        
        return account
    }

    async createCustomerAccount(accountDetails: DTO.CreateCustomerAccountReqDto): Promise<DTO.InsertAccountIntoDBResDto>{
        var response: DTO.InsertAccountIntoDBResDto|undefined = {
            account: undefined,
            message: undefined
        }

        try 
        {
            const result = await this._db.account.create({
                data: {
                    email: accountDetails.email,
                    password_hash: accountDetails.password,
                    role: accountDetails.role,
                    is_loggedin: false,
                    last_loggedin_ip: '1.1.1.1',
                    customer: {
                        create: {
                            first_name: accountDetails.first_name,
                            last_name: accountDetails.last_name,
                            dob: accountDetails.dob
                        }
                    }
                }
            })

            if (result)
            {
                const customer = await this._db.customer.findFirst({
                    where: { accountId: result.accountId }
                })
                
                const result2 = await this._db.cart.create({
                    data: {
                        customerId: customer?.customerId!
                    }
                })
            }

            response.account = result
        }
        catch (e) 
        {
            if (e instanceof Prisma.PrismaClientKnownRequestError)
            {
                switch (e.code) {
                    case 'P2002': //'There is a unique constraint violation
                        response.account = undefined
                        response.message = `An account with the email \'${accountDetails.email}\' exists.`
                        break
                    default:
                        break
                }
            }
            else
            {
                response.account = undefined
                response.message = `Unable to register account for ${accountDetails.email}`
            }
        }

        return response
    }

    async createVendorAccount(params: DTO.CreateVendorAccountReqDto): Promise<any|null> {
        const result = await this._db.account.create({
            data: {
                email: params.email,
                password_hash: params.password,
                role: params.role,
                is_loggedin: false,
                last_loggedin_ip: '1.1.1.1',
                vendor: {
                    create: {
                        store_name: params.store_name!,
                        address_postal: 123456,
                        address_street: "Sesame Street",
                        address_city: "",
                        address_country: "",
                        store_contact_no: 12345678
                    }
                }
            }
        })

        return result
    }

    async getAllAccount(): Promise<any | null> {
        throw new Error('Method not implemented.')
    }
    
    async getAccountById(id: string): Promise<any | null> {
        try
        {
            const result = await this._db.account.findFirst({
                where: { accountId: id },
                include: {
                    admin: true,
                    vendor: true,
                    customer: true
                }
            })
            
            return result
        }
        catch (err)
        {
            return null
        }
    }
    
    async getAccountByEmail(email: string): Promise<any|null> {
        try
        {
            const result = await this._db.account.findFirst({
                where: { email: email },
                include: {
                    admin: true,
                    vendor: true,
                    customer: true
                }
            })
            
            return result
        }
        catch (err)
        {
            return null
        }
    }

    async updateAccount(accountDetails: DTO.CustomerUpdateAccountReqDto): Promise<any | null> {
        const result = await this._db.account.update({
            where: {
                accountId: accountDetails.accountId,
            },
            data: {
                email: accountDetails.email,
                password_hash: accountDetails.password,
                updatedAt: moment().toISOString(),
                customer: {
                    update: {
                        first_name: accountDetails.first_name,
                        last_name: accountDetails.last_name,
                        dob: accountDetails.dob
                    }
                }
            }
        })

        return result
    }

    async addResetPasswordToken(params: DTO.ResetPasswordReqDto): Promise<any|null> {
        const result = await this._db.reset_Password_Tokens.create({
            data: {
                email: params.email!,
                reset_token: params.token!
            }
        })

        return result
    }

    async getResetToken(params: DTO.ResetPasswordReqDto): Promise<any|null> {
        const result = await this._db.reset_Password_Tokens.findFirst({
            where: { email: params.email }
        })

        return result
    }

    async updateNewPassword(params: DTO.ResetPasswordReqDto) : Promise<any|null> {
        const result = await this._db.account.update({
            where: {accountId: params.accountId! },
            data: {
                password_hash: params.password!
            }
        })

        if (result)
        {
            const result2 = await this._db.reset_Password_Tokens.deleteMany({
                where: { email: params.email }
            })
        }

        return result
    }
}