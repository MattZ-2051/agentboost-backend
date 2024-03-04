import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { GeneratePropertyDescriptionDto } from './dto/gemini.dto';
import { GeneratePropertyInsightDto } from './dto/gemini.dto';
import { GenerateListingGmcDto } from './dto/gemini.dto';
import {
  generateListingGmc,
  generateListingPropertyInsightPrompt,
  generateListingProperyDescriptionPrompt,
} from './prompts';
import { parseGmcResults } from './utils';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  #apiKey: string;
  genAi: GoogleGenerativeAI;
  constructor(private readonly configService: ConfigService) {
    this.#apiKey = this.configService.get('GOOGLE_GEMINI_API_KEY');
    this.genAi = new GoogleGenerativeAI(this.#apiKey);
  }

  async generateDescriptionForListing({
    address,
    keyInfo,
    zillowInfo,
  }: GeneratePropertyDescriptionDto) {
    const model = this.genAi.getGenerativeModel({ model: 'gemini-1.0-pro' });
    const prompt = generateListingProperyDescriptionPrompt({
      zillowInfo,
      propertyAddress: address,
      keyInfo,
      brandDescription: '',
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }

  // async generatePropertyInsightForListing(dto: GeneratePropertyInsightDto) {
  //   // const configuration = new Configuration({
  //   //   apiKey: this.configService.get<string>('GPT_API_KEY'),
  //   // });
  //   // const openai = new OpenAIApi(configuration);
  //   // const content = generateListingPropertyInsightPrompt(dto);
  //   try {
  //     const response = await openai.createChatCompletion({
  //       model: 'gpt-3.5-turbo',
  //       messages: [{ role: 'user', content }],
  //     });
  //     return response.data;
  //   } catch (err) {
  //     console.log('gpt error', err.response);
  //     throw new HttpException('error with ai', 500);
  //   }
  // }

  async generateGmcForListing(
    dto: GenerateListingGmcDto,
  ): Promise<{ firstCaption: string; otherCaptions: string[] }> {
    const prompt = generateListingGmc({ ...dto });
    const model = this.genAi.getGenerativeModel({ model: 'gemini-1.0-pro' });
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const data = parseGmcResults(text);

      return {
        firstCaption: data.firstCaption,
        otherCaptions: data.otherCaptions,
      };
    } catch (err) {
      console.log('gemini error', err);
      throw new HttpException('error with gemini ai', 500);
    }
  }
}
