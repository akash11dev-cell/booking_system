import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Matches, Max, MaxLength, Min } from "class-validator";

export class GetServiceQueryDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    search?: string


    @IsOptional()
    @Matches(/^\d{1,8}(.\d{1,2})?$/, {
        message: 'minPrice must be a valid decimal with up to 2 decimal places',
    })
    minPrice?: string;

    @IsOptional()
    @Matches(/^\d{1,8}(.\d{1,2})?$/, {
        message: 'maxPrice must be a valid decimal with up to 2 decimal places',
    })
    maxPrice?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    cursor?: string

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 10
}