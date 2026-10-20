import { IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min, ValidateIf } from "class-validator"

export class SetWorkingHoursDto {
  @IsInt()
  @Min(0)
    @Max(6)
  dayOfWeek: number

  @IsOptional()
    @IsBoolean()
  isClosed?: boolean
  @ValidateIf((dto) => dto.isClosed !== true)
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'openTime must use HH:mm format',
  })
  openTime?: string
  @ValidateIf((dto) => dto.isClosed !== true)
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'closeTime must use HH:mm format',
  })
  closeTime?:string
}
