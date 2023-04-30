import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ShinyInfo, ShinyInfoSchema } from './shiny-info.schema';
import { TrainerInfo, TrainerInfoSchema } from './trainer-info.schema';

@Schema({ timestamps: true })
export class TradeOffer {
  @Prop({ required: true })
  personal_id: string;

  @Prop({ required: true })
  pokemon_species: number;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  gender: number;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  ability: string;

  @Prop({ required: true })
  nature: string;

  @Prop({ type: ShinyInfoSchema, required: true })
  shiny: ShinyInfo;

  @Prop({ type: TrainerInfoSchema, required: true })
  trainer_info: TrainerInfo;

  @Prop({ type: MongooseSchema.Types.Map, of: Number, required: true })
  ivs: Map<string, number>;

  @Prop({ type: MongooseSchema.Types.Map, of: Number, required: true })
  evs: Map<string, number>;

  @Prop({ type: [String], required: true })
  moves: string[];
}

export const TradeOfferSchema = SchemaFactory.createForClass(TradeOffer);
TradeOfferSchema.index(
  { personal_id: 1, 'trainer_info.trainer_id': 1 },
  { unique: true },
);
TradeOfferSchema.index({ level: 1 });
