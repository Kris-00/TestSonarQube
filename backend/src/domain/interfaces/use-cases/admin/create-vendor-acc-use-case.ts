import { CreateVendorAccountReqDto, CreateVendorAccountResDto } from "../../dto/account";
import { GeneralValidationDto } from '../../dto/validation';

export interface CreateVendorAccountUseCase {
    execute(params: CreateVendorAccountReqDto): Promise<CreateVendorAccountResDto | null>;
    validate(params: CreateVendorAccountReqDto): GeneralValidationDto;
}