/**
 * Expo Snack: Test Expo Print
 * 
 * Complete print showcase with:
 * - HTML printing
 * - PDF generation
 * - Image picker and printing
 * - File picker and printing
 * - Permission handling
 * - Modern card-based design
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PrintService } from './services/PrintService';
import { ImageService } from './services/ImageService';
import { FileService } from './services/FileService';

export default function App() {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string } | null>(null);

  const handleAction = async (
    action: () => Promise<void>,
    name: string
  ) => {
    setLoading(name);
    try {
      await action();
      Alert.alert('Success', `${name} completed successfully!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || `${name} failed`);
    } finally {
      setLoading(null);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImageService.pickImageFromGallery();
      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImageService.takePhoto();
      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to take photo');
    }
  };

  const handlePickFile = async () => {
    try {
      const result = await FileService.pickDocument();
      if (!result.canceled && result.assets && result.assets[0]) {
        setSelectedFile({
          name: result.assets[0].name || 'Unknown',
          uri: result.assets[0].uri,
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to pick file');
    }
  };

  const ActionCard = ({
    icon,
    title,
    description,
    onPress,
    loading: cardLoading,
    variant = 'primary',
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    description: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
  }) => {
    const variantColors = {
      primary: { bg: '#3b82f6', light: '#dbeafe' },
      secondary: { bg: '#8b5cf6', light: '#ede9fe' },
      success: { bg: '#10b981', light: '#d1fae5' },
      warning: { bg: '#f59e0b', light: '#fef3c7' },
    };

    const colors = variantColors[variant];

    return (
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: colors.bg }]}
        onPress={onPress}
        disabled={cardLoading}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.light }]}>
          {cardLoading ? (
            <ActivityIndicator color={colors.bg} size="small" />
          ) : (
            <MaterialIcons name={icon} size={28} color={colors.bg} />
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  const sampleHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 40px;
            color: #1f2937;
            line-height: 1.6;
          }
          h1 {
            color: #3b82f6;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
          }
          p { margin: 15px 0; }
        </style>
      </head>
      <body>
        <h1>Sample Document</h1>
        <p>This is a sample document for printing.</p>
        <p>You can print HTML content directly from your React Native app!</p>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="print" size={32} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Test Expo Print</Text>
            <Text style={styles.headerSubtitle}>Print anything, anywhere</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Picker Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Image Printing</Text>
          <Text style={styles.sectionDescription}>
            Pick an image from gallery or take a photo, then print it
          </Text>

          {selectedImage && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setSelectedImage(null)}
              >
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.galleryButton]}
              onPress={handlePickImage}
            >
              <MaterialIcons name="photo-library" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cameraButton]}
              onPress={handleTakePhoto}
            >
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <ActionCard
              icon="print"
              title="Print Image"
              description="Print the selected image"
              onPress={() =>
                handleAction(
                  () => ImageService.printImage(selectedImage),
                  'Print Image'
                )
              }
              loading={loading === 'Print Image'}
              variant="primary"
            />
          )}
        </View>

        {/* File Picker Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 File Printing</Text>
          <Text style={styles.sectionDescription}>
            Pick a file (PDF, image, text) and print it
          </Text>

          {selectedFile && (
            <View style={styles.fileInfo}>
              <MaterialIcons name="description" size={24} color="#3b82f6" />
              <View style={styles.fileInfoText}>
                <Text style={styles.fileName}>{selectedFile.name}</Text>
                <Text style={styles.fileUri} numberOfLines={1}>
                  {selectedFile.uri}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedFile(null)}>
                <MaterialIcons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.filePickerButton}
            onPress={handlePickFile}
          >
            <MaterialIcons name="folder-open" size={24} color="#3b82f6" />
            <Text style={styles.filePickerText}>Pick File</Text>
          </TouchableOpacity>

          {selectedFile && (
            <>
              <ActionCard
                icon="picture-as-pdf"
                title="Print PDF"
                description="Print PDF file"
                onPress={() =>
                  handleAction(
                    () => FileService.printPDF(selectedFile.uri),
                    'Print PDF'
                  )
                }
                loading={loading === 'Print PDF'}
                variant="secondary"
              />
              <ActionCard
                icon="image"
                title="Print Image File"
                description="Print image file"
                onPress={() =>
                  handleAction(
                    () => FileService.printImageFile(selectedFile.uri),
                    'Print Image File'
                  )
                }
                loading={loading === 'Print Image File'}
                variant="success"
              />
              <ActionCard
                icon="text-fields"
                title="Print Text File"
                description="Print text file"
                onPress={() =>
                  handleAction(
                    () => FileService.printTextFile(selectedFile.uri),
                    'Print Text File'
                  )
                }
                loading={loading === 'Print Text File'}
                variant="warning"
              />
            </>
          )}
        </View>

        {/* HTML Printing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 HTML Printing</Text>
          <Text style={styles.sectionDescription}>
            Print HTML content directly or convert to PDF
          </Text>

          <ActionCard
            icon="code"
            title="Print HTML"
            description="Print HTML content directly"
            onPress={() =>
              handleAction(
                () => PrintService.printHTML(sampleHTML),
                'Print HTML'
              )
            }
            loading={loading === 'Print HTML'}
            variant="primary"
          />

          <ActionCard
            icon="picture-as-pdf"
            title="Generate PDF"
            description="Convert HTML to PDF file"
            onPress={() =>
              handleAction(
                () => PrintService.printToFile(sampleHTML),
                'Generate PDF'
              )
            }
            loading={loading === 'Generate PDF'}
            variant="secondary"
          />
        </View>

        {/* Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Templates</Text>
          <Text style={styles.sectionDescription}>
            Pre-built templates for invoices, reports, and labels
          </Text>

          <ActionCard
            icon="receipt"
            title="Invoice Template"
            description="Print professional invoice"
            onPress={() =>
              handleAction(
                () => {
                  const html = PrintService.generateInvoiceHTML({
                    title: 'Invoice #12345',
                    date: new Date().toLocaleDateString(),
                    items: [
                      { name: 'Product A', quantity: 2, price: 29.99 },
                      { name: 'Product B', quantity: 1, price: 49.99 },
                    ],
                    total: 109.97,
                  });
                  return PrintService.printHTML(html);
                },
                'Print Invoice'
              )
            }
            loading={loading === 'Print Invoice'}
            variant="success"
          />

          <ActionCard
            icon="assessment"
            title="Report Template"
            description="Print formatted report"
            onPress={() =>
              handleAction(
                () => {
                  const html = PrintService.generateReportHTML({
                    title: 'Monthly Report',
                    author: 'John Doe',
                    date: new Date().toLocaleDateString(),
                    content: '<h2>Summary</h2><p>Report content here...</p>',
                  });
                  return PrintService.printHTML(html);
                },
                'Print Report'
              )
            }
            loading={loading === 'Print Report'}
            variant="warning"
          />
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Print Options</Text>
          <Text style={styles.sectionDescription}>
            Customize print settings
          </Text>

          <ActionCard
            icon="portrait"
            title="Portrait Mode"
            description="Print in portrait orientation"
            onPress={() =>
              handleAction(
                () => PrintService.printWithOrientation(sampleHTML, 'portrait'),
                'Portrait Print'
              )
            }
            loading={loading === 'Portrait Print'}
            variant="primary"
          />

          <ActionCard
            icon="landscape"
            title="Landscape Mode"
            description="Print in landscape orientation"
            onPress={() =>
              handleAction(
                () => PrintService.printWithOrientation(sampleHTML, 'landscape'),
                'Landscape Print'
              )
            }
            loading={loading === 'Landscape Print'}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#1f2937',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    padding: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  galleryButton: {
    backgroundColor: '#3b82f6',
  },
  cameraButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  fileInfoText: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  fileUri: {
    fontSize: 12,
    color: '#6b7280',
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    gap: 8,
  },
  filePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
