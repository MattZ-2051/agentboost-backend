import { HttpException, Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import {
  generalListingProperyDescription,
  generateListingGmc,
  generateListingPropertyInsightPrompt,
} from './prompts';
import {
  GenerateListingGmcDto,
  GeneratePropertyDescriptionDto,
  GeneratePropertyInsightDto,
} from './dto/gpt.dto';
import { parseGmcResults } from './utils';

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}
  async generateDescriptionForListing({
    address,
    keyInfo,
    zillowInfo,
  }: GeneratePropertyDescriptionDto) {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);
    const content = generalListingProperyDescription({
      zillowInfo,
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

  async generateGmcForListing(
    dto: GenerateListingGmcDto,
  ): Promise<{ firstCaption: string; otherCaptions: string[] }> {
    const configuration = new Configuration({
      apiKey: this.configService.get<string>('GPT_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);
    const content = generateListingGmc(dto);
    try {
      const response1 = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: content.prompt1 }],
      });

      const response2 = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: content.prompt2 }],
      });

      const res1 = response1.data?.choices?.[0]?.message?.content;
      const res2 = response2.data?.choices?.[0]?.message?.content;

      const returnData = parseGmcResults(res1, res2);

      return returnData;
    } catch (err) {
      console.log('gpt error', err);
      throw new HttpException('error with ai', 500);
    }
  }
}
