/**
 * Print Service
 * 
 * Comprehensive print service using expo-print
 * Supports various print options and formats
 */

import * as Print from 'expo-print';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface PrintOptions {
  html?: string;
  uri?: string;
  base64?: string;
  width?: number;
  height?: number;
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

export interface PrintResult {
  uri?: string;
  base64?: string;
  numberOfPages?: number;
}

export class PrintService {
  /**
   * Print HTML content directly to printer
   */
  static async printHTML(html: string, options?: PrintOptions): Promise<void> {
    try {
      await Print.printAsync({
        html,
        ...options,
      });
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
  }

  /**
   * Convert HTML to PDF file
   */
  static async printToFile(
    html: string,
    options?: PrintOptions
  ): Promise<PrintResult> {
    try {
      const result = await Print.printToFileAsync({
        html,
        base64: false,
        ...options,
      });
      return result;
    } catch (error) {
      console.error('Print to file error:', error);
      throw error;
    }
  }

  /**
   * Convert HTML to PDF with base64 encoding
   */
  static async printToFileBase64(
    html: string,
    options?: PrintOptions
  ): Promise<string> {
    try {
      const result = await Print.printToFileAsync({
        html,
        base64: true,
        ...options,
      });
      return result.base64 || '';
    } catch (error) {
      console.error('Print to base64 error:', error);
      throw error;
    }
  }

  /**
   * Print with custom orientation
   */
  static async printWithOrientation(
    html: string,
    orientation: 'portrait' | 'landscape' = 'portrait'
  ): Promise<void> {
    try {
      await Print.printAsync({
        html,
        orientation,
      });
    } catch (error) {
      console.error('Print with orientation error:', error);
      throw error;
    }
  }

  /**
   * Print with custom margins
   */
  static async printWithMargins(
    html: string,
    margins: PrintOptions['margins']
  ): Promise<void> {
    try {
      await Print.printAsync({
        html,
        margins,
      });
    } catch (error) {
      console.error('Print with margins error:', error);
      throw error;
    }
  }

  /**
   * Generate PDF and share it
   */
  static async generateAndSharePDF(
    html: string,
    filename: string = 'document.pdf',
    options?: PrintOptions
  ): Promise<void> {
    try {
      const { uri } = await Print.printToFileAsync({
        html,
        ...options,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        console.log('Sharing not available. PDF saved at:', uri);
      }
    } catch (error) {
      console.error('Generate and share PDF error:', error);
      throw error;
    }
  }

  /**
   * Check if printing is available
   */
  static async isAvailable(): Promise<boolean> {
    try {
      // expo-print doesn't have a direct availability check
      // We'll assume it's available if the module loads
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate HTML template for invoices/receipts
   */
  static generateInvoiceHTML(data: {
    title: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    date?: string;
  }): string {
    const itemsHTML = data.items
      .map(
        (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="text-align: right;">$${(item.quantity * item.price).toFixed(2)}</td>
      </tr>
    `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #6366f1;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #6366f1;
              margin: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
            th {
              background-color: #f8fafc;
              font-weight: bold;
              color: #1e293b;
            }
            .total {
              margin-top: 20px;
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              color: #6366f1;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #64748b;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.title}</h1>
            ${data.date ? `<p>Date: ${data.date}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <div class="total">
            Total: $${data.total.toFixed(2)}
          </div>
          <div class="footer">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate HTML template for reports
   */
  static generateReportHTML(data: {
    title: string;
    content: string;
    author?: string;
    date?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              padding: 40px;
              color: #1e293b;
              line-height: 1.6;
            }
            .header {
              border-bottom: 3px solid #6366f1;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #6366f1;
              margin: 0 0 10px 0;
            }
            .meta {
              color: #64748b;
              font-size: 14px;
            }
            .content {
              margin-top: 30px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              color: #64748b;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${data.title}</h1>
            <div class="meta">
              ${data.author ? `<p>Author: ${data.author}</p>` : ''}
              ${data.date ? `<p>Date: ${data.date}</p>` : ''}
            </div>
          </div>
          <div class="content">
            ${data.content}
          </div>
          <div class="footer">
            <p>Generated using Expo Print</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate HTML template for labels
   */
  static generateLabelHTML(data: {
    title: string;
    address?: string;
    barcode?: string;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${data.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              border: 2px solid #000;
              width: 300px;
              margin: 0 auto;
            }
            .label-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 10px;
              text-align: center;
            }
            .label-address {
              font-size: 14px;
              line-height: 1.4;
              margin-bottom: 10px;
            }
            .barcode {
              text-align: center;
              font-family: monospace;
              font-size: 24px;
              letter-spacing: 2px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="label-title">${data.title}</div>
          ${data.address ? `<div class="label-address">${data.address}</div>` : ''}
          ${data.barcode ? `<div class="barcode">${data.barcode}</div>` : ''}
        </body>
      </html>
    `;
  }
}
