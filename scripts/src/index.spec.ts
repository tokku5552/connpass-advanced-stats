/* eslint-disable @typescript-eslint/no-explicit-any */
// DOM 環境をシミュレートするためのセットアップ
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window as any;
global.MutationObserver = dom.window.MutationObserver;

// テスト対象の関数をインポート
import {
  createConversionPVElement,
  createConversionUUElement,
  getNumberOnTheScreenByClassName,
} from './index';

describe('connpass stats script', () => {
  beforeEach(() => {
    // 各テスト前にDOMをクリア
    document.body.innerHTML = '';
  });

  describe('createConversionPVElement', () => {
    it('should create PV conversion element with correct structure and styling', () => {
      const value = 12.5;
      const element = createConversionPVElement(value);

      // 要素の構造を確認
      expect(element.tagName).toBe('DIV');
      expect(element.style.color).toBe('rgb(255, 153, 0)');

      const list = element.querySelector('.list.conversions');
      expect(list).toBeTruthy();

      const label = list?.querySelector('p');
      expect(label?.textContent).toBe('CVR(PV)');

      const valueElem = list?.querySelector('.ConversionHero.num');
      expect(valueElem?.textContent).toBe('12.5%');
    });

    it('should handle decimal values correctly', () => {
      const value = 3.7;
      const element = createConversionPVElement(value);
      const valueElem = element.querySelector('.ConversionHero.num');
      expect(valueElem?.textContent).toBe('3.7%');
    });
  });

  describe('createConversionUUElement', () => {
    it('should create UU conversion element with correct structure and styling', () => {
      const value = 8.2;
      const element = createConversionUUElement(value);

      // 要素の構造を確認
      expect(element.tagName).toBe('DIV');
      expect(element.style.color).toBe('rgb(0, 144, 201)');

      const list = element.querySelector('.list.conversions');
      expect(list).toBeTruthy();

      const label = list?.querySelector('p');
      expect(label?.textContent).toBe('CVR(UU)');

      const valueElem = list?.querySelector('.ConversionHero.num');
      expect(valueElem?.textContent).toBe('8.2%');
    });

    it('should handle integer values correctly', () => {
      const value = 15;
      const element = createConversionUUElement(value);
      const valueElem = element.querySelector('.ConversionHero.num');
      expect(valueElem?.textContent).toBe('15%');
    });
  });

  describe('getNumberOnTheScreenByClassName', () => {
    it('should return number from existing element', async () => {
      // テスト用の要素を作成
      const testElement = document.createElement('div');
      testElement.className = 'test-class';
      testElement.textContent = '123';
      document.body.appendChild(testElement);

      const result = await getNumberOnTheScreenByClassName('test-class');
      expect(result).toBe(123);
    });

    it('should handle non-existent element', async () => {
      const result =
        await getNumberOnTheScreenByClassName('non-existent-class');
      expect(result).toBe(0);
    });

    it('should handle whitespace in text content', async () => {
      const testElement = document.createElement('div');
      testElement.className = 'whitespace-class';
      testElement.textContent = '  456  ';
      document.body.appendChild(testElement);

      const result = await getNumberOnTheScreenByClassName('whitespace-class');
      expect(result).toBe(456);
    });
  });
});
