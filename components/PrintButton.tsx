/**
 * Print Button Component
 * 
 * A reusable button component for triggering print actions
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface PrintButtonProps {
  title: string;
  onPress: () => Promise<void>;
  icon?: keyof typeof MaterialIcons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  title,
  onPress,
  icon = 'print',
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const handlePress = async () => {
    if (!loading && !disabled) {
      try {
        await onPress();
      } catch (error) {
        console.error('Print button error:', error);
      }
    }
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#6366f1',
      borderColor: '#6366f1',
      textColor: '#ffffff',
    },
    secondary: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      textColor: '#ffffff',
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: '#6366f1',
      textColor: '#6366f1',
    },
  };

  const style = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          opacity: disabled || loading ? 0.6 : 1,
        },
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={style.textColor} size="small" />
      ) : (
        <>
          <MaterialIcons name={icon} size={20} color={style.textColor} />
          <Text style={[styles.buttonText, { color: style.textColor }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    minWidth: 120,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
