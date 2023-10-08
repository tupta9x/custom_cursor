import { ApiProperty } from "@nestjs/swagger";

export class CreateCursorDto {
    @ApiProperty()
    readonly name: string;
    @ApiProperty()
    readonly cursor: string;
    @ApiProperty()
    readonly pointer: string;
    @ApiProperty()
    readonly category: string;
}
