import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export type FilterOption = { label: string; value: string };

type FilterModalProps = {
  visible: boolean;
  title?: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClose: () => void;
};

export function FilterModal({ onClose, onToggle, options, selected, title = 'Filter', visible }: FilterModalProps) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>{title}</Text>
        <ScrollView>
          {options.map((opt) => {
            const active = selected.includes(opt.value);
            return (
              <Pressable key={opt.value} style={[styles.option, active && styles.active]} onPress={() => onToggle(opt.value)}>
                <Text style={active && styles.activeText}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable style={styles.done} onPress={onClose}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '60%' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  option: { paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8 },
  active: { backgroundColor: '#EBF5FF' },
  activeText: { color: '#208AEF', fontWeight: '600' },
  done: { marginTop: 16, backgroundColor: '#208AEF', borderRadius: 10, padding: 14, alignItems: 'center' },
  doneText: { color: '#FFF', fontWeight: '600', fontSize: 15 },
});
