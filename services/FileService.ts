/**
 * File Service
 * 
 * Service for handling file picking and printing
 */

import * as DocumentPicker from 'expo-document-picker';
import { Platform, Alert, Linking } from 'react-native';
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
   * Note: Requires expo-file-system if needed
   */
  static async readFileAsBase64(uri: string): Promise<string> {
    try {
      // For now, return empty string as expo-file-system may not be available
      // You can add it back if needed: import * as FileSystem from 'expo-file-system';
      console.warn('readFileAsBase64 requires expo-file-system');
      return '';
    } catch (error) {
      console.error('Read file error:', error);
      throw error;
    }
  }

  /**
   * Read file content as string
   * Note: Requires expo-file-system if needed
   */
  static async readFileAsString(uri: string): Promise<string> {
    try {
      // For now, return empty string as expo-file-system may not be available
      // You can add it back if needed: import * as FileSystem from 'expo-file-system';
      console.warn('readFileAsString requires expo-file-system');
      return '';
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
   * Note: Text file reading requires expo-file-system
   */
  static async printTextFile(uri: string): Promise<void> {
    try {
      // For text files, we'll use an iframe approach since we can't read the content
      // without expo-file-system. Alternatively, you can add expo-file-system back.
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
