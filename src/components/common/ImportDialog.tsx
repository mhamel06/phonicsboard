/**
 * ImportDialog — modal for importing a deck or playlist from a share code.
 *
 * Shows a text input for the 6-character share code, an Import button,
 * and loading/success/error states.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { APP_COLORS } from '@/utils/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImportDialogProps {
  /** Whether the dialog is visible */
  visible: boolean;
  /** Called when the user closes the dialog */
  onClose: () => void;
  /** Called with the entered code when the user taps Import */
  onImport: (code: string) => void;
}

type ImportStatus = 'idle' | 'loading' | 'success' | 'error';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ImportDialog({
  visible,
  onClose,
  onImport,
}: ImportDialogProps) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleImport = async () => {
    const trimmed = code.trim().toUpperCase();

    if (trimmed.length !== 6) {
      setStatus('error');
      setErrorMessage('Share codes are 6 characters long.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      onImport(trimmed);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Could not import. Please check the code and try again.');
    }
  };

  const handleClose = () => {
    setCode('');
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  const isDisabled = status === 'loading' || code.trim().length === 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Import from Code</Text>
            <Pressable
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
            >
              <Feather name="x" size={22} color={APP_COLORS.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.description}>
            Enter the 6-character share code to import a deck or playlist.
          </Text>

          {/* Code input */}
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={(text) => {
              setCode(text.toUpperCase().slice(0, 6));
              if (status === 'error') setStatus('idle');
            }}
            placeholder="ABC123"
            placeholderTextColor={APP_COLORS.textSecondary}
            maxLength={6}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={status !== 'loading'}
            accessibilityLabel="Share code"
          />

          {/* Status feedback */}
          {status === 'error' && (
            <View style={styles.feedback}>
              <Feather name="alert-circle" size={16} color={APP_COLORS.secondary} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.feedback}>
              <Feather name="check-circle" size={16} color={APP_COLORS.primary} />
              <Text style={styles.successText}>Imported successfully!</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              onPress={handleClose}
              style={styles.cancelButton}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>

            {status === 'success' ? (
              <Pressable
                onPress={handleClose}
                style={styles.importButton}
                accessibilityRole="button"
              >
                <Text style={styles.importText}>Done</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleImport}
                style={[
                  styles.importButton,
                  isDisabled ? styles.importButtonDisabled : undefined,
                ]}
                disabled={isDisabled}
                accessibilityRole="button"
              >
                {status === 'loading' ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.importText}>Import</Text>
                )}
              </Pressable>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dialog: {
    backgroundColor: APP_COLORS.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: APP_COLORS.textPrimary,
  },
  description: {
    fontSize: 14,
    color: APP_COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    backgroundColor: APP_COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 22,
    fontWeight: '700',
    color: APP_COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 6,
    marginBottom: 16,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: APP_COLORS.secondary,
    flex: 1,
  },
  successText: {
    fontSize: 13,
    color: APP_COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: APP_COLORS.textSecondary,
  },
  importButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: APP_COLORS.primary,
    alignItems: 'center',
  },
  importButtonDisabled: {
    opacity: 0.5,
  },
  importText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
