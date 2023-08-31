import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import {
  generalListingProperyDescription,
  generateListingPropertyInsightPrompt,
} from './prompts';
import {
  GeneratePropertyDescriptionDto,
  GeneratePropertyInsightDto,
} from './dto/gpt.dto';

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}
  async generateDescriptionForListing({
    address,
    keyInfo,
    realtyMoleData,
  }: GeneratePropertyDescriptionDto) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);
    const content = generalListingProperyDescription({
      realtyMoleData,
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
      console.log('gpt error', err.response);
      throw new HttpException('error with ai', 500);
    }
  }

  async generatePropertyInsightForListing(dto: GeneratePropertyInsightDto) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);
    const content = generateListingPropertyInsightPrompt(dto);
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content }],
      });
      return response.data;
    } catch (err) {
      console.log('gpt error', err.response);
      throw new HttpException('error with ai', 500);
    }
  }
}
