class OnlineWondertrade
    def pbWonderTrade()
      givenPokemon = selectPokemonToGive
      return if givenPokemon == nil
      queryBody = buildWondertradeQueryJson(givenPokemon)
      begin
      response = HTTPLite.post_body(Settings::WONDERTRADE_BASE_URL + "/wondertrade", queryBody, "application/json")
      if response[:status] == 200
        body = HTTPLite::JSON.parse(response[:body])
        doTrade(body)
      else
        pbMessage("Could not find a trading partner...")
      end
      rescue MKXPError
        pbMessage("There was an error while sending your Pokémon...")
      end
    end
  
    def doTrade(receivedData)
      # Pokemon general info
      receivedPokemonID = receivedData["personal_id"].to_i
      receivedPokemonSpecies = receivedData["pokemon_species"].to_i
      receivedPokemonName = receivedData["nickname"]
      receivedPokemonGender = receivedData["gender"].to_i
      receivedPokemonLevel = receivedData["level"].to_i
      receivedPokemonAbility = receivedData["ability"].to_sym
      receivedPokemonNature = receivedData["nature"].to_sym
  
      # Trainer info
      receivedPokemonOT = receivedData["trainer_info"]["original_trainer_name"]
      receivedPokemonTrainerId = receivedData["trainer_info"]["trainer_id"]
      receivedPokemonTrainerName = receivedData["trainer_info"]["trainer_name"]
      receivedPokemonTrainerGender = receivedData["trainer_info"]["trainer_gender"].to_i
  
      newpoke = pbStartTrade(pbGet(1), receivedPokemonSpecies, receivedPokemonName, receivedPokemonTrainerName, receivedPokemonTrainerGender, false) # Starts the trade
      newpoke.owner=Pokemon::Owner.new(receivedPokemonTrainerId.to_i,receivedPokemonOT,2,2)
      newpoke.personalID = receivedPokemonID;
      newpoke.level=receivedPokemonLevel
  
      # Set pokemon gender, ability and nature
      newpoke.gender = receivedPokemonGender
      newpoke.ability = receivedPokemonAbility
      newpoke.nature = receivedPokemonNature  
  
      # Shiny info
      is_head_shiny = receivedData["shiny"]["head"]
      is_body_shiny = receivedData["shiny"]["body"]
      is_debug_shiny = receivedData["shiny"]["debug"]
      if is_head_shiny || is_body_shiny
        newpoke.shiny = true
        newpoke.head_shiny = is_head_shiny
        newpoke.body_shiny = is_body_shiny
        if is_debug_shiny
          newpoke.debug_shiny = false
          newpoke.natural_shiny = true
        else
          newpoke.debug_shiny = true
          newpoke.natural_shiny = false
        end
      end
  
      # Pokemon stat info
      ivValues = receivedData["ivs"]
      evValues = receivedData["evs"]
      GameData::Stat.each_main { |s| 
        newpoke.setStatIV(s.id, ivValues[s.id.to_s].to_i)
        newpoke.setStatEV(s.id, evValues[s.id.to_s].to_i)
      }
      newpoke.calc_stats
  
      # Pokemon move info
      newpoke.forget_all_moves
      receivedData["moves"].each { |m| newpoke.learn_move(m.to_sym) }
  
      Kernel.Autosave
    end
  
    def selectPokemonToGive
      pbChoosePokemon(1, 2, # Choose eligable pokemon
                      proc {
                        |poke| !poke.egg? && !(poke.isShadow?) # No Eggs, No Shadow Pokemon
                      })
  
      poke = $Trainer.party[pbGet(1)]
      if pbConfirmMessage(_INTL("Trade {1} away?",poke.name))
        return poke
      end
      return nil
    end
  
  
    # @param [Pokemon] givenPokemon
    def buildWondertradeQueryJson(givenPokemon)
      isDebugShiny = givenPokemon.debug_shiny || !givenPokemon.natural_shiny
      postData = {
        # Pokemon general info
        "personal_id" => givenPokemon.personalID.to_s,
        "pokemon_species" => givenPokemon.species_data.id_number,
        "nickname" => givenPokemon.name,
        "gender" => givenPokemon.gender,
        "level" => givenPokemon.level,
        "ability" => givenPokemon.ability_id.to_s,
        "nature" => givenPokemon.nature_id.to_s,
  
        # Shiny info
        "shiny" => {
          "body" => givenPokemon.body_shiny == nil ? false : givenPokemon.body_shiny,
          "head" => givenPokemon.head_shiny == nil ? false : givenPokemon.head_shiny,
          "debug" => isDebugShiny,
        },
  
        # Trainer info
        "trainer_info" => {
          "original_trainer_name" => givenPokemon.owner.name,
          "original_trainer_id" => givenPokemon.owner.id.to_s,
          "trainer_id" => $Trainer.id.to_s,
          "trainer_name" => $Trainer.name,
          "trainer_gender" => $Trainer.gender,
          "nb_badges" => $Trainer.badge_count,
        },
      }
   
      # Pokemon stat info
      postData["ivs"] = {}
      postData["evs"] = {} 
      GameData::Stat.each_main { |s| 
        postData["ivs"][s.id.to_s] = givenPokemon.getStatIV(s.id) 
        postData["evs"][s.id.to_s] = givenPokemon.getStatEV(s.id) 
      }
  
      # Pokemon move info
      postData["moves"] = []
      givenPokemon.moves_ids.each { |m| postData["moves"].push(m.to_s) }
  
      return HTTPLite::JSON.stringify(postData)
    end
  
  end
  