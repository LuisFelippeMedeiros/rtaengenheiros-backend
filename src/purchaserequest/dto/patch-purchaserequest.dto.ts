import { IsString, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { PostPurchaseRequestDto } from './post-purchaserequest.dto';

export class PatchPurchaseRequestDto extends PartialType(
  PostPurchaseRequestDto,
) {
  @IsString()
  comment: string;

  @IsBoolean()
  is_approved: boolean;

  // @IsString()
  // is_approved_gestor?: boolean;

  // @IsString()
  // is_approved_diretor?: boolean;
}
