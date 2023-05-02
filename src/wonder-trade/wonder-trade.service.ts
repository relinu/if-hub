import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from '../+models/pokemon.schema';
import { WonderTradeGateway } from './wonder-trade.gateway';

@Injectable()
export class WonderTradeService {
  constructor(
    @InjectModel(Pokemon.name) private toModel: Model<Pokemon>,
    private wtGateway: WonderTradeGateway,
  ) {}

  async trade(myOffer: Pokemon): Promise<Pokemon> {
    const alreadyAdded = await this.toModel
      .findOne<Pokemon>({
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
      .findOne<Pokemon>(
        {
          $and: [
            {
              'trainer_info.trainer_id': {
                $ne: myOffer.trainer_info.trainer_id,
              },
            },
            {
              level: { $lte: myOffer.level + 5 },
            },
          ],
        },
        {},
        { sort: { createdAt: 1 } },
      )
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
