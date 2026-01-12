/**
 * File Service
 * 
 * Service for handling file picking and printing
 */

import * as DocumentPicker from 'expo-document-picker';
import { Platform, Alert, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { PrintService } from './PrintService';

export class FileService {
  /**
   * Request document picker permissions
   */
  static async requestPermissions(): Promise<boolean> {
    // Document picker doesn't require explicit permissions on most platforms
    // But we can check if it's available
    return true;
  }

  /**
   * Pick document/file
   */
  static async pickDocument(): Promise<DocumentPicker.DocumentPickerResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      return result;
    } catch (error) {
      console.error('Document picker error:', error);
      throw error;
    }
  }

  /**
   * Pick PDF file
   */
  static async pickPDF(): Promise<DocumentPicker.DocumentPickerResult> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      return result;
    } catch (error) {
      console.error('PDF picker error:', error);
      throw error;
    }
  }

  /**
   * Read file content as base64
   */
  static async readFileAsBase64(uri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Read file error:', error);
      throw error;
    }
  }

  /**
   * Read file content as string
   */
  static async readFileAsString(uri: string): Promise<string> {
    try {
      const content = await FileSystem.readAsStringAsync(uri);
      return content;
    } catch (error) {
      console.error('Read file error:', error);
      throw error;
    }
  }

  /**
   * Print file (PDF)
   */
  static async printPDF(uri: string): Promise<void> {
    try {
      await PrintService.printHTML(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                margin: 0;
                padding: 0;
              }
              iframe {
                width: 100%;
                height: 100vh;
                border: none;
              }
            </style>
          </head>
          <body>
            <iframe src="${uri}"></iframe>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Print PDF error:', error);
      throw error;
    }
  }

  /**
   * Print text file
   */
  static async printTextFile(uri: string): Promise<void> {
    try {
      const content = await this.readFileAsString(uri);
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Courier New', monospace;
                padding: 20px;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            ${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </body>
        </html>
      `;

      await PrintService.printHTML(html);
    } catch (error) {
      console.error('Print text file error:', error);
      throw error;
    }
  }

  /**
   * Print image file
   */
  static async printImageFile(uri: string): Promise<void> {
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              img {
                max-width: 100%;
                height: auto;
                display: block;
              }
            </style>
          </head>
          <body>
            <img src="${uri}" alt="File Image" />
          </body>
        </html>
      `;

      await PrintService.printHTML(html);
    } catch (error) {
      console.error('Print image file error:', error);
      throw error;
    }
  }
}
