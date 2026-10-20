import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateBooklyDto {
    @IsString()
    @IsNotEmpty()
     name:string

     @IsInt()
     @Min(0)
     duration:number

      @IsInt()
     @Min(0)
     price:number

      @IsOptional()
     @IsString()
     description:string

}
