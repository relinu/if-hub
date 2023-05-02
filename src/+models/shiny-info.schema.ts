import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ShinyInfo {
  @Prop({ required: true })
  body: boolean;

  @Prop({ required: true })
  debug: boolean;

  @Prop({ required: true })
  head: boolean;
}

export const ShinyInfoSchema = SchemaFactory.createForClass(ShinyInfo);
