import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  message,
  onCancel,
  onConfirm,
  title,
  visible,
}: ConfirmModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <Pressable style={styles.cancel} onPress={onCancel}>
              <Text>{cancelLabel}</Text>
            </Pressable>
            <Pressable style={styles.confirm} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  box: { backgroundColor: '#FFF', borderRadius: 14, padding: 24, width: '80%', gap: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  message: { fontSize: 14, color: '#60646C' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancel: { paddingVertical: 8, paddingHorizontal: 12 },
  confirm: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#208AEF', borderRadius: 8 },
  confirmText: { color: '#FFF', fontWeight: '600' },
});
