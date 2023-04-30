import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TradeOffer } from './+models/trade-offer.schema';
import { WonderTradeGateway } from './wonder-trade.gateway';

@Injectable()
export class WonderTradeService {
  constructor(
    @InjectModel(TradeOffer.name) private toModel: Model<TradeOffer>,
    private wtGateway: WonderTradeGateway,
  ) {}

  async trade(myOffer: TradeOffer): Promise<TradeOffer> {
    const alreadyAdded = await this.toModel
      .findOne<TradeOffer>({
        $and: [
          { personal_id: myOffer.personal_id },
          { 'trainer_info.trainer_id': myOffer.trainer_info.trainer_id },
        ],
      })
      .exec();

    if (!alreadyAdded) {
      this.toModel.create(myOffer);
      this.wtGateway.sendNewOffer(myOffer);
    }

    const receivingOffer = await this.toModel
      .findOne<TradeOffer>({
        $and: [
          {
            'trainer_info.trainer_id': { $ne: myOffer.trainer_info.trainer_id },
          },
          {
            'trainer_info.nb_badges': { $lte: myOffer.trainer_info.nb_badges },
          },
        ],
      })
      .exec();

    if (!receivingOffer) {
      throw new HttpException(
        'No trading partner found!',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.toModel.deleteOne(receivingOffer).exec();
    return receivingOffer;
  }
}
