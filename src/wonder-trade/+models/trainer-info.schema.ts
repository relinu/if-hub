import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TrainerInfo {
  @Prop({ required: true })
  nb_badges: number;

  @Prop({ required: true })
  original_trainer_id: string;

  @Prop({ required: true })
  original_trainer_name: string;

  @Prop({ required: true })
  trainer_gender: number;

  @Prop({ required: true })
  trainer_id: string;

  @Prop({ required: true })
  trainer_name: string;
}

export const TrainerInfoSchema = SchemaFactory.createForClass(TrainerInfo);
