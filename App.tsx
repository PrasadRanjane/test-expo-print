/**
 * Expo Snack: Print Component Showcase
 * 
 * Professional showcase of expo-print with various print options:
 * - Direct printing
 * - PDF generation
 * - Custom orientations
 * - Custom margins
 * - Invoice/Receipt templates
 * - Report templates
 * - Label templates
 * - Share PDF functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PrintButton } from './components/PrintButton';
import { PrintService } from './services/PrintService';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState<string | null>(null);

  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    surface: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f1f5f9' : '#1e293b',
    textSecondary: isDark ? '#cbd5e1' : '#64748b',
    primary: '#6366f1',
    primaryLight: '#818cf8',
  };

  const handlePrint = async (action: () => Promise<void>, name: string) => {
    setLoading(name);
    try {
      await action();
      Alert.alert('Success', `${name} completed successfully!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Print failed');
    } finally {
      setLoading(null);
    }
  };

  // Sample HTML content
  const sampleHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          h1 { color: #6366f1; }
          p { line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>Sample Document</h1>
        <p>This is a sample document for printing.</p>
        <p>You can print HTML content directly from your React Native app!</p>
      </body>
    </html>
  `;

  // Invoice data
  const invoiceData = {
    title: 'Invoice #12345',
    date: new Date().toLocaleDateString(),
    items: [
      { name: 'Product A', quantity: 2, price: 29.99 },
      { name: 'Product B', quantity: 1, price: 49.99 },
      { name: 'Product C', quantity: 3, price: 19.99 },
    ],
    total: 169.96,
  };

  // Report data
  const reportData = {
    title: 'Monthly Sales Report',
    author: 'John Doe',
    date: new Date().toLocaleDateString(),
    content: `
      <h2>Executive Summary</h2>
      <p>This report summarizes the monthly sales performance for the current period.</p>
      <h2>Key Metrics</h2>
      <ul>
        <li>Total Sales: $50,000</li>
        <li>Growth Rate: 15%</li>
        <li>Top Product: Product A</li>
      </ul>
      <h2>Conclusion</h2>
      <p>Sales performance has been strong this month with significant growth in key areas.</p>
    `,
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <MaterialIcons name="print" size={48} color="white" />
          <Text style={styles.headerTitle}>Print Component</Text>
          <Text style={styles.headerSubtitle}>
            Professional printing with expo-print
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Print */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="description" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Basic Print
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Print HTML content directly to printer
          </Text>
          <View style={styles.buttonContainer}>
            <PrintButton
              title="Print HTML"
              onPress={() =>
                handlePrint(
                  () => PrintService.printHTML(sampleHTML),
                  'Print HTML'
                )
              }
              loading={loading === 'Print HTML'}
              icon="print"
            />
          </View>
        </View>

        {/* PDF Generation */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="picture-as-pdf" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              PDF Generation
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Convert HTML to PDF file
          </Text>
          <View style={styles.buttonContainer}>
            <PrintButton
              title="Generate PDF"
              onPress={() =>
                handlePrint(
                  () => PrintService.printToFile(sampleHTML),
                  'Generate PDF'
                )
              }
              loading={loading === 'Generate PDF'}
              icon="picture-as-pdf"
              variant="secondary"
            />
            <PrintButton
              title="Share PDF"
              onPress={() =>
                handlePrint(
                  () =>
                    PrintService.generateAndSharePDF(
                      sampleHTML,
                      'document.pdf'
                    ),
                  'Share PDF'
                )
              }
              loading={loading === 'Share PDF'}
              icon="share"
              variant="outline"
            />
          </View>
        </View>

        {/* Orientation Options */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="screen-rotation" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Orientation Options
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Print in portrait or landscape mode
          </Text>
          <View style={styles.buttonContainer}>
            <PrintButton
              title="Portrait"
              onPress={() =>
                handlePrint(
                  () => PrintService.printWithOrientation(sampleHTML, 'portrait'),
                  'Portrait Print'
                )
              }
              loading={loading === 'Portrait Print'}
              icon="portrait"
              variant="outline"
            />
            <PrintButton
              title="Landscape"
              onPress={() =>
                handlePrint(
                  () => PrintService.printWithOrientation(sampleHTML, 'landscape'),
                  'Landscape Print'
                )
              }
              loading={loading === 'Landscape Print'}
              icon="landscape"
              variant="outline"
            />
          </View>
        </View>

        {/* Invoice Template */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="receipt" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Invoice Template
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Professional invoice/receipt template
          </Text>
          <View style={styles.buttonContainer}>
            <PrintButton
              title="Print Invoice"
              onPress={() =>
                handlePrint(
                  () => {
                    const html = PrintService.generateInvoiceHTML(invoiceData);
                    return PrintService.printHTML(html);
                  },
                  'Print Invoice'
                )
              }
              loading={loading === 'Print Invoice'}
              icon="receipt"
              variant="primary"
            />
            <PrintButton
              title="Save Invoice PDF"
              onPress={() =>
                handlePrint(
                  () => {
                    const html = PrintService.generateInvoiceHTML(invoiceData);
                    return PrintService.printToFile(html);
                  },
                  'Save Invoice PDF'
                )
              }
              loading={loading === 'Save Invoice PDF'}
              icon="save"
              variant="secondary"
            />
          </View>
        </View>

        {/* Report Template */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="assessment" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Report Template
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Professional report template with formatting
          </Text>
          <View style={styles.buttonContainer}>
            <PrintButton
              title="Print Report"
              onPress={() =>
                handlePrint(
                  () => {
                    const html = PrintService.generateReportHTML(reportData);
                    return PrintService.printHTML(html);
                  },
                  'Print Report'
                )
              }
              loading={loading === 'Print Report'}
              icon="assessment"
              variant="primary"
            />
            <PrintButton
              title="Share Report"
              onPress={() =>
                handlePrint(
                  () => {
                    const html = PrintService.generateReportHTML(reportData);
                    return PrintService.generateAndSharePDF(html, 'report.pdf');
                  },
                  'Share Report'
                )
              }
              loading={loading === 'Share Report'}
              icon="share"
              variant="outline"
            />
          </View>
        </View>

        {/* Label Template */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="label" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Label Template
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Shipping/shipping label template
          </Text>
          <View style={styles.buttonContainer}>
            <PrintButton
              title="Print Label"
              onPress={() =>
                handlePrint(
                  () => {
                    const html = PrintService.generateLabelHTML({
                      title: 'Shipping Label',
                      address: '123 Main St\nCity, State 12345',
                      barcode: '|| ||| || |||',
                    });
                    return PrintService.printHTML(html);
                  },
                  'Print Label'
                )
              }
              loading={loading === 'Print Label'}
              icon="label"
              variant="primary"
            />
          </View>
        </View>

        {/* Custom Margins */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="margin" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Custom Margins
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Print with custom margin settings
          </Text>
          <View style={styles.buttonContainer}>
            <PrintButton
              title="Print with Margins"
              onPress={() =>
                handlePrint(
                  () =>
                    PrintService.printWithMargins(sampleHTML, {
                      top: 20,
                      bottom: 20,
                      left: 20,
                      right: 20,
                    }),
                  'Print with Margins'
                )
              }
              loading={loading === 'Print with Margins'}
              icon="margin"
              variant="outline"
            />
          </View>
        </View>

        {/* Usage Examples */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="code" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Usage Examples
            </Text>
          </View>
          <View style={[styles.codeBlock, { backgroundColor: colors.background }]}>
            <Text style={[styles.codeText, { color: colors.text }]}>
              {'// Print HTML directly\n'}
              {'PrintService.printHTML(html);\n\n'}
              {'// Generate PDF\n'}
              {'const { uri } = await PrintService.printToFile(html);\n\n'}
              {'// Print with orientation\n'}
              {'PrintService.printWithOrientation(html, "landscape");\n\n'}
              {'// Generate invoice\n'}
              {'const invoiceHTML = PrintService.generateInvoiceHTML(data);'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 32,
  },
  section: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  codeBlock: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
});
