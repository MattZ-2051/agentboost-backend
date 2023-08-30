import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { generalListingProperyDescription } from './prompts';
import { GeneratePropertyDescriptionDto } from './dto/listings.dto';

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}
  async generateDescriptionForListing({
    address,
    keyInfo,
    realtyMoleData,
    agentProfile,
  }: GeneratePropertyDescriptionDto) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);
    const content = generalListingProperyDescription({
      realtyMoleData,
      agentProfile,
      propertyAddress: address,
      extra: keyInfo,
    });
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content }],
      });
      return response.data;
    } catch (err) {
      throw new HttpException('error with ai', 500);
    }
  }
}
