import { ResetPasswordReqDto, ResetPasswordResDto } from "../../dto/account";
import { GeneralValidationDto } from '../../dto/validation';

export interface ResetPasswordUseCase {
    execute(params: ResetPasswordReqDto): Promise<ResetPasswordResDto | null>;
    validate(params: ResetPasswordReqDto): GeneralValidationDto;
}