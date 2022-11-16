import { GenerateSalesReportReqDto } from '../../dto/report';
import { GeneralValidationDto } from '../../dto/validation';

export interface GenerateSalesReportUseCase {
    execute(params: GenerateSalesReportReqDto): Promise<any | null>;
    validate(params: GenerateSalesReportReqDto): GeneralValidationDto;
}