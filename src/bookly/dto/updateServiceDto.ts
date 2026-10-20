import { IsInt, IsOptional, IsString, Matches, MaxLength, Min } from "class-validator";

export class UpdateServiceDto {

    @IsOptional()
    @IsString()
    @MaxLength(40)
    @Matches(/\S/, { message: 'name should not be empty and white spaces' })
    name?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    duration?: number

    @IsOptional()
    @IsInt()
    @Min(1)
    @Matches(/^(?=.*\d)\d{1,8}(\.\d{1,2})?$/, {
        message:
            'price must be a positive decimal string with up to 2 decimal places',
    })
    price?: number

    @IsOptional()
    @IsString()
    description?: string


}